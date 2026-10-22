import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { getCareStatus } from '../hooks/useCareStatus'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'
import { Radius, Shadow, Spacing, ThemeColors, Typography } from '../constants/theme'
import { CareStatus, Plant } from '../types/plant'
import { Icon, IconName } from './Icon'

interface PlantCardProps {
  plant: Plant
  lang: Language
  index?: number
  onPress: () => void
  onWater?: () => void
  onFertilize?: () => void
  onSnooze?: () => void
}

export function PlantCard({ plant, lang, index = 0, onPress, onWater, onFertilize, onSnooze }: PlantCardProps) {
  const status = getCareStatus(plant)
  const hasPhoto = plant.photos.length > 0
  const colors = useThemeColors()
  const scale = useSharedValue(1)

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  // Aktionen nur zeigen, wenn etwas ansteht – hält die Liste ruhig. Früher erfassen geht in der Detailansicht.
  const showWater = onWater && status.watering !== 'ok'
  const showFertilize = onFertilize && status.fertilizing !== 'ok'
  const showSnooze = onSnooze && status.watering !== 'ok'

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
          <View style={styles.topRow}>
            {hasPhoto ? (
              <Image
                source={{ uri: plant.photos[0].uri }}
                style={[styles.photo, { backgroundColor: colors.accentSurface }]}
              />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder, { backgroundColor: colors.accentSurface }]}>
                <Icon name="plants" size={30} color={colors.primaryLight} />
              </View>
            )}
            <View style={styles.content}>
              <Text style={[styles.name, { color: colors.primary }]} numberOfLines={1}>
                {plant.name}
              </Text>
              {plant.scientificName ? (
                <Text style={[styles.scientificName, { color: colors.accent }]} numberOfLines={1}>
                  {plant.scientificName}
                </Text>
              ) : null}
              <View style={styles.statusRow}>
                <StatusPill icon="water" status={status.watering} lang={lang} colors={colors} />
                <StatusPill icon="fertilize" status={status.fertilizing} lang={lang} colors={colors} />
              </View>
            </View>
          </View>

          {(showWater || showFertilize || showSnooze) && (
            <View style={styles.actions}>
              {showSnooze && onSnooze && (
                <CareActionButton
                  icon="soilMoist"
                  label={t(lang, 'card_soil_moist')}
                  backgroundColor={colors.surfaceAlt}
                  textColor={colors.primaryMid}
                  onPress={onSnooze}
                />
              )}
              {(showWater || showFertilize) && (
                <View style={styles.actionRow}>
                  {showWater && onWater && (
                    <CareActionButton
                      icon="water"
                      label={t(lang, 'card_watered')}
                      backgroundColor={colors.primary}
                      textColor={colors.textOnPrimary}
                      onPress={onWater}
                    />
                  )}
                  {showFertilize && onFertilize && (
                    <CareActionButton
                      icon="fertilize"
                      label={t(lang, 'card_fertilized')}
                      backgroundColor={colors.accentSurface}
                      textColor={colors.primary}
                      onPress={onFertilize}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

function StatusPill({
  icon,
  status,
  lang,
  colors,
}: {
  icon: IconName
  status: CareStatus
  lang: Language
  colors: ThemeColors
}) {
  const tone: Record<CareStatus, { fg: string; bg: string }> = {
    ok: { fg: colors.statusOk, bg: colors.accentSurface },
    soon: { fg: colors.statusSoon, bg: colors.statusSoonSurface },
    overdue: { fg: colors.statusOverdue, bg: colors.statusOverdueSurface },
  }
  const label =
    status === 'overdue' ? t(lang, 'home_care_overdue') : status === 'soon' ? t(lang, 'home_care_soon') : 'OK'

  return (
    <View style={[styles.pill, { backgroundColor: tone[status].bg }]}>
      <Icon name={icon} size={13} color={tone[status].fg} />
      <Text style={[styles.pillText, { color: tone[status].fg }]}>{label}</Text>
    </View>
  )
}

interface CareActionButtonProps {
  icon: IconName
  label: string
  backgroundColor: string
  textColor: string
  onPress: () => void
}

function CareActionButton({ icon, label, backgroundColor, textColor, onPress }: CareActionButtonProps) {
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
        <Icon name={icon} size={15} color={textColor} />
        <Text style={[styles.actionBtnText, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs + 2,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: Radius.lg,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  name: {
    ...Typography.title,
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs + 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    gap: Spacing.xs + 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
  },
  actionBtnWrapper: {
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
})
