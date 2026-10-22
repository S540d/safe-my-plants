import React, { ReactNode } from 'react'
import { AccessibilityRole, GestureResponderEvent, Insets, Pressable, StyleProp, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable)

interface Props {
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  children: ReactNode
  scaleTo?: number
  disabled?: boolean
  hitSlop?: Insets | number
  accessibilityRole?: AccessibilityRole
  accessibilityLabel?: string
}

export function AnimatedPressable({
  onPress,
  style,
  children,
  scaleTo = 0.96,
  disabled,
  hitSlop,
  accessibilityRole,
  accessibilityLabel,
}: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <AnimatedPressableBase
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => {
        scale.value = withTiming(scaleTo, { duration: 100 })
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 })
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  )
}
