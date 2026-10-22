import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import { EmptyState } from '../src/components/EmptyState'
import { HeaderMenu } from '../src/components/HeaderMenu'
import { Icon } from '../src/components/Icon'
import { PlantCard } from '../src/components/PlantCard'
import { ScreenHeader } from '../src/components/ScreenHeader'
import { Radius, Spacing, Typography } from '../src/constants/theme'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'
import { buildHomeSections } from '../src/utils/homeSections'

export default function HomeScreen() {
  const { plants, isLoaded, markWatered, markFertilized, snoozeWatering } = usePlants()
  const { language } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()

  const sections = useMemo(
    () =>
      buildHomeSections(plants, {
        dueTitle: t(language, 'home_due_title'),
        noRoomTitle: t(language, 'home_no_room'),
        locale: language,
      }),
    [plants, language]
  )
  const dueCount = sections.find((section) => section.kind === 'due')?.data.length ?? 0

  const plantCount = plants.length
  const countLabel = plantCount === 1 ? t(language, 'home_plant_singular') : t(language, 'home_plant_plural')
  const subtitle =
    dueCount === 0
      ? `${plantCount} ${countLabel}`
      : dueCount === 1
        ? t(language, 'home_due_one')
        : t(language, 'home_due_other', { n: dueCount })

  if (!isLoaded) return null

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        large
        title={t(language, 'home_title')}
        subtitle={subtitle}
        right={<HeaderMenu lang={language} />}
      />

      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="plants" title={t(language, 'home_empty_tap')} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PlantCard
              plant={item}
              lang={language}
              index={index}
              onPress={() => router.push(`/plant/${item.id}`)}
              onWater={() => markWatered(item.id)}
              onFertilize={() => markFertilized(item.id)}
              onSnooze={() => snoozeWatering(item.id)}
            />
          )}
          ListHeaderComponent={
            dueCount === 0 ? (
              <View style={[styles.allDone, { backgroundColor: colors.accentSurface }]}>
                <Icon name="check" size={22} color={colors.primaryLight} />
                <View style={styles.allDoneText}>
                  <Text style={[styles.allDoneTitle, { color: colors.primary }]}>
                    {t(language, 'home_all_done_title')}
                  </Text>
                  <Text style={[styles.allDoneBody, { color: colors.textMuted }]}>
                    {t(language, 'home_all_done_body')}
                  </Text>
                </View>
              </View>
            ) : null
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: section.kind === 'due' ? colors.accent : colors.primary }]}>
                {section.title}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
  },
  allDoneText: { flex: 1 },
  allDoneTitle: { ...Typography.title },
  allDoneBody: { fontSize: 13, marginTop: 2 },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
})
