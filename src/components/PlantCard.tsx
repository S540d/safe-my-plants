import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LOCATION_ICONS } from '../constants/locationIcons'
import { getCareStatus } from '../hooks/useCareStatus'
import { useThemeColors } from '../hooks/useThemeColors'
import { Language } from '../i18n/translations'
import { Plant } from '../types/plant'
import { TrafficLight } from './TrafficLight'

interface PlantCardProps {
  plant: Plant
  lang: Language
  onPress: () => void
}

export function PlantCard({ plant, lang, onPress }: PlantCardProps) {
  const status = getCareStatus(plant)
  const hasPhoto = plant.photos.length > 0
  const colors = useThemeColors()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {hasPhoto ? (
        <Image source={{ uri: plant.photos[0].uri }} style={styles.photo} />
      ) : (
        <LinearGradient colors={[colors.primaryMid, colors.primaryLight]} style={styles.photoPlaceholder}>
          <Text style={styles.plantEmoji}>🪴</Text>
        </LinearGradient>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.primary }]} numberOfLines={1}>
            {plant.name}
          </Text>
          <TrafficLight status={status.overall} size={14} />
        </View>
        {plant.scientificName ? (
          <Text style={[styles.scientificName, { color: colors.accent }]} numberOfLines={1}>
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
    flex: 1,
    marginRight: 8,
  },
  scientificName: {
    fontSize: 12,
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
