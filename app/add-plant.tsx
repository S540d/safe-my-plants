import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { AnimatedPressable } from '../src/components/AnimatedPressable'
import { Icon } from '../src/components/Icon'
import { ScreenHeader } from '../src/components/ScreenHeader'
import { PLANT_TEMPLATES, PlantTemplate } from '../src/constants/plantTemplates'
import { Radius, Shadow, Spacing, ThemeColors, Typography } from '../src/constants/theme'
import { usePlants } from '../src/contexts/PlantContext'
import { notifyCareLogUpdate } from '../src/hooks/useCareLog'
import { addCareAction } from '../src/services/storage'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'
import { Plant } from '../src/types/plant'
import { generateId } from '../src/utils/id'
import {
  LAST_FERTILIZED_CHOICES,
  LAST_WATERED_CHOICES,
  LastFertilizedChoice,
  LastWateredChoice,
  lastFertilizedFromChoice,
  lastWateredFromChoice,
  shouldLogCare,
} from '../src/utils/lastCare'

const LAST_WATERED_LABEL_KEYS = {
  today: 'add_plant_last_watered_today',
  'few-days': 'add_plant_last_watered_few_days',
  week: 'add_plant_last_watered_week',
  unknown: 'add_plant_last_watered_unknown',
} as const

const LAST_FERTILIZED_LABEL_KEYS = {
  today: 'add_plant_last_fertilized_today',
  'two-weeks': 'add_plant_last_fertilized_two_weeks',
  month: 'add_plant_last_fertilized_month',
  unknown: 'add_plant_last_fertilized_unknown',
} as const

type Step = 'search' | 'details'

function ChoiceRow<T extends string>({
  choices,
  value,
  onChange,
  label,
  colors,
}: {
  choices: T[]
  value: T
  onChange: (choice: T) => void
  label: (choice: T) => string
  colors: ThemeColors
}) {
  return (
    <View style={styles.choiceRow}>
      {choices.map((choice) => {
        const active = value === choice
        return (
          <AnimatedPressable
            key={choice}
            style={[
              styles.choiceChip,
              { borderColor: colors.border, backgroundColor: colors.surface },
              active && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => onChange(choice)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.choiceChipText,
                { color: colors.primaryMid },
                active && { color: colors.textOnPrimary, fontWeight: '600' },
              ]}
            >
              {label(choice)}
            </Text>
          </AnimatedPressable>
        )
      })}
    </View>
  )
}

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
  const [lastWatered, setLastWatered] = useState<LastWateredChoice>('unknown')
  const [lastFertilized, setLastFertilized] = useState<LastFertilizedChoice>('unknown')

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
      id: generateId('plant'),
      name: plantName,
      room: room.trim() || undefined,
      photos: templatePhoto,
      lastWatered: lastWateredFromChoice(lastWatered, new Date(now)),
      lastFertilized: lastFertilizedFromChoice(lastFertilized, new Date(now)),
      createdAt: now,
      updatedAt: now,
    }

    await addPlant(newPlant)
    if (shouldLogCare(lastWatered)) {
      await addCareAction({ id: generateId(), plantId: newPlant.id, type: 'water', timestamp: now })
    }
    if (shouldLogCare(lastFertilized)) {
      await addCareAction({ id: generateId(), plantId: newPlant.id, type: 'fertilize', timestamp: now })
    }
    if (shouldLogCare(lastWatered) || shouldLogCare(lastFertilized)) notifyCareLogUpdate()
    router.back()
  }

  if (step === 'details') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t(lang, 'add_plant_title')} onBack={() => setStep('search')} backLabel={t(lang, 'back')} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            {selectedTemplate && (
              <View style={[styles.templateBadge, { backgroundColor: colors.accentSurface }]}>
                <Icon name="template" size={16} color={colors.primaryLight} />
                <Text style={[styles.templateBadgeText, { color: colors.primary }]}>
                  {t(lang, 'add_plant_template_badge')} {selectedTemplate.name}
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
                  <AnimatedPressable
                    key={r}
                    style={[styles.suggestionItem, { borderBottomColor: colors.background }]}
                    onPress={() => {
                      setRoom(r)
                      setShowRoomSuggestions(false)
                    }}
                  >
                    <Text style={[styles.suggestionText, { color: colors.primaryMid }]}>{r}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            )}

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t(lang, 'add_plant_last_watered')}</Text>
            <ChoiceRow
              choices={LAST_WATERED_CHOICES}
              value={lastWatered}
              onChange={setLastWatered}
              label={(choice) => t(lang, LAST_WATERED_LABEL_KEYS[choice])}
              colors={colors}
            />
            {lastWatered === 'unknown' && (
              <Text style={[styles.hint, { color: colors.textSubtle, marginTop: Spacing.sm }]}>
                {t(lang, 'add_plant_last_watered_hint')}
              </Text>
            )}

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t(lang, 'add_plant_last_fertilized')}</Text>
            <ChoiceRow
              choices={LAST_FERTILIZED_CHOICES}
              value={lastFertilized}
              onChange={setLastFertilized}
              label={(choice) => t(lang, LAST_FERTILIZED_LABEL_KEYS[choice])}
              colors={colors}
            />

            {selectedTemplate && (
              <View style={[styles.previewCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                <Text style={[styles.previewTitle, { color: colors.primaryLight }]}>
                  {t(lang, 'add_plant_care_preview_title')}
                </Text>
                <View style={styles.previewRow}>
                  <Icon name="water" size={16} color={colors.primaryLight} />
                  <Text style={[styles.previewItem, { color: colors.primary }]}>
                    {t(lang, 'add_plant_water_every')} {selectedTemplate.careInfo.wateringFrequencyDays}{' '}
                    {t(lang, 'days')}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Icon name="fertilize" size={16} color={colors.primaryLight} />
                  <Text style={[styles.previewItem, { color: colors.primary }]}>
                    {t(lang, 'add_plant_fertilize_every')} {selectedTemplate.careInfo.fertilizingFrequencyDays}{' '}
                    {t(lang, 'days')}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.hint, { color: colors.textSubtle }]}>{t(lang, 'add_plant_hint')}</Text>

            <AnimatedPressable
              style={[
                styles.saveBtn,
                { backgroundColor: colors.primary },
                !name.trim() && { backgroundColor: colors.accentMuted },
              ]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Icon name="check" size={20} color={colors.textOnPrimary} />
              <Text style={[styles.saveBtnText, { color: colors.textOnPrimary }]}>{t(lang, 'add_plant_save')}</Text>
            </AnimatedPressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t(lang, 'add_plant_title')} onBack={() => router.back()} backLabel={t(lang, 'back')} />

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
            <AnimatedPressable
              style={[styles.customRow, { backgroundColor: colors.accentSurface, borderColor: colors.primaryLight }]}
              onPress={handleCustomPlant}
            >
              <View style={[styles.thumb, styles.thumbIcon, { backgroundColor: colors.surface }]}>
                <Icon name="add" size={26} color={colors.primaryLight} />
              </View>
              <View style={styles.customRowContent}>
                <Text style={[styles.customRowLabel, { color: colors.primary }]}>
                  {t(lang, 'add_plant_custom_label')} „{query.trim()}"
                </Text>
                <Text style={[styles.customRowSub, { color: colors.primaryLight }]}>
                  {t(lang, 'add_plant_custom_sub')}
                </Text>
              </View>
              <Icon name="forward" size={20} color={colors.textSubtle} style={styles.rowArrow} />
            </AnimatedPressable>
          ) : undefined
        }
        renderItem={({ item }) => (
          <AnimatedPressable
            style={[styles.templateRow, { backgroundColor: colors.surface }, Shadow.cardSm]}
            onPress={() => handleSelectTemplate(item)}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={[styles.thumb, { backgroundColor: colors.accentSurface }]}
              />
            ) : (
              <View style={[styles.thumb, styles.thumbIcon, { backgroundColor: colors.accentSurface }]}>
                <Icon name="plants" size={24} color={colors.primaryLight} />
              </View>
            )}
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
              <View style={styles.templateMetaRow}>
                <Icon name="water" size={13} color={colors.textMuted} />
                <Text style={[styles.templateMeta, { color: colors.textMuted }]}>
                  {item.careInfo.wateringFrequencyDays} {t(lang, 'days')}
                </Text>
                <Icon name="fertilize" size={13} color={colors.textMuted} />
                <Text style={[styles.templateMeta, { color: colors.textMuted }]}>
                  {item.careInfo.fertilizingFrequencyDays} {t(lang, 'days')}
                </Text>
              </View>
            </View>
            <Icon name="forward" size={20} color={colors.textSubtle} style={styles.rowArrow} />
          </AnimatedPressable>
        )}
        ListEmptyComponent={
          query.trim() ? undefined : (
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
  searchContainer: { padding: Spacing.md, paddingTop: Spacing.lg },
  searchInput: {
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    padding: Spacing.md,
    fontSize: 15,
  },
  templateList: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  customRow: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    marginBottom: Spacing.xs,
  },
  customRowContent: { flex: 1 },
  customRowLabel: { fontSize: 15, fontWeight: '600' },
  customRowSub: { fontSize: 12, marginTop: 2 },
  templateRow: {
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  thumb: { width: 56, height: 56, borderRadius: Radius.lg },
  thumbIcon: { alignItems: 'center', justifyContent: 'center' },
  templateRowContent: { flex: 1 },
  templateName: { ...Typography.title, fontSize: 17 },
  templateScientific: { fontSize: 12, fontStyle: 'italic', marginTop: 1 },
  templateAliases: { fontSize: 11, marginTop: 1 },
  templateMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.xs },
  templateMeta: { fontSize: 12, marginRight: Spacing.sm },
  rowArrow: { marginLeft: Spacing.xs },
  emptyHint: { padding: 32, alignItems: 'center' },
  emptyHintText: { fontSize: 15, textAlign: 'center' },
  detailScroll: { padding: Spacing.xl, gap: Spacing.xs },
  templateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  templateBadgeText: { fontSize: 13, fontWeight: '500' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  choiceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  choiceChipText: { fontSize: 14 },
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
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
  },
  previewTitle: { fontSize: 12, fontWeight: '700', marginBottom: Spacing.xs + 2 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  previewItem: { fontSize: 14 },
  hint: { fontSize: 13, marginTop: Spacing.lg, lineHeight: 18 },
  saveBtn: {
    borderRadius: Radius.full,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  saveBtnText: { fontSize: 16, fontWeight: '700' },
})
