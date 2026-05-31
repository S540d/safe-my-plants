import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { PlantCard } from '../src/components/PlantCard'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'

export default function HomeScreen() {
  const { plants, isLoaded } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()

  const title = language === 'de' ? 'Meine Pflanzen' : 'My Plants'
  const emptyText =
    language === 'de'
      ? 'Noch keine Pflanzen vorhanden.\nFüge deine erste Pflanze im Admin-Bereich hinzu.'
      : 'No plants yet.\nAdd your first plant in the Admin area.'

  if (!isLoaded) return null

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerCount}>
          {plants.length} {language === 'de' ? (plants.length === 1 ? 'Pflanze' : 'Pflanzen') : plants.length === 1 ? 'plant' : 'plants'}
        </Text>
      </LinearGradient>
      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🪴</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlantCard plant={item} lang={language} onPress={() => router.push(`/plant/${item.id}`)} />
          )}
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
