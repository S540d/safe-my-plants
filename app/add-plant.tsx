import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  FlatList,
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
import { PLANT_TEMPLATES, PlantTemplate } from '../src/constants/plantTemplates'
import { Radius, Shadow, Spacing } from '../src/constants/theme'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'
import { Plant } from '../src/types/plant'

function generateId() {
  return `plant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

type Step = 'search' | 'details'

export default function AddPlantScreen() {
  const { plants, addPlant } = usePlants()
  const { language: lang } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()

  const [step, setStep] = useState<Step>('search')
  const [query, setQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<PlantTemplate | null>(null)
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)

  const existingRooms = [...new Set(plants.map((p) => p.room).filter((r): r is string => !!r?.trim()))]

  const filteredTemplates = PLANT_TEMPLATES.filter((tmpl) => {
    const q = query.toLowerCase()
    return (
      tmpl.name.toLowerCase().includes(q) ||
      (tmpl.scientificName ?? '').toLowerCase().includes(q) ||
      (tmpl.aliases ?? []).some((a) => a.toLowerCase().includes(q))
    )
  })

  const roomSuggestions = existingRooms.filter((r) => r !== room && r.toLowerCase().includes(room.toLowerCase()))

  const handleSelectTemplate = (template: PlantTemplate) => {
    setSelectedTemplate(template)
    setName(template.name)
    setStep('details')
  }

  const handleCustomPlant = () => {
    setSelectedTemplate(null)
    setName(query.trim())
    setStep('details')
  }

  const handleSave = async () => {
    const plantName = name.trim()
    if (!plantName) return

    const now = new Date().toISOString()
    const base = selectedTemplate ?? {
      name: plantName,
      scientificName: undefined,
      description: '',
      location: 'indoor' as const,
      diseases: [],
      careInfo: {
        wateringFrequencyDays: 7,
        wateringTips: '',
        fertilizingFrequencyDays: 14,
        fertilizingTips: '',
        locationTips: '',
        temperature: { min: 16, max: 28 },
        humidity: 'medium' as const,
      },
    }

    const templatePhoto = selectedTemplate?.imageUrl ? [{ uri: selectedTemplate.imageUrl, takenAt: now }] : []

    const newPlant: Plant = {
      ...base,
      id: generateId(),
      name: plantName,
      room: room.trim() || undefined,
      photos: templatePhoto,
      lastWatered: undefined,
      lastFertilized: undefined,
      createdAt: now,
      updatedAt: now,
    }

    await addPlant(newPlant)
    router.back()
  }

  if (step === 'details') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setStep('search')} style={styles.backBtn}>
              <Text style={[styles.backBtnText, { color: colors.gradientText }]}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t(lang, 'add_plant_title')}</Text>
          </View>
        </LinearGradient>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            {selectedTemplate && (
              <View style={[styles.templateBadge, { backgroundColor: colors.accentSurface }]}>
                <Text style={[styles.templateBadgeText, { color: colors.primary }]}>
                  📋 {t(lang, 'add_plant_template_badge')} {selectedTemplate.name}
                </Text>
              </View>
            )}

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t(lang, 'add_plant_field_name')}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
              ]}
              value={name}
              onChangeText={setName}
              placeholder={t(lang, 'add_plant_field_name_placeholder')}
              placeholderTextColor={colors.textSubtle}
              autoFocus={!selectedTemplate}
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t(lang, 'add_plant_field_room')}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
              ]}
              value={room}
              onChangeText={(v) => {
                setRoom(v)
                setShowRoomSuggestions(true)
              }}
              onFocus={() => setShowRoomSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRoomSuggestions(false), 150)}
              placeholder={t(lang, 'add_plant_field_room_placeholder')}
              placeholderTextColor={colors.textSubtle}
            />
            {showRoomSuggestions && roomSuggestions.length > 0 && (
              <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {roomSuggestions.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.suggestionItem, { borderBottomColor: colors.background }]}
                    onPress={() => {
                      setRoom(r)
                      setShowRoomSuggestions(false)
                    }}
                  >
                    <Text style={[styles.suggestionText, { color: colors.primaryMid }]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedTemplate && (
              <View style={[styles.previewCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Text style={[styles.previewTitle, { color: colors.primaryLight }]}>
                  {t(lang, 'add_plant_care_preview_title')}
                </Text>
                <Text style={[styles.previewItem, { color: colors.primary }]}>
                  💧 {t(lang, 'add_plant_water_every')} {selectedTemplate.careInfo.wateringFrequencyDays}{' '}
                  {t(lang, 'days')}
                </Text>
                <Text style={[styles.previewItem, { color: colors.primary }]}>
                  🌿 {t(lang, 'add_plant_fertilize_every')} {selectedTemplate.careInfo.fertilizingFrequencyDays}{' '}
                  {t(lang, 'days')}
                </Text>
              </View>
            )}

            <Text style={[styles.hint, { color: colors.textSubtle }]}>{t(lang, 'add_plant_hint')}</Text>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: colors.primaryMid },
                !name.trim() && { backgroundColor: colors.accentMuted },
              ]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveBtnText}>{t(lang, 'add_plant_save')} ✓</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: colors.gradientText }]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t(lang, 'add_plant_title')}</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
          ]}
          value={query}
          onChangeText={setQuery}
          placeholder={t(lang, 'add_plant_search_placeholder')}
          placeholderTextColor={colors.textSubtle}
          autoFocus
        />
      </View>

      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.templateList}
        ListHeaderComponent={
          query.trim() ? (
            <TouchableOpacity
              style={[styles.customRow, { backgroundColor: colors.accentSurface, borderColor: colors.primaryLight }]}
              onPress={handleCustomPlant}
            >
              <View style={styles.customRowContent}>
                <Text style={[styles.customRowLabel, { color: colors.primary }]}>
                  ➕ {t(lang, 'add_plant_custom_label')} „{query.trim()}"
                </Text>
                <Text style={[styles.customRowSub, { color: colors.primaryLight }]}>
                  {t(lang, 'add_plant_custom_sub')}
                </Text>
              </View>
              <Text style={[styles.rowArrow, { color: colors.primaryLight }]}>→</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.templateRow, { backgroundColor: colors.surface }, Shadow.cardSm]}
            onPress={() => handleSelectTemplate(item)}
          >
            <View style={styles.templateRowContent}>
              <Text style={[styles.templateName, { color: colors.primary }]}>{item.name}</Text>
              {item.scientificName ? (
                <Text style={[styles.templateScientific, { color: colors.accent }]}>{item.scientificName}</Text>
              ) : null}
              {item.aliases && item.aliases.length > 0 ? (
                <Text style={[styles.templateAliases, { color: colors.textSubtle }]}>
                  {t(lang, 'add_plant_aka')} {item.aliases.join(', ')}
                </Text>
              ) : null}
              <Text style={[styles.templateMeta, { color: colors.textMuted }]}>
                💧 {item.careInfo.wateringFrequencyDays}d · 🌿 {item.careInfo.fertilizingFrequencyDays}d
              </Text>
            </View>
            <Text style={[styles.rowArrow, { color: colors.primaryLight }]}>→</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.trim() ? null : (
            <View style={styles.emptyHint}>
              <Text style={[styles.emptyHintText, { color: colors.accent }]}>{t(lang, 'add_plant_empty_hint')}</Text>
            </View>
          )
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  backBtn: { paddingVertical: Spacing.xs, paddingRight: Spacing.sm },
  backBtnText: { fontSize: 20, fontWeight: '600' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff', flex: 1 },
  searchContainer: { padding: Spacing.md },
  searchInput: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    fontSize: 15,
  },
  templateList: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  customRow: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: Spacing.xs,
  },
  customRowContent: { flex: 1 },
  customRowLabel: { fontSize: 15, fontWeight: '600' },
  customRowSub: { fontSize: 12, marginTop: 2 },
  templateRow: {
    borderRadius: Radius.lg,
    padding: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateRowContent: { flex: 1 },
  templateName: { fontSize: 16, fontWeight: '600' },
  templateScientific: { fontSize: 12, fontStyle: 'italic', marginTop: 1 },
  templateAliases: { fontSize: 11, marginTop: 1 },
  templateMeta: { fontSize: 12, marginTop: Spacing.xs },
  rowArrow: { fontSize: 18, marginLeft: Spacing.sm },
  emptyHint: { padding: 32, alignItems: 'center' },
  emptyHintText: { fontSize: 15, textAlign: 'center' },
  detailScroll: { padding: Spacing.xl, gap: Spacing.xs },
  templateBadge: {
    borderRadius: Radius.sm,
    padding: Spacing.md - 2,
    marginBottom: Spacing.md,
  },
  templateBadgeText: { fontSize: 13, fontWeight: '500' },
  fieldLabel: { fontSize: 13, marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 15,
  },
  suggestions: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: 2,
    overflow: 'hidden',
  },
  suggestionItem: { padding: Spacing.md - 2, borderBottomWidth: 1 },
  suggestionText: { fontSize: 14 },
  previewCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
  },
  previewTitle: { fontSize: 12, fontWeight: '700', marginBottom: Spacing.xs + 2 },
  previewItem: { fontSize: 14, marginBottom: 3 },
  hint: { fontSize: 13, marginTop: Spacing.lg, lineHeight: 18 },
  saveBtn: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
