import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { LOCATION_ICONS } from '../constants/locationIcons'
import { Language } from '../i18n/translations'
import { CareStatus, PlantLocation } from '../types/plant'

interface Props {
  selectedLocations: PlantLocation[]
  selectedStatuses: CareStatus[]
  onLocationToggle: (loc: PlantLocation) => void
  onStatusToggle: (status: CareStatus) => void
  lang: Language
}

const LOCATION_CHIPS: { value: PlantLocation; label: Record<Language, string> }[] = [
  { value: 'sun', label: { de: 'Sonne', en: 'Sun' } },
  { value: 'partial-shade', label: { de: 'Halbschatten', en: 'Part shade' } },
  { value: 'shade', label: { de: 'Schatten', en: 'Shade' } },
  { value: 'indoor', label: { de: 'Innen', en: 'Indoor' } },
]

const STATUS_CHIPS: { value: CareStatus; emoji: string; color: string }[] = [
  { value: 'overdue', emoji: '🔴', color: '#E63946' },
  { value: 'soon', emoji: '🟡', color: '#F4A261' },
  { value: 'ok', emoji: '🟢', color: '#52B788' },
]

export function FilterChips({ selectedLocations, selectedStatuses, onLocationToggle, onStatusToggle, lang }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {LOCATION_CHIPS.map(({ value, label }) => {
        const active = selectedLocations.includes(value)
        return (
          <TouchableOpacity
            key={value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onLocationToggle(value)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {LOCATION_ICONS[value]} {label[lang]}
            </Text>
          </TouchableOpacity>
        )
      })}
      <Text style={styles.divider}>│</Text>
      {STATUS_CHIPS.map(({ value, emoji, color }) => {
        const active = selectedStatuses.includes(value)
        return (
          <TouchableOpacity
            key={value}
            style={[styles.chip, active && { backgroundColor: color + '22', borderColor: color }]}
            onPress={() => onStatusToggle(value)}
          >
            <Text style={[styles.chipText, active && { color }]}>{emoji}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: 8, marginBottom: 4 },
  content: { paddingHorizontal: 8, gap: 8, flexDirection: 'row', alignItems: 'center' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  chipText: { fontSize: 13, color: '#2D6A4F', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  divider: { color: '#B7E4C7', fontSize: 18, marginHorizontal: 4 },
})
