import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'
import { Shadow, Typography } from '../constants/theme'
import { useThemeColors } from '../hooks/useThemeColors'
import { Icon, IconName } from './Icon'

interface EmptyStateProps {
  icon: IconName
  title: string
  body?: string
  ctaLabel?: string
  onCta?: () => void
}

export function EmptyState({ icon, title, body, ctaLabel, onCta }: EmptyStateProps) {
  const colors = useThemeColors()

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[styles.card, { backgroundColor: colors.surface }]}>
      <Animated.View
        entering={ZoomIn.duration(450).delay(100).springify().damping(12)}
        style={[styles.iconCircle, { backgroundColor: colors.accentSurface }]}
      >
        <Icon name={icon} size={40} color={colors.primaryLight} />
      </Animated.View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text> : null}
      {ctaLabel && onCta ? (
        <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]} onPress={onCta} activeOpacity={0.8}>
          <Text style={[styles.ctaLabel, { color: colors.textOnPrimary }]}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 24,
    alignItems: 'center',
    ...Shadow.card,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.title,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  cta: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  ctaLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
})
