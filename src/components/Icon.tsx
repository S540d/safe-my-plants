import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import type { ColorValue, StyleProp, TextStyle } from 'react-native'

/**
 * Zentrales Icon-Mapping (gleiches Prinzip wie im Pflanzkalender): alle UI-Icons
 * laufen über semantische Namen, ausschließlich Outline-Glyphen – damit beide
 * Apps dieselbe Bildsprache sprechen und das Set an einer Stelle tauschbar bleibt.
 */
const ICONS = {
  // Pflege-Aktionen
  water: 'water-outline',
  fertilize: 'leaf-outline',
  soilMoist: 'hand-left-outline',
  repot: 'flower-outline',
  prune: 'cut-outline',
  note: 'document-text-outline',

  // Navigation / Menü
  back: 'chevron-back',
  forward: 'chevron-forward',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  more: 'ellipsis-vertical',
  add: 'add',
  plants: 'leaf-outline',
  guide: 'medkit-outline',
  stats: 'stats-chart-outline',
  settings: 'options-outline',

  // Aktionen
  edit: 'create-outline',
  delete: 'trash-outline',
  close: 'close',
  check: 'checkmark',
  camera: 'camera-outline',
  export: 'share-outline',
  import: 'download-outline',
  link: 'open-outline',

  // Standort / Pflegeinfo
  sun: 'sunny-outline',
  partialShade: 'partly-sunny-outline',
  shade: 'cloudy-outline',
  indoor: 'home-outline',
  location: 'location-outline',
  temperature: 'thermometer-outline',
  humidity: 'rainy-outline',
  disease: 'bug-outline',
  template: 'clipboard-outline',
  streak: 'flame-outline',
  star: 'star-outline',
} as const

export type IconName = keyof typeof ICONS

interface IconProps {
  name: IconName
  size?: number
  color?: ColorValue
  style?: StyleProp<TextStyle>
}

export function Icon({ name, size = 20, color = '#1E2420', style }: IconProps) {
  return <Ionicons name={ICONS[name]} size={size} color={color} style={style} />
}
