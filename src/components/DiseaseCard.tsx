import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useThemeColors } from '../hooks/useThemeColors'
import { Language } from '../i18n/translations'
import { Disease } from '../types/plant'
import { Icon } from './Icon'

interface DiseaseCardProps {
  disease: Disease
  lang: Language
}

export function DiseaseCard({ disease, lang }: DiseaseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const colors = useThemeColors()

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.statusSoonSurface, borderLeftColor: colors.statusSoon }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <Icon name="disease" size={18} color={colors.statusSoon} />
        <Text style={[styles.name, { color: colors.primary }]}>{disease.name}</Text>
        <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={18} color={colors.textSubtle} />
      </View>
      {expanded && (
        <View style={styles.body}>
          {disease.imageUri && <Image source={{ uri: disease.imageUri }} style={styles.image} />}
          <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
            {lang === 'de' ? 'Symptome' : 'Symptoms'}
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>{disease.symptoms}</Text>
          <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
            {lang === 'de' ? 'Behandlung' : 'Treatment'}
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>{disease.treatment}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 4,
    borderLeftWidth: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
})
