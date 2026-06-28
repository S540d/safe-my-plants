import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getCareStatus } from '../hooks/useCareStatus'
import { useThemeColors } from '../hooks/useThemeColors'
import { Language } from '../i18n/translations'
import { Plant } from '../types/plant'
import { TrafficLight } from './TrafficLight'

interface PlantCardProps {
  plant: Plant
  lang: Language
  onPress: () => void
  onWater?: () => void
  onFertilize?: () => void
}

export function PlantCard({ plant, lang, onPress, onWater, onFertilize }: PlantCardProps) {
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
        <LinearGradient colors={[colors.primaryMid, colors.primaryLight]} style={styles.photo}>
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
        </View>
        {(onWater || onFertilize) && (
          <View style={styles.actionRow}>
            {onWater && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  status.watering === 'overdue' && styles.actionBtnUrgent,
                ]}
                onPress={onWater}
                activeOpacity={0.75}
              >
                <Text style={styles.actionBtnText}>
                  {lang === 'de' ? '💧 Gegossen' : '💧 Watered'}
                </Text>
              </TouchableOpacity>
            )}
            {onFertilize && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  status.fertilizing === 'overdue' && styles.actionBtnUrgent,
                ]}
                onPress={onFertilize}
                activeOpacity={0.75}
              >
                <Text style={styles.actionBtnText}>
                  {lang === 'de' ? '🌿 Gedüngt' : '🌿 Fertilized'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  photo: {
    width: 80,
    minHeight: 80,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  scientificName: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#D8F3DC',
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  actionBtnUrgent: {
    backgroundColor: '#FEE2E2',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B4332',
  },
})
