import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'
import { useThemeColors } from '../hooks/useThemeColors'

interface EmptyStateProps {
  icon: string
  title: string
  body?: string
  ctaLabel?: string
  onCta?: () => void
}

export function EmptyState({ icon, title, body, ctaLabel, onCta }: EmptyStateProps) {
  const colors = useThemeColors()

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[styles.card, { backgroundColor: colors.surface }]}>
      <Animated.Text entering={ZoomIn.duration(450).delay(100).springify().damping(12)} style={styles.icon}>
        {icon}
      </Animated.Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text> : null}
      {ctaLabel && onCta ? (
        <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary }]} onPress={onCta} activeOpacity={0.8}>
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
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
    borderRadius: 8,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
})
