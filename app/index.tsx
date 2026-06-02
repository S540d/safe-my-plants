import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { DashboardFilter, DashboardSummary } from '../src/components/DashboardSummary'
import { FilterChips } from '../src/components/FilterChips'
import { HeroPlantCard } from '../src/components/HeroPlantCard'
import { PlantCard } from '../src/components/PlantCard'
import { ReminderBanner } from '../src/components/ReminderBanner'
import { SearchBar } from '../src/components/SearchBar'
import { SortMenu } from '../src/components/SortMenu'
import { usePlants } from '../src/contexts/PlantContext'
import { getCareStatus } from '../src/hooks/useCareStatus'
import { useOverdueCount } from '../src/hooks/useOverdueCount'
import { usePreferences } from '../src/hooks/usePreferences'
import { CareStatus, Plant, PlantLocation } from '../src/types/plant'
import { filterAndSortPlants, SortOption } from '../src/utils/plantFilter'

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
  const { overdue: overdueCount } = useOverdueCount()

  const [query, setQuery] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<PlantLocation[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<CareStatus[]>([])
  const [sort, setSort] = useState<SortOption>('recent')

  const activeDashboardFilter: DashboardFilter =
    selectedStatuses.length === 1 ? (selectedStatuses[0] as DashboardFilter) : null

  function handleDashboardFilter(filter: DashboardFilter) {
    if (!filter || selectedStatuses.includes(filter)) {
      setSelectedStatuses([])
    } else {
      setSelectedStatuses([filter])
    }
  }

  function toggleLocation(loc: PlantLocation) {
    setSelectedLocations((prev) => (prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]))
  }

  function toggleStatus(status: CareStatus) {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const filteredPlants = useMemo(
    () => filterAndSortPlants(plants, { query, locations: selectedLocations, statuses: selectedStatuses, sort }),
    [plants, query, selectedLocations, selectedStatuses, sort],
  )

  const heroPlant = useMemo(() => pickHeroPlant(plants), [plants])

  const title = language === 'de' ? 'Meine Pflanzen' : 'My Plants'
  const emptyText =
    language === 'de'
      ? 'Noch keine Pflanzen vorhanden.\nFüge deine erste Pflanze im Admin-Bereich hinzu.'
      : 'No plants yet.\nAdd your first plant in the Admin area.'
  const searchPlaceholder = language === 'de' ? 'Pflanze suchen …' : 'Search plants …'
  const noResultsText =
    language === 'de' ? 'Keine Pflanzen für diese Filter.' : 'No plants match these filters.'

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
      <ReminderBanner
        count={overdueCount}
        lang={language}
        onPress={() => handleDashboardFilter('overdue')}
      />
      <DashboardSummary
        plants={plants}
        lang={language}
        activeFilter={activeDashboardFilter}
        onFilterChange={handleDashboardFilter}
      />
      <SearchBar value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
      <FilterChips
        selectedLocations={selectedLocations}
        selectedStatuses={selectedStatuses}
        onLocationToggle={toggleLocation}
        onStatusToggle={toggleStatus}
        lang={language}
      />
      <SortMenu value={sort} onChange={setSort} lang={language} />
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
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>{noResultsText}</Text>
            </View>
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
