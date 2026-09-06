import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useThemeColors } from '../hooks/useThemeColors'
import { CareStatus } from '../types/plant'

interface TrafficLightProps {
  status: CareStatus
  size?: number
}

export function TrafficLight({ status, size = 14 }: TrafficLightProps) {
  const colors = useThemeColors()
  const statusColors: Record<CareStatus, string> = {
    ok: colors.statusOk,
    soon: colors.statusSoon,
    overdue: colors.statusOverdue,
  }

  return (
    <View
      style={[styles.dot, { width: size, height: size, borderRadius: size / 2, backgroundColor: statusColors[status] }]}
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
