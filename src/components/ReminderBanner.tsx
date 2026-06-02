import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Language } from '../i18n/translations'

interface Props {
  count: number
  lang: Language
  onPress: () => void
}

export function ReminderBanner({ count, lang, onPress }: Props) {
  if (count === 0) return null

  const text =
    count === 1
      ? lang === 'de'
        ? '1 Pflanze braucht jetzt Wasser'
        : '1 plant needs water now'
      : lang === 'de'
        ? `${count} Pflanzen brauchen jetzt Wasser`
        : `${count} plants need water now`

  const cta = lang === 'de' ? 'Tippen zum Anzeigen' : 'Tap to view'

  return (
    <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>💧</Text>
      <Text style={styles.text}>
        {text}
        {'  '}
        <Text style={styles.cta}>{cta}</Text>
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E63946',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emoji: { fontSize: 20, marginRight: 10 },
  text: { flex: 1, fontSize: 13, color: '#fff', fontWeight: '600' },
  cta: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '400' },
})
