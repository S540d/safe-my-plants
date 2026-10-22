import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Spacing, Typography } from '../constants/theme'
import { useThemeColors } from '../hooks/useThemeColors'
import { AnimatedPressable } from './AnimatedPressable'
import { Icon } from './Icon'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  /** Zeigt links einen Zurück-Pfeil. */
  onBack?: () => void
  backLabel?: string
  /** Rechter Slot, z. B. das ⋮-Menü. */
  right?: React.ReactNode
  /** Großer Titel für den Startbildschirm. */
  large?: boolean
}

/**
 * Einheitlicher Markenkopf (gleiches Design wie im Pflanzkalender): flächiges
 * Waldgrün, unten abgerundet, Serifentitel.
 */
export function ScreenHeader({ title, subtitle, onBack, backLabel, right, large }: ScreenHeaderProps) {
  const colors = useThemeColors()

  return (
    <View style={[styles.header, { backgroundColor: colors.gradientStart }]}>
      <View style={styles.row}>
        {onBack && (
          <AnimatedPressable
            onPress={onBack}
            style={styles.backBtn}
            scaleTo={0.88}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
          >
            <Icon name="back" size={24} color={colors.headerTitle} />
          </AnimatedPressable>
        )}
        <View style={styles.titleBlock}>
          <Text style={[large ? styles.titleLarge : styles.title, { color: colors.headerTitle }]} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && <Text style={[styles.subtitle, { color: colors.gradientText }]}>{subtitle}</Text>}
        </View>
        {right}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {
    marginLeft: -Spacing.xs,
    padding: Spacing.xs,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    ...Typography.headerTitleSm,
    lineHeight: 30,
  },
  titleLarge: {
    ...Typography.headerTitle,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
})
