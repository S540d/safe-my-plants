import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getCareStatus } from '../hooks/useCareStatus'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'
import { Radius, Shadow, Spacing } from '../constants/theme'
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
      style={[styles.card, { backgroundColor: colors.surface }, Shadow.card]}
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
                  { backgroundColor: colors.accentSurface },
                  status.watering === 'overdue' && { backgroundColor: colors.statusOverdueSurface },
                ]}
                onPress={onWater}
                activeOpacity={0.75}
              >
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>{t(lang, 'card_watered')}</Text>
              </TouchableOpacity>
            )}
            {onFertilize && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.accentSurface },
                  status.fertilizing === 'overdue' && { backgroundColor: colors.statusOverdueSurface },
                ]}
                onPress={onFertilize}
                activeOpacity={0.75}
              >
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>{t(lang, 'card_fertilized')}</Text>
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
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs + 1,
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
    padding: Spacing.md - 2,
    justifyContent: 'space-between',
    gap: Spacing.xs,
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
    marginRight: Spacing.sm,
  },
  scientificName: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusLabel: {
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs + 1,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
})
