import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import { EmptyState } from '../src/components/EmptyState'
import { HeaderMenu } from '../src/components/HeaderMenu'
import { PlantCard } from '../src/components/PlantCard'
import { Radius, Spacing } from '../src/constants/theme'
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
  const { plants, isLoaded, markWatered, markFertilized } = usePlants()
  const { language } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()

  const sections = useMemo(() => groupByRoom(plants, language), [plants, language])

  const plantCount = plants.length
  const countLabel = plantCount === 1 ? t(language, 'home_plant_singular') : t(language, 'home_plant_plural')

  if (!isLoaded) return null

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{t(language, 'home_title')}</Text>
            <Text style={[styles.headerCount, { color: colors.gradientText }]}>
              {plantCount} {countLabel}
            </Text>
          </View>
          <HeaderMenu lang={language} />
        </View>
      </LinearGradient>

      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState icon="🪴" title={t(language, 'home_empty_tap')} />
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
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.primaryLight }]}>{section.title}</Text>
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
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  headerCount: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs + 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
