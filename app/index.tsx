import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native'
import { HeaderMenu } from '../src/components/HeaderMenu'
import { PlantCard } from '../src/components/PlantCard'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { Language } from '../src/i18n/translations'
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
    sections.push({ title: lang === 'de' ? 'Ohne Raum' : 'No room', data: noRoom })
  }

  return sections
}

export default function HomeScreen() {
  const { plants, isLoaded, markWatered, markFertilized } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()

  const sections = useMemo(() => groupByRoom(plants, language), [plants, language])

  const title = language === 'de' ? 'Meine Pflanzen' : 'My Plants'
  const emptyText =
    language === 'de'
      ? 'Noch keine Pflanzen.\nTippe auf ⋮ → Pflanze hinzufügen.'
      : 'No plants yet.\nTap ⋮ → Add plant.'

  if (!isLoaded) return null

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerCount}>
              {plants.length}{' '}
              {language === 'de'
                ? plants.length === 1
                  ? 'Pflanze'
                  : 'Pflanzen'
                : plants.length === 1
                  ? 'plant'
                  : 'plants'}
            </Text>
          </View>
          <HeaderMenu lang={language} />
        </View>
      </LinearGradient>

      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🪴</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              lang={language}
              onPress={() => router.push(`/plant/${item.id}`)}
              onWater={() => markWatered(item.id)}
              onFertilize={() => markFertilized(item.id)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
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
    backgroundColor: '#F0FFF4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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
    color: '#B7E4C7',
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#52B788',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  list: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#52B788',
    textAlign: 'center',
    lineHeight: 24,
  },
})
