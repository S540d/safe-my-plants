import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { getCareStatus } from '../hooks/useCareStatus'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'
import { Radius, Shadow, Spacing } from '../constants/theme'
import { Plant } from '../types/plant'
import { TrafficLight } from './TrafficLight'

interface PlantCardProps {
  plant: Plant
  lang: Language
  index?: number
  onPress: () => void
  onWater?: () => void
  onFertilize?: () => void
}

export function PlantCard({ plant, lang, index = 0, onPress, onWater, onFertilize }: PlantCardProps) {
  const status = getCareStatus(plant)
  const hasPhoto = plant.photos.length > 0
  const colors = useThemeColors()
  const scale = useSharedValue(1)

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      entering={FadeInDown.duration(320)
        .delay(Math.min(index, 8) * 40)
        .springify()
        .damping(16)}
    >
      <Animated.View style={cardStyle}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface }, Shadow.card]}
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.97, { damping: 15, stiffness: 300 })
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15, stiffness: 300 })
          }}
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
                  <CareActionButton
                    label={t(lang, 'card_watered')}
                    backgroundColor={status.watering === 'overdue' ? colors.statusOverdueSurface : colors.accentSurface}
                    textColor={colors.primary}
                    onPress={onWater}
                  />
                )}
                {onFertilize && (
                  <CareActionButton
                    label={t(lang, 'card_fertilized')}
                    backgroundColor={
                      status.fertilizing === 'overdue' ? colors.statusOverdueSurface : colors.accentSurface
                    }
                    textColor={colors.primary}
                    onPress={onFertilize}
                  />
                )}
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

interface CareActionButtonProps {
  label: string
  backgroundColor: string
  textColor: string
  onPress: () => void
}

function CareActionButton({ label, backgroundColor, textColor, onPress }: CareActionButtonProps) {
  const scale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={[styles.actionBtnWrapper, buttonStyle]}>
      <Pressable
        style={[styles.actionBtn, { backgroundColor }]}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.93, { damping: 12, stiffness: 320 })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 320 })
        }}
      >
        <Text style={[styles.actionBtnText, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
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
  actionBtnWrapper: {
    flex: 1,
  },
  actionBtn: {
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs + 1,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
})
