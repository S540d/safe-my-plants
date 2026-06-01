import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { DashboardFilter, DashboardSummary } from '../src/components/DashboardSummary'
import { HeroPlantCard } from '../src/components/HeroPlantCard'
import { PlantCard } from '../src/components/PlantCard'
import { usePlants } from '../src/contexts/PlantContext'
import { getCareStatus } from '../src/hooks/useCareStatus'
import { usePreferences } from '../src/hooks/usePreferences'
import { Plant } from '../src/types/plant'

function pickHeroPlant(plants: Plant[]): Plant | null {
  if (plants.length === 0) return null
  const overdue = plants.find((p) => getCareStatus(p).overall === 'overdue')
  if (overdue) return overdue
  const soon = plants.find((p) => getCareStatus(p).overall === 'soon')
  return soon ?? plants[0]
}

export default function HomeScreen() {
  const { plants, isLoaded, markWatered, markFertilized } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>(null)

  const filteredPlants = useMemo(() => {
    if (!activeFilter) return plants
    return plants.filter((p) => {
      const { overall } = getCareStatus(p)
      if (activeFilter === 'overdue') return overall === 'overdue' || overall === 'never'
      return overall === activeFilter
    })
  }, [plants, activeFilter])

  const heroPlant = useMemo(() => pickHeroPlant(plants), [plants])

  const title = language === 'de' ? 'Meine Pflanzen' : 'My Plants'
  const emptyText =
    language === 'de'
      ? 'Noch keine Pflanzen vorhanden.\nFüge deine erste Pflanze im Admin-Bereich hinzu.'
      : 'No plants yet.\nAdd your first plant in the Admin area.'

  if (!isLoaded) return null

  const ListHeader = (
    <>
      {heroPlant && (
        <HeroPlantCard
          plant={heroPlant}
          lang={language}
          onPress={() => router.push(`/plant/${heroPlant.id}`)}
          onWater={() => markWatered(heroPlant.id)}
          onFertilize={() => markFertilized(heroPlant.id)}
        />
      )}
      <DashboardSummary
        plants={plants}
        lang={language}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
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
      </LinearGradient>
      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🪴</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlantCard plant={item} lang={language} onPress={() => router.push(`/plant/${item.id}`)} />
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            activeFilter ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>✅</Text>
                <Text style={styles.emptyText}>
                  {language === 'de' ? 'Keine Pflanzen in dieser Kategorie.' : 'No plants in this category.'}
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 64,
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
