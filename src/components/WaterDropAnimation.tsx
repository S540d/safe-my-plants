import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  visible: boolean
  onFinish?: () => void
}

const DROPS = [
  { left: '30%', delay: 0 },
  { left: '50%', delay: 100 },
  { left: '70%', delay: 200 },
]

function Drop({ left, delay, visible }: { left: string; delay: number; visible: boolean }) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(-20)

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 400 })))
      translateY.value = withDelay(
        delay,
        withSequence(withTiming(0, { duration: 50 }), withTiming(60, { duration: 500 }))
      )
    } else {
      opacity.value = 0
      translateY.value = -20
    }
  }, [visible])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return <Animated.Text style={[styles.drop, { left: left as `${number}%` }, style]}>💧</Animated.Text>
}

export function WaterDropAnimation({ visible, onFinish }: Props) {
  useEffect(() => {
    if (visible && onFinish) {
      const timer = setTimeout(onFinish, 800)
      return () => clearTimeout(timer)
    }
  }, [visible, onFinish])

  if (!visible) return null

  return (
    <View style={styles.container} pointerEvents="none">
      {DROPS.map((d) => (
        <Drop key={d.delay} left={d.left} delay={d.delay} visible={visible} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 99,
  },
  drop: {
    position: 'absolute',
    top: 80,
    fontSize: 28,
  },
})
