import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Radius, Shadow, Spacing, ThemeColors, Typography } from '../src/constants/theme'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'
import { Disease, Plant, PlantLocation, PlantPhoto } from '../src/types/plant'
import { getCareStatus } from '../src/hooks/useCareStatus'
import { TrafficLight } from '../src/components/TrafficLight'

function generateId() {
  return `plant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const LOCATIONS: PlantLocation[] = ['sun', 'partial-shade', 'shade', 'indoor']
const LOCATION_LABELS: Record<string, Record<PlantLocation, string>> = {
  de: { sun: '☀️ Sonne', 'partial-shade': '⛅ Halbschatten', shade: '🌥️ Schatten', indoor: '🏠 Innenraum' },
  en: { sun: '☀️ Full sun', 'partial-shade': '⛅ Partial shade', shade: '🌥️ Shade', indoor: '🏠 Indoor' },
}

function emptyPlant(): Plant {
  return {
    id: generateId(),
    name: '',
    scientificName: '',
    description: '',
    photos: [],
    location: 'indoor',
    room: '',
    careInfo: {
      wateringFrequencyDays: 7,
      wateringTips: '',
      fertilizingFrequencyDays: 14,
      fertilizingTips: '',
      locationTips: '',
      temperature: { min: 16, max: 28 },
      humidity: 'medium',
    },
    diseases: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function emptyDisease(): Disease {
  return { id: generateId(), name: '', symptoms: '', treatment: '' }
}

interface PlantFormProps {
  lang: 'de' | 'en'
  colors: ThemeColors
  initial?: Plant
  existingRooms: string[]
  onSave: (plant: Plant) => void
  onCancel: () => void
}

function PlantForm({ lang, colors, initial, existingRooms, onSave, onCancel }: PlantFormProps) {
  const [plant, setPlant] = useState<Plant>(initial ?? emptyPlant())
  const [newDisease, setNewDisease] = useState<Disease | null>(null)
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)

  const set = (update: Partial<Plant>) => setPlant((p) => ({ ...p, ...update, updatedAt: new Date().toISOString() }))
  const setCare = (update: Partial<Plant['careInfo']>) => set({ careInfo: { ...plant.careInfo, ...update } })

  const addPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      const photo: PlantPhoto = { uri: result.assets[0].uri, takenAt: new Date().toISOString() }
      set({ photos: [...plant.photos, photo] })
    }
  }

  const removePhoto = (uri: string) => set({ photos: plant.photos.filter((p) => p.uri !== uri) })

  const saveDisease = () => {
    if (!newDisease || !newDisease.name.trim()) return
    set({ diseases: [...plant.diseases, newDisease] })
    setNewDisease(null)
  }

  const removeDisease = (id: string) => set({ diseases: plant.diseases.filter((d) => d.id !== id) })

  const handleSave = () => {
    if (!plant.name.trim()) {
      Alert.alert('', t(lang, 'form_name_required'))
      return
    }
    onSave(plant)
  }

  const roomSuggestions = existingRooms.filter(
    (r) => r !== plant.room && r.toLowerCase().includes((plant.room ?? '').toLowerCase())
  )

  const inputStyle = [
    formStyles.input,
    { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
  ]
  const labelStyle = [formStyles.label, { color: colors.textMuted }]
  const sectionLabelStyle = [formStyles.sectionLabel, { color: colors.primaryLight }]

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={formStyles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={sectionLabelStyle}>{t(lang, 'form_section_plant_info')}</Text>

        <Text style={labelStyle}>{t(lang, 'add_plant_field_name')}</Text>
        <TextInput
          style={inputStyle}
          value={plant.name}
          onChangeText={(v) => set({ name: v })}
          placeholder={t(lang, 'form_plant_name_placeholder')}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={labelStyle}>{t(lang, 'form_field_scientific')}</Text>
        <TextInput
          style={inputStyle}
          value={plant.scientificName}
          onChangeText={(v) => set({ scientificName: v })}
          placeholder="Monstera deliciosa"
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={labelStyle}>{t(lang, 'add_plant_field_room')}</Text>
        <TextInput
          style={inputStyle}
          value={plant.room ?? ''}
          onChangeText={(v) => {
            set({ room: v })
            setShowRoomSuggestions(true)
          }}
          onFocus={() => setShowRoomSuggestions(true)}
          onBlur={() => setTimeout(() => setShowRoomSuggestions(false), 150)}
          placeholder={t(lang, 'form_room_placeholder')}
          placeholderTextColor={colors.textSubtle}
        />
        {showRoomSuggestions && roomSuggestions.length > 0 && (
          <View style={[formStyles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {roomSuggestions.map((r) => (
              <TouchableOpacity
                key={r}
                style={[formStyles.suggestionItem, { borderBottomColor: colors.background }]}
                onPress={() => {
                  set({ room: r })
                  setShowRoomSuggestions(false)
                }}
              >
                <Text style={[formStyles.suggestionText, { color: colors.primaryMid }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={labelStyle}>{t(lang, 'form_field_description')}</Text>
        <TextInput
          style={[inputStyle, formStyles.multiline]}
          value={plant.description}
          onChangeText={(v) => set({ description: v })}
          multiline
          numberOfLines={3}
          placeholder={t(lang, 'form_description_placeholder')}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={sectionLabelStyle}>{t(lang, 'form_section_sun')}</Text>
        <View style={formStyles.chipRow}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[
                formStyles.chip,
                { borderColor: colors.border, backgroundColor: colors.surface },
                plant.location === loc && { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
              ]}
              onPress={() => set({ location: loc })}
            >
              <Text
                style={[
                  formStyles.chipText,
                  { color: colors.primaryMid },
                  plant.location === loc && { color: '#fff', fontWeight: '600' },
                ]}
              >
                {LOCATION_LABELS[lang][loc]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={sectionLabelStyle}>{t(lang, 'form_section_care')}</Text>

        <Text style={labelStyle}>{t(lang, 'form_watering_interval')}</Text>
        <TextInput
          style={inputStyle}
          value={String(plant.careInfo.wateringFrequencyDays)}
          onChangeText={(v) => setCare({ wateringFrequencyDays: parseInt(v) || 7 })}
          keyboardType="number-pad"
        />

        <Text style={labelStyle}>{t(lang, 'form_watering_tips')}</Text>
        <TextInput
          style={[inputStyle, formStyles.multiline]}
          value={plant.careInfo.wateringTips}
          onChangeText={(v) => setCare({ wateringTips: v })}
          multiline
          numberOfLines={2}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={labelStyle}>{t(lang, 'form_fertilizing_interval')}</Text>
        <TextInput
          style={inputStyle}
          value={String(plant.careInfo.fertilizingFrequencyDays)}
          onChangeText={(v) => setCare({ fertilizingFrequencyDays: parseInt(v) || 14 })}
          keyboardType="number-pad"
        />

        <Text style={labelStyle}>{t(lang, 'form_fertilizing_tips')}</Text>
        <TextInput
          style={[inputStyle, formStyles.multiline]}
          value={plant.careInfo.fertilizingTips}
          onChangeText={(v) => setCare({ fertilizingTips: v })}
          multiline
          numberOfLines={2}
          placeholderTextColor={colors.textSubtle}
        />

        <Text style={labelStyle}>{t(lang, 'form_temp_min')}</Text>
        <TextInput
          style={inputStyle}
          value={String(plant.careInfo.temperature.min)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, min: parseInt(v) || 0 } })}
          keyboardType="number-pad"
        />

        <Text style={labelStyle}>{t(lang, 'form_temp_max')}</Text>
        <TextInput
          style={inputStyle}
          value={String(plant.careInfo.temperature.max)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, max: parseInt(v) || 30 } })}
          keyboardType="number-pad"
        />

        <Text style={labelStyle}>{t(lang, 'form_humidity')}</Text>
        <View style={formStyles.chipRow}>
          {(['low', 'medium', 'high'] as const).map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                formStyles.chip,
                { borderColor: colors.border, backgroundColor: colors.surface },
                plant.careInfo.humidity === h && { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
              ]}
              onPress={() => setCare({ humidity: h })}
            >
              <Text
                style={[
                  formStyles.chipText,
                  { color: colors.primaryMid },
                  plant.careInfo.humidity === h && { color: '#fff', fontWeight: '600' },
                ]}
              >
                {t(lang, h === 'low' ? 'humidity_low' : h === 'medium' ? 'humidity_medium' : 'humidity_high')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={sectionLabelStyle}>{t(lang, 'form_section_photos')}</Text>
        <View style={formStyles.photoGrid}>
          {plant.photos.map((photo) => (
            <View key={photo.uri} style={formStyles.photoWrapper}>
              <Image source={{ uri: photo.uri }} style={formStyles.photo} />
              <TouchableOpacity style={formStyles.removePhoto} onPress={() => removePhoto(photo.uri)}>
                <Text style={formStyles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[formStyles.addPhotoBtn, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
            onPress={addPhoto}
          >
            <Text style={[formStyles.addPhotoText, { color: colors.primaryLight }]}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={sectionLabelStyle}>{t(lang, 'form_section_diseases')}</Text>
        {plant.diseases.map((d) => (
          <View
            key={d.id}
            style={[
              formStyles.diseaseChip,
              { backgroundColor: colors.statusSoonSurface, borderLeftColor: colors.statusSoon },
            ]}
          >
            <Text style={[formStyles.diseaseChipText, { color: colors.primary }]}>🦠 {d.name}</Text>
            <TouchableOpacity onPress={() => removeDisease(d.id)}>
              <Text style={formStyles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        {newDisease ? (
          <View style={[formStyles.diseaseForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={labelStyle}>{t(lang, 'form_disease_name')}</Text>
            <TextInput
              style={inputStyle}
              value={newDisease.name}
              onChangeText={(v) => setNewDisease({ ...newDisease, name: v })}
            />
            <Text style={labelStyle}>{t(lang, 'form_disease_symptoms')}</Text>
            <TextInput
              style={[inputStyle, formStyles.multiline]}
              value={newDisease.symptoms}
              onChangeText={(v) => setNewDisease({ ...newDisease, symptoms: v })}
              multiline
              numberOfLines={2}
            />
            <Text style={labelStyle}>{t(lang, 'form_disease_treatment')}</Text>
            <TextInput
              style={[inputStyle, formStyles.multiline]}
              value={newDisease.treatment}
              onChangeText={(v) => setNewDisease({ ...newDisease, treatment: v })}
              multiline
              numberOfLines={2}
            />
            <View style={formStyles.row}>
              <TouchableOpacity
                style={[formStyles.btn, formStyles.btnSecondary, { borderColor: colors.border }]}
                onPress={() => setNewDisease(null)}
              >
                <Text style={[formStyles.btnSecondaryText, { color: colors.primaryMid }]}>{t(lang, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[formStyles.btn, formStyles.btnPrimary, { backgroundColor: colors.primaryMid }]}
                onPress={saveDisease}
              >
                <Text style={formStyles.btnPrimaryText}>{t(lang, 'form_add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[formStyles.addDiseaseBtn, { borderColor: colors.border }]}
            onPress={() => setNewDisease(emptyDisease())}
          >
            <Text style={[formStyles.addDiseaseBtnText, { color: colors.primaryLight }]}>
              + {t(lang, 'form_disease_add')}
            </Text>
          </TouchableOpacity>
        )}

        <View style={formStyles.actions}>
          <TouchableOpacity
            style={[formStyles.btn, formStyles.btnSecondary, { borderColor: colors.border }]}
            onPress={onCancel}
          >
            <Text style={[formStyles.btnSecondaryText, { color: colors.primaryMid }]}>{t(lang, 'cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[formStyles.btn, formStyles.btnPrimary, { backgroundColor: colors.primaryMid }]}
            onPress={handleSave}
          >
            <Text style={formStyles.btnPrimaryText}>{t(lang, 'save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default function ManagePlantsScreen() {
  const { plants, updatePlant, deletePlant } = usePlants()
  const { language: lang } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()
  const [editing, setEditing] = useState<Plant | null>(null)

  const existingRooms = [...new Set(plants.map((p) => p.room).filter((r): r is string => !!r?.trim()))]

  const handleDelete = (plant: Plant) => {
    Alert.alert(t(lang, 'manage_plants_delete_title'), t(lang, 'manage_plants_delete_body', { name: plant.name }), [
      { text: t(lang, 'cancel'), style: 'cancel' },
      {
        text: t(lang, 'delete'),
        style: 'destructive',
        onPress: () => deletePlant(plant.id),
      },
    ])
  }

  if (editing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setEditing(null)} style={styles.backBtn}>
              <Text style={[styles.backBtnText, { color: colors.gradientText }]}>← {t(lang, 'back')}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t(lang, 'manage_plants_edit_title')}</Text>
          </View>
        </LinearGradient>
        <PlantForm
          lang={lang}
          colors={colors}
          initial={editing}
          existingRooms={existingRooms}
          onSave={async (p) => {
            await updatePlant(p)
            setEditing(null)
          }}
          onCancel={() => setEditing(null)}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: colors.gradientText }]}>← {t(lang, 'back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t(lang, 'manage_plants_title')}</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primaryMid }]}
          onPress={() => router.push('/add-plant')}
        >
          <Text style={styles.addBtnText}>+ {lang === 'de' ? 'Pflanze hinzufügen' : 'Add plant'}</Text>
        </TouchableOpacity>
        {plants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🪴</Text>
            <Text style={[styles.emptyText, { color: colors.primaryLight }]}>{t(lang, 'manage_plants_empty')}</Text>
          </View>
        ) : (
          plants.map((plant) => {
            const status = getCareStatus(plant)
            return (
              <View key={plant.id} style={[styles.plantRow, { backgroundColor: colors.surface }, Shadow.cardSm]}>
                <View style={styles.plantInfo}>
                  <View style={styles.plantNameRow}>
                    <Text style={[styles.plantName, { color: colors.primary }]} numberOfLines={1}>
                      {plant.name}
                    </Text>
                    <TrafficLight status={status.overall} size={12} />
                  </View>
                  {plant.room ? (
                    <Text style={[styles.plantRoom, { color: colors.accent }]}>📍 {plant.room}</Text>
                  ) : null}
                </View>
                <View style={styles.plantActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => setEditing(plant)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.editBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(plant)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  backBtn: { paddingVertical: Spacing.xs },
  backBtnText: { fontSize: 15 },
  headerTitle: { ...Typography.headerTitleSm, color: '#fff', flex: 1 },
  scroll: { padding: Spacing.lg },
  addBtn: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: 16, textAlign: 'center' },
  plantRow: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  plantInfo: { flex: 1 },
  plantNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  plantName: { fontSize: 16, fontWeight: '500', flex: 1 },
  plantRoom: { fontSize: 12, marginTop: 2 },
  plantActions: { flexDirection: 'row', gap: Spacing.sm },
  editBtn: { padding: Spacing.xs + 2 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { padding: Spacing.xs + 2 },
  deleteBtnText: { fontSize: 18 },
})

const formStyles = StyleSheet.create({
  scroll: { padding: Spacing.lg },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  label: { fontSize: 13, marginBottom: Spacing.xs, marginTop: Spacing.md - 2 },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    padding: Spacing.md - 2,
    fontSize: 15,
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 3,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 13 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  photoWrapper: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: Radius.sm },
  removePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E63946',
    borderRadius: Radius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: { fontSize: 28 },
  diseaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.sm,
    padding: Spacing.md - 2,
    marginBottom: Spacing.xs + 2,
    borderLeftWidth: 3,
  },
  diseaseChipText: { fontSize: 14 },
  diseaseForm: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  addDiseaseBtn: {
    padding: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: Spacing.xs,
  },
  addDiseaseBtnText: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: Spacing.md - 2, marginTop: Spacing.xxl },
  row: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  btn: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center' },
  btnPrimary: {},
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 1.5 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecondaryText: { fontSize: 15 },
  suggestions: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: 2,
    overflow: 'hidden',
  },
  suggestionItem: { padding: Spacing.md - 2, borderBottomWidth: 1 },
  suggestionText: { fontSize: 14 },
})
