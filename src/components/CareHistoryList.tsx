import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useCareLog } from '../hooks/useCareLog'
import { usePreferences } from '../hooks/usePreferences'
import { t } from '../i18n/translations'
import { CareActionType } from '../types/careLog'

interface Props {
  plantId: string
}

const ACTION_ICONS: Record<CareActionType, string> = {
  water: '💧',
  fertilize: '🌿',
  repot: '🪴',
  prune: '✂️',
  note: '📝',
}

const ACTION_LABEL_KEYS = {
  water: 'care_action_water',
  fertilize: 'care_action_fertilize',
  repot: 'care_action_repot',
  prune: 'care_action_prune',
  note: 'care_action_note',
} as const

function formatRelativeDate(iso: string, lang: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = now - then
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return lang === 'de' ? 'Heute' : 'Today'
  if (diffDays === 1) return lang === 'de' ? 'Gestern' : 'Yesterday'
  if (diffDays < 30) return lang === 'de' ? `vor ${diffDays} Tagen` : `${diffDays} days ago`

  const date = new Date(iso)
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function CareHistoryList({ plantId }: Props) {
  const { getActionsForPlant } = useCareLog()
  const { language } = usePreferences()
  const actions = getActionsForPlant(plantId, 20)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t(language, 'history_title')}</Text>
      {actions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t(language, 'history_empty')}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {actions.map((action) => (
            <View key={action.id} style={styles.row}>
              <Text style={styles.rowIcon}>{ACTION_ICONS[action.type]}</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{t(language, ACTION_LABEL_KEYS[action.type])}</Text>
                {action.note ? (
                  <Text style={styles.rowNote} numberOfLines={2}>
                    {action.note}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.rowDate}>{formatRelativeDate(action.timestamp, language)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 10,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FFF4',
    gap: 10,
  },
  rowIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#1B4332' },
  rowNote: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  rowDate: { fontSize: 12, color: '#74C69D', flexShrink: 0 },
})
