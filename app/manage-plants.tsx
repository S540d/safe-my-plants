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
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
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
  initial?: Plant
  existingRooms: string[]
  onSave: (plant: Plant) => void
  onCancel: () => void
}

function PlantForm({ lang, initial, existingRooms, onSave, onCancel }: PlantFormProps) {
  const [plant, setPlant] = useState<Plant>(initial ?? emptyPlant())
  const [newDisease, setNewDisease] = useState<Disease | null>(null)
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)

  const set = (update: Partial<Plant>) =>
    setPlant((p) => ({ ...p, ...update, updatedAt: new Date().toISOString() }))
  const setCare = (update: Partial<Plant['careInfo']>) =>
    set({ careInfo: { ...plant.careInfo, ...update } })

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

  const removePhoto = (uri: string) =>
    set({ photos: plant.photos.filter((p) => p.uri !== uri) })

  const saveDisease = () => {
    if (!newDisease || !newDisease.name.trim()) return
    set({ diseases: [...plant.diseases, newDisease] })
    setNewDisease(null)
  }

  const removeDisease = (id: string) =>
    set({ diseases: plant.diseases.filter((d) => d.id !== id) })

  const handleSave = () => {
    if (!plant.name.trim()) {
      Alert.alert('', lang === 'de' ? 'Name ist erforderlich.' : 'Name is required.')
      return
    }
    onSave(plant)
  }

  const L = (de: string, en: string) => (lang === 'de' ? de : en)

  const roomSuggestions = existingRooms.filter(
    (r) => r !== plant.room && r.toLowerCase().includes((plant.room ?? '').toLowerCase()),
  )

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={formStyles.scroll} showsVerticalScrollIndicator={false}>
        <SectionLabel text={L('Pflanzendaten', 'Plant Info')} />

        <Label text={L('Name *', 'Name *')} />
        <TextInput
          style={formStyles.input}
          value={plant.name}
          onChangeText={(v) => set({ name: v })}
          placeholder={L('z.B. Monstera', 'e.g. Monstera')}
        />

        <Label text={L('Wissenschaftlicher Name', 'Scientific Name')} />
        <TextInput
          style={formStyles.input}
          value={plant.scientificName}
          onChangeText={(v) => set({ scientificName: v })}
          placeholder="Monstera deliciosa"
        />

        <Label text={L('Raum / Aufstellort', 'Room / Location')} />
        <TextInput
          style={formStyles.input}
          value={plant.room ?? ''}
          onChangeText={(v) => { set({ room: v }); setShowRoomSuggestions(true) }}
          onFocus={() => setShowRoomSuggestions(true)}
          onBlur={() => setTimeout(() => setShowRoomSuggestions(false), 150)}
          placeholder={L('z.B. Wohnzimmer', 'e.g. Living room')}
        />
        {showRoomSuggestions && roomSuggestions.length > 0 && (
          <View style={formStyles.suggestions}>
            {roomSuggestions.map((r) => (
              <TouchableOpacity
                key={r}
                style={formStyles.suggestionItem}
                onPress={() => { set({ room: r }); setShowRoomSuggestions(false) }}
              >
                <Text style={formStyles.suggestionText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Label text={L('Beschreibung', 'Description')} />
        <TextInput
          style={[formStyles.input, formStyles.multiline]}
          value={plant.description}
          onChangeText={(v) => set({ description: v })}
          multiline
          numberOfLines={3}
          placeholder={L('Kurze Beschreibung...', 'Short description...')}
        />

        <SectionLabel text={L('Standort', 'Sun exposure')} />
        <View style={formStyles.chipRow}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[formStyles.chip, plant.location === loc && formStyles.chipActive]}
              onPress={() => set({ location: loc })}
            >
              <Text style={[formStyles.chipText, plant.location === loc && formStyles.chipTextActive]}>
                {LOCATION_LABELS[lang][loc]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Pflege', 'Care')} />

        <Label text={L('Gießintervall (Tage)', 'Watering interval (days)')} />
        <TextInput
          style={formStyles.input}
          value={String(plant.careInfo.wateringFrequencyDays)}
          onChangeText={(v) => setCare({ wateringFrequencyDays: parseInt(v) || 7 })}
          keyboardType="number-pad"
        />

        <Label text={L('Gießtipps', 'Watering tips')} />
        <TextInput
          style={[formStyles.input, formStyles.multiline]}
          value={plant.careInfo.wateringTips}
          onChangeText={(v) => setCare({ wateringTips: v })}
          multiline
          numberOfLines={2}
        />

        <Label text={L('Düngintervall (Tage)', 'Fertilizing interval (days)')} />
        <TextInput
          style={formStyles.input}
          value={String(plant.careInfo.fertilizingFrequencyDays)}
          onChangeText={(v) => setCare({ fertilizingFrequencyDays: parseInt(v) || 14 })}
          keyboardType="number-pad"
        />

        <Label text={L('Düngetipps', 'Fertilizing tips')} />
        <TextInput
          style={[formStyles.input, formStyles.multiline]}
          value={plant.careInfo.fertilizingTips}
          onChangeText={(v) => setCare({ fertilizingTips: v })}
          multiline
          numberOfLines={2}
        />

        <Label text={L('Temperatur min (°C)', 'Temperature min (°C)')} />
        <TextInput
          style={formStyles.input}
          value={String(plant.careInfo.temperature.min)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, min: parseInt(v) || 0 } })}
          keyboardType="number-pad"
        />

        <Label text={L('Temperatur max (°C)', 'Temperature max (°C)')} />
        <TextInput
          style={formStyles.input}
          value={String(plant.careInfo.temperature.max)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, max: parseInt(v) || 30 } })}
          keyboardType="number-pad"
        />

        <Label text={L('Luftfeuchtigkeit', 'Humidity')} />
        <View style={formStyles.chipRow}>
          {(['low', 'medium', 'high'] as const).map((h) => (
            <TouchableOpacity
              key={h}
              style={[formStyles.chip, plant.careInfo.humidity === h && formStyles.chipActive]}
              onPress={() => setCare({ humidity: h })}
            >
              <Text style={[formStyles.chipText, plant.careInfo.humidity === h && formStyles.chipTextActive]}>
                {h === 'low' ? L('Niedrig', 'Low') : h === 'medium' ? L('Mittel', 'Medium') : L('Hoch', 'High')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Fotos', 'Photos')} />
        <View style={formStyles.photoGrid}>
          {plant.photos.map((photo) => (
            <View key={photo.uri} style={formStyles.photoWrapper}>
                  <Image source={{ uri: photo.uri }} style={formStyles.photo} />
              <TouchableOpacity style={formStyles.removePhoto} onPress={() => removePhoto(photo.uri)}>
                <Text style={formStyles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={formStyles.addPhotoBtn} onPress={addPhoto}>
            <Text style={formStyles.addPhotoText}>+</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel text={L('Krankheiten & Schädlinge', 'Diseases & Pests')} />
        {plant.diseases.map((d) => (
          <View key={d.id} style={formStyles.diseaseChip}>
            <Text style={formStyles.diseaseChipText}>🦠 {d.name}</Text>
            <TouchableOpacity onPress={() => removeDisease(d.id)}>
              <Text style={formStyles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        {newDisease ? (
          <View style={formStyles.diseaseForm}>
            <Label text={L('Krankheitsname', 'Disease name')} />
            <TextInput
              style={formStyles.input}
              value={newDisease.name}
              onChangeText={(v) => setNewDisease({ ...newDisease, name: v })}
            />
            <Label text={L('Symptome', 'Symptoms')} />
            <TextInput
              style={[formStyles.input, formStyles.multiline]}
              value={newDisease.symptoms}
              onChangeText={(v) => setNewDisease({ ...newDisease, symptoms: v })}
              multiline
              numberOfLines={2}
            />
            <Label text={L('Behandlung', 'Treatment')} />
            <TextInput
              style={[formStyles.input, formStyles.multiline]}
              value={newDisease.treatment}
              onChangeText={(v) => setNewDisease({ ...newDisease, treatment: v })}
              multiline
              numberOfLines={2}
            />
            <View style={formStyles.row}>
              <TouchableOpacity
                style={[formStyles.btn, formStyles.btnSecondary]}
                onPress={() => setNewDisease(null)}
              >
                <Text style={formStyles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[formStyles.btn, formStyles.btnPrimary]} onPress={saveDisease}>
                <Text style={formStyles.btnPrimaryText}>{L('Hinzufügen', 'Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={formStyles.addDiseaseBtn} onPress={() => setNewDisease(emptyDisease())}>
            <Text style={formStyles.addDiseaseBtnText}>+ {L('Krankheit hinzufügen', 'Add disease')}</Text>
          </TouchableOpacity>
        )}

        <View style={formStyles.actions}>
          <TouchableOpacity style={[formStyles.btn, formStyles.btnSecondary]} onPress={onCancel}>
            <Text style={formStyles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[formStyles.btn, formStyles.btnPrimary]} onPress={handleSave}>
            <Text style={formStyles.btnPrimaryText}>{L('Speichern', 'Save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={formStyles.label}>{text}</Text>
}
function SectionLabel({ text }: { text: string }) {
  return <Text style={formStyles.sectionLabel}>{text}</Text>
}

export default function ManagePlantsScreen() {
  const { plants, addPlant, updatePlant, deletePlant } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()
  const [editing, setEditing] = useState<Plant | null>(null)
  const lang = language

  const existingRooms = [...new Set(plants.map((p) => p.room).filter((r): r is string => !!r?.trim()))]

  const handleDelete = (plant: Plant) => {
    Alert.alert(
      lang === 'de' ? 'Löschen?' : 'Delete?',
      lang === 'de' ? `"${plant.name}" wirklich löschen?` : `Really delete "${plant.name}"?`,
      [
        { text: lang === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        {
          text: lang === 'de' ? 'Löschen' : 'Delete',
          style: 'destructive',
          onPress: () => deletePlant(plant.id),
        },
      ],
    )
  }

  if (editing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setEditing(null)} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← {lang === 'de' ? 'Zurück' : 'Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {lang === 'de' ? 'Pflanze bearbeiten' : 'Edit Plant'}
            </Text>
          </View>
        </LinearGradient>
        <PlantForm
          lang={lang}
          initial={editing}
          existingRooms={existingRooms}
          onSave={async (p) => { await updatePlant(p); setEditing(null) }}
          onCancel={() => setEditing(null)}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← {lang === 'de' ? 'Zurück' : 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {lang === 'de' ? 'Pflanzen verwalten' : 'Manage Plants'}
          </Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll}>
        {plants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🪴</Text>
            <Text style={styles.emptyText}>
              {lang === 'de' ? 'Noch keine Pflanzen vorhanden.' : 'No plants yet.'}
            </Text>
          </View>
        ) : (
          plants.map((plant) => {
            const status = getCareStatus(plant)
            return (
              <View key={plant.id} style={styles.plantRow}>
                <View style={styles.plantInfo}>
                  <View style={styles.plantNameRow}>
                    <Text style={styles.plantName} numberOfLines={1}>
                      {plant.name}
                    </Text>
                    <TrafficLight status={status.overall} size={12} />
                  </View>
                  {plant.room ? (
                    <Text style={styles.plantRoom}>📍 {plant.room}</Text>
                  ) : null}
                </View>
                <View style={styles.plantActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(plant)}>
                    <Text style={styles.editBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(plant)}>
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
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { paddingVertical: 4 },
  backBtnText: { color: '#B7E4C7', fontSize: 15 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff', flex: 1 },
  scroll: { padding: 16 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#52B788', textAlign: 'center' },
  plantRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  plantInfo: { flex: 1 },
  plantNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plantName: { fontSize: 16, color: '#1B4332', fontWeight: '500', flex: 1 },
  plantRoom: { fontSize: 12, color: '#74C69D', marginTop: 2 },
  plantActions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 18 },
})

const formStyles = StyleSheet.create({
  scroll: { padding: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52B788',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
  },
  label: { fontSize: 13, color: '#666', marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  chipText: { fontSize: 13, color: '#2D6A4F' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrapper: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: 8 },
  removePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E63946',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#B7E4C7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FFF4',
  },
  addPhotoText: { fontSize: 28, color: '#52B788' },
  diseaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F4A261',
  },
  diseaseChipText: { fontSize: 14, color: '#1B4332' },
  diseaseForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },
  addDiseaseBtn: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addDiseaseBtnText: { color: '#52B788', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2D6A4F' },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#B7E4C7' },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecondaryText: { color: '#2D6A4F', fontSize: 15 },
  suggestions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    marginTop: 2,
    overflow: 'hidden',
  },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#F0FFF4' },
  suggestionText: { fontSize: 14, color: '#2D6A4F' },
})
