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

const COLORS = ['#52B788', '#74C69D', '#B7E4C7', '#F4A261', '#E63946', '#2D6A4F', '#FFD60A']

const PIECES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  startX: Math.sin(i * 1.3) * 120,
  startY: Math.cos(i * 1.7) * 80,
  delay: Math.floor(i * 30),
}))

function Piece({
  color,
  startX,
  startY,
  delay,
  visible,
}: {
  color: string
  startX: number
  startY: number
  delay: number
  visible: boolean
}) {
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delay, withSequence(withTiming(1, { duration: 100 }), withTiming(0, { duration: 600 })))
      translateX.value = withDelay(delay, withTiming(startX, { duration: 700 }))
      translateY.value = withDelay(delay, withTiming(startY, { duration: 700 }))
      scale.value = withDelay(delay, withSequence(withTiming(1, { duration: 150 }), withTiming(0.5, { duration: 550 })))
    } else {
      opacity.value = 0
      translateX.value = 0
      translateY.value = 0
      scale.value = 0
    }
  }, [visible])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }))

  return <Animated.View style={[styles.piece, { backgroundColor: color }, style]} />
}

export function CareConfetti({ visible, onFinish }: Props) {
  useEffect(() => {
    if (visible && onFinish) {
      const timer = setTimeout(onFinish, 1400)
      return () => clearTimeout(timer)
    }
  }, [visible, onFinish])

  if (!visible) return null

  return (
    <View style={styles.container} pointerEvents="none">
      {PIECES.map((p) => (
        <Piece key={p.id} color={p.color} startX={p.startX} startY={p.startY} delay={p.delay} visible={visible} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  piece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
})
