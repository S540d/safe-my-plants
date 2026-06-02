import React from 'react'
import { StyleSheet, View } from 'react-native'
import { CareStatus } from '../types/plant'

const STATUS_COLORS: Record<CareStatus, string> = {
  ok: '#52B788',
  soon: '#F4A261',
  overdue: '#E63946',
}

interface TrafficLightProps {
  status: CareStatus
  size?: number
}

export function TrafficLight({ status, size = 14 }: TrafficLightProps) {
  return (
    <View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: STATUS_COLORS[status] },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
})
