import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useCareLog } from '../hooks/useCareLog'
import { Shadow, Typography } from '../constants/theme'
import { usePreferences } from '../hooks/usePreferences'
import { useThemeColors } from '../hooks/useThemeColors'
import { t } from '../i18n/translations'
import { CareActionType } from '../types/careLog'
import { Icon, IconName } from './Icon'

interface Props {
  plantId: string
}

const ACTION_ICONS: Record<CareActionType, IconName> = {
  water: 'water',
  fertilize: 'fertilize',
  repot: 'repot',
  prune: 'prune',
  note: 'note',
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
  const colors = useThemeColors()
  const actions = getActionsForPlant(plantId, 20)

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>{t(language, 'history_title')}</Text>
      {actions.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface }, Shadow.cardSm]}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t(language, 'history_empty')}</Text>
        </View>
      ) : (
        <View style={[styles.list, { backgroundColor: colors.surface }, Shadow.cardSm]}>
          {actions.map((action) => (
            <View key={action.id} style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={[styles.rowIcon, { backgroundColor: colors.accentSurface }]}>
                <Icon name={ACTION_ICONS[action.type]} size={16} color={colors.primaryLight} />
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.primary }]}>
                  {t(language, ACTION_LABEL_KEYS[action.type])}
                </Text>
                {action.note ? (
                  <Text style={[styles.rowNote, { color: colors.textMuted }]} numberOfLines={2}>
                    {action.note}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.rowDate, { color: colors.textSubtle }]}>
                {formatRelativeDate(action.timestamp, language)}
              </Text>
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
    ...Typography.sectionTitle,
    marginBottom: 10,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  rowIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowNote: { fontSize: 12, marginTop: 2 },
  rowDate: { fontSize: 12, flexShrink: 0 },
})
