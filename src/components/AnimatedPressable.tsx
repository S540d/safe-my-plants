import React, { ReactNode } from 'react'
import { GestureResponderEvent, Insets, Pressable, StyleProp, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable)

interface Props {
  onPress?: (event: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  children: ReactNode
  scaleTo?: number
  disabled?: boolean
  hitSlop?: Insets | number
}

export function AnimatedPressable({ onPress, style, children, scaleTo = 0.96, disabled, hitSlop }: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <AnimatedPressableBase
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
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
