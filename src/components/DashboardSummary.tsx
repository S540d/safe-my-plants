import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { getCareStatus } from '../hooks/useCareStatus'
import { Language, t } from '../i18n/translations'
import { Plant } from '../types/plant'

export type DashboardFilter = 'overdue' | 'soon' | 'ok' | null

interface Props {
  plants: Plant[]
  lang: Language
  activeFilter: DashboardFilter
  onFilterChange: (filter: DashboardFilter) => void
}

const CARDS = [
  {
    key: 'overdue' as const,
    color: '#E63946',
    bg: '#FFF0F1',
    activeBg: '#E63946',
    labelKey: 'dashboard_due_today' as const,
  },
  {
    key: 'soon' as const,
    color: '#F4A261',
    bg: '#FFF8F0',
    activeBg: '#F4A261',
    labelKey: 'dashboard_this_week' as const,
  },
  { key: 'ok' as const, color: '#52B788', bg: '#F0FFF4', activeBg: '#52B788', labelKey: 'dashboard_all_good' as const },
]

export function DashboardSummary({ plants, lang, activeFilter, onFilterChange }: Props) {
  const counts = useMemo(() => {
    return plants.reduce(
      (acc, plant) => {
        const { overall } = getCareStatus(plant)
        if (overall === 'overdue') acc.overdue++
        else if (overall === 'soon') acc.soon++
        else acc.ok++
        return acc
      },
      { overdue: 0, soon: 0, ok: 0 }
    )
  }, [plants])

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {CARDS.map((card) => {
        const isActive = activeFilter === card.key
        const count = counts[card.key]
        return (
          <TouchableOpacity
            key={card.key}
            style={[styles.card, { backgroundColor: isActive ? card.activeBg : card.bg }]}
            onPress={() => onFilterChange(isActive ? null : card.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.count, { color: isActive ? '#fff' : card.color }]}>{count}</Text>
            <Text style={[styles.label, { color: isActive ? '#fff' : '#555' }]}>{t(lang, card.labelKey)}</Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    minWidth: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
})
