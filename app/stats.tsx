import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Icon, IconName } from '../src/components/Icon'
import { ScreenHeader } from '../src/components/ScreenHeader'
import { Fonts, Shadow, Typography } from '../src/constants/theme'
import { useCareLog } from '../src/hooks/useCareLog'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useStreak } from '../src/hooks/useStreak'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'

export default function StatsScreen() {
  const { language } = usePreferences()
  const router = useRouter()
  const colors = useThemeColors()
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t(language, 'stats_title')} onBack={() => router.back()} backLabel={t(language, 'back')} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Streak */}
        <View style={[styles.streakCard, { backgroundColor: colors.gradientStart }, Shadow.card]}>
          <Icon name="streak" size={36} color={colors.accent} />
          <Text style={[styles.streakNumber, { color: colors.headerTitle }]}>{current}</Text>
          <Text style={[styles.streakLabel, { color: colors.headerTitle }]}>{t(language, 'stats_streak_current')}</Text>
          <Text style={[styles.streakRecord, { color: colors.gradientText }]}>
            {t(language, 'stats_streak_longest')}: {longest} {t(language, 'stats_streak_days')}
          </Text>
        </View>

        {/* This month */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t(language, 'stats_this_month')}</Text>
        <View style={styles.monthGrid}>
          <StatTile icon="water" count={waterCount} label={t(language, 'stats_actions_water')} colors={colors} />
          <StatTile
            icon="fertilize"
            count={fertilizeCount}
            label={t(language, 'stats_actions_fertilize')}
            colors={colors}
          />
          <StatTile icon="prune" count={otherCount} label={t(language, 'stats_actions_other')} colors={colors} />
        </View>

        {/* Plant highlights */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t(language, 'stats_highlights')}</Text>
        <View style={styles.highlightCards}>
          <HighlightCard
            icon="water"
            title={t(language, 'stats_thirstiest')}
            plantName={thirstiestPlant?.name}
            colors={colors}
          />
          <HighlightCard
            icon="star"
            title={t(language, 'stats_most_active')}
            plantName={mostActivePlant?.name}
            colors={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type ThemeColors = ReturnType<typeof useThemeColors>

function StatTile({
  icon,
  count,
  label,
  colors,
}: {
  icon: IconName
  count: number
  label: string
  colors: ThemeColors
}) {
  return (
    <View style={[styles.statTile, { backgroundColor: colors.surface }, Shadow.cardSm]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.accentSurface }]}>
        <Icon name={icon} size={22} color={colors.primaryLight} />
      </View>
      <Text style={[styles.statTileCount, { color: colors.primary }]}>{count}</Text>
      <Text style={[styles.statTileLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  )
}

function HighlightCard({
  icon,
  title,
  plantName,
  colors,
}: {
  icon: IconName
  title: string
  plantName?: string
  colors: ThemeColors
}) {
  return (
    <View style={[styles.highlightCard, { backgroundColor: colors.surface }, Shadow.cardSm]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.accentSurface }]}>
        <Icon name={icon} size={22} color={colors.primaryLight} />
      </View>
      <View style={styles.highlightContent}>
        <Text style={[styles.highlightTitle, { color: colors.textMuted }]}>{title}</Text>
        <Text style={[styles.highlightName, { color: colors.primary }]}>{plantName ?? '–'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingTop: 20, paddingBottom: 40 },
  streakCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },
  streakNumber: {
    fontSize: 64,
    fontFamily: Fonts.displayBold,
    lineHeight: 74,
  },
  streakLabel: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  streakRecord: { fontSize: 13, marginTop: 8 },
  sectionTitle: {
    ...Typography.sectionTitle,
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statTileCount: { fontSize: 28, fontFamily: Fonts.displayBold, marginTop: 6 },
  statTileLabel: { fontSize: 11, textAlign: 'center', marginTop: 2 },
  highlightCards: { gap: 10, marginBottom: 24 },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    padding: 16,
  },
  highlightContent: { flex: 1 },
  highlightTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  highlightName: { fontSize: 16, fontWeight: '700', marginTop: 2 },
})
