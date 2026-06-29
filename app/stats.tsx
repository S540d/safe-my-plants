import React, { useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useCareLog } from '../src/hooks/useCareLog'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useStreak } from '../src/hooks/useStreak'
import { t } from '../src/i18n/translations'

export default function StatsScreen() {
  const { language } = usePreferences()
  const { current, longest } = useStreak()
  const { getRecentActions } = useCareLog()
  const { plants } = usePlants()

  const monthActions = getRecentActions(30)

  const waterCount = useMemo(() => monthActions.filter((a) => a.type === 'water').length, [monthActions])
  const fertilizeCount = useMemo(() => monthActions.filter((a) => a.type === 'fertilize').length, [monthActions])
  const otherCount = useMemo(
    () => monthActions.filter((a) => a.type !== 'water' && a.type !== 'fertilize').length,
    [monthActions]
  )

  const thirstiestPlant = useMemo(() => {
    const counts: Record<string, number> = {}
    monthActions
      .filter((a) => a.type === 'water')
      .forEach((a) => {
        counts[a.plantId] = (counts[a.plantId] ?? 0) + 1
      })
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return topId ? plants.find((p) => p.id === topId) : undefined
  }, [monthActions, plants])

  const mostActivePlant = useMemo(() => {
    const counts: Record<string, number> = {}
    monthActions.forEach((a) => {
      counts[a.plantId] = (counts[a.plantId] ?? 0) + 1
    })
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return topId ? plants.find((p) => p.id === topId) : undefined
  }, [monthActions, plants])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{t(language, 'stats_title')}</Text>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{current}</Text>
          <Text style={styles.streakLabel}>{t(language, 'stats_streak_current')}</Text>
          <Text style={styles.streakRecord}>
            {t(language, 'stats_streak_longest')}: {longest} {t(language, 'stats_streak_days')}
          </Text>
        </View>

        {/* This month */}
        <Text style={styles.sectionTitle}>{t(language, 'stats_this_month')}</Text>
        <View style={styles.monthGrid}>
          <StatTile icon="💧" count={waterCount} label={t(language, 'stats_actions_water')} />
          <StatTile icon="🌿" count={fertilizeCount} label={t(language, 'stats_actions_fertilize')} />
          <StatTile icon="✂️" count={otherCount} label={t(language, 'stats_actions_other')} />
        </View>

        {/* Plant highlights */}
        <Text style={styles.sectionTitle}>{t(language, 'stats_highlights')}</Text>
        <View style={styles.highlightCards}>
          <HighlightCard icon="💧" title={t(language, 'stats_thirstiest')} plantName={thirstiestPlant?.name} />
          <HighlightCard icon="⭐" title={t(language, 'stats_most_active')} plantName={mostActivePlant?.name} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatTile({ icon, count, label }: { icon: string; count: number; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statTileIcon}>{icon}</Text>
      <Text style={styles.statTileCount}>{count}</Text>
      <Text style={styles.statTileLabel}>{label}</Text>
    </View>
  )
}

function HighlightCard({ icon, title, plantName }: { icon: string; title: string; plantName?: string }) {
  return (
    <View style={styles.highlightCard}>
      <Text style={styles.highlightIcon}>{icon}</Text>
      <View style={styles.highlightContent}>
        <Text style={styles.highlightTitle}>{title}</Text>
        <Text style={styles.highlightName}>{plantName ?? '–'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  scroll: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B4332',
    marginBottom: 20,
  },
  streakCard: {
    backgroundColor: '#1B4332',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  streakEmoji: { fontSize: 48, marginBottom: 4 },
  streakNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#74C69D',
    lineHeight: 70,
  },
  streakLabel: { fontSize: 16, color: '#D8F3DC', fontWeight: '600', marginTop: 4 },
  streakRecord: { fontSize: 13, color: '#52B788', marginTop: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 12,
    marginTop: 4,
  },
  monthGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  statTileIcon: { fontSize: 28, marginBottom: 6 },
  statTileCount: { fontSize: 28, fontWeight: '800', color: '#1B4332' },
  statTileLabel: { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 2 },
  highlightCards: { gap: 10, marginBottom: 24 },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightIcon: { fontSize: 28 },
  highlightContent: { flex: 1 },
  highlightTitle: { fontSize: 12, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  highlightName: { fontSize: 16, fontWeight: '700', color: '#1B4332', marginTop: 2 },
})
