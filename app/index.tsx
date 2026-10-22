import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import { EmptyState } from '../src/components/EmptyState'
import { HeaderMenu } from '../src/components/HeaderMenu'
import { PlantCard } from '../src/components/PlantCard'
import { ScreenHeader } from '../src/components/ScreenHeader'
import { Radius, Spacing, Typography } from '../src/constants/theme'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t, Language } from '../src/i18n/translations'
import { Plant } from '../src/types/plant'

interface Section {
  title: string
  data: Plant[]
}

function groupByRoom(plants: Plant[], lang: Language): Section[] {
  const groups: Record<string, Plant[]> = {}
  const noRoom: Plant[] = []

  for (const plant of plants) {
    const room = plant.room?.trim()
    if (room) {
      groups[room] = [...(groups[room] ?? []), plant]
    } else {
      noRoom.push(plant)
    }
  }

  const sections: Section[] = Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b, lang))
    .map(([title, data]) => ({ title, data }))

  if (noRoom.length > 0) {
    sections.push({ title: t(lang, 'home_no_room'), data: noRoom })
  }

  return sections
}

export default function HomeScreen() {
  const { plants, isLoaded, markWatered, markFertilized, snoozeWatering } = usePlants()
  const { language } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()

  const sections = useMemo(() => groupByRoom(plants, language), [plants, language])

  const plantCount = plants.length
  const countLabel = plantCount === 1 ? t(language, 'home_plant_singular') : t(language, 'home_plant_plural')

  if (!isLoaded) return null

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        large
        title={t(language, 'home_title')}
        subtitle={`${plantCount} ${countLabel}`}
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
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{section.title}</Text>
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
