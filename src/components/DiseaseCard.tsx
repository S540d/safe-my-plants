import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Disease } from '../types/plant'
import { Language } from '../i18n/translations'

interface DiseaseCardProps {
  disease: Disease
  lang: Language
}

export function DiseaseCard({ disease, lang }: DiseaseCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <TouchableOpacity style={styles.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.icon}>🦠</Text>
        <Text style={styles.name}>{disease.name}</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>
      {expanded && (
        <View style={styles.body}>
          {disease.imageUri && <Image source={{ uri: disease.imageUri }} style={styles.image} />}
          <Text style={styles.sectionLabel}>{lang === 'de' ? 'Symptome' : 'Symptoms'}</Text>
          <Text style={styles.text}>{disease.symptoms}</Text>
          <Text style={styles.sectionLabel}>{lang === 'de' ? 'Behandlung' : 'Treatment'}</Text>
          <Text style={styles.text}>{disease.treatment}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF9F0',
    borderRadius: 10,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F4A261',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1B4332',
  },
  chevron: {
    fontSize: 12,
    color: '#74C69D',
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
    color: '#52B788',
    marginTop: 8,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
})
