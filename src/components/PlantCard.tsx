import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getCareStatus } from '../hooks/useCareStatus'
import { Language } from '../i18n/translations'
import { Plant } from '../types/plant'
import { TrafficLight } from './TrafficLight'

const LOCATION_ICONS: Record<string, string> = {
  sun: '☀️',
  'partial-shade': '⛅',
  shade: '🌥️',
  indoor: '🏠',
}

interface PlantCardProps {
  plant: Plant
  lang: Language
  onPress: () => void
}

export function PlantCard({ plant, lang, onPress }: PlantCardProps) {
  const status = getCareStatus(plant)
  const hasPhoto = plant.photos.length > 0

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {hasPhoto ? (
        <Image source={{ uri: plant.photos[0] }} style={styles.photo} />
      ) : (
        <LinearGradient colors={['#2D6A4F', '#52B788']} style={styles.photoPlaceholder}>
          <Text style={styles.plantEmoji}>🪴</Text>
        </LinearGradient>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {plant.name}
          </Text>
          <TrafficLight status={status.overall} size={14} />
        </View>
        {plant.scientificName ? (
          <Text style={styles.scientificName} numberOfLines={1}>
            {plant.scientificName}
          </Text>
        ) : null}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>💧</Text>
            <TrafficLight status={status.watering} size={10} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>🌿</Text>
            <TrafficLight status={status.fertilizing} size={10} />
          </View>
          <Text style={styles.locationIcon}>{LOCATION_ICONS[plant.location]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  photo: {
    width: 80,
    height: 80,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
    flex: 1,
    marginRight: 8,
  },
  scientificName: {
    fontSize: 12,
    color: '#74C69D',
    fontStyle: 'italic',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontSize: 14,
  },
  locationIcon: {
    fontSize: 14,
    marginLeft: 'auto',
  },
})
