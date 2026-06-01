import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Language, t } from '../i18n/translations'
import { Plant } from '../types/plant'

interface Props {
  plant: Plant
  lang: Language
  onPress: () => void
  onWater: () => void
  onFertilize: () => void
}

export function HeroPlantCard({ plant, lang, onPress, onWater, onFertilize }: Props) {
  const hasPhoto = plant.photos.length > 0

  return (
    <TouchableOpacity style={styles.hero} onPress={onPress} activeOpacity={0.92}>
      {hasPhoto ? (
        <Image source={{ uri: plant.photos[0] }} style={styles.image} resizeMode="cover" />
      ) : (
        <LinearGradient colors={['#2D6A4F', '#52B788']} style={styles.image}>
          <Text style={styles.placeholder}>🪴</Text>
        </LinearGradient>
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.featuredLabel}>{t(lang, 'hero_featured')}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {plant.name}
          </Text>
          {plant.scientificName ? (
            <Text style={styles.scientific} numberOfLines={1}>
              {plant.scientificName}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnWater]}
              onPress={(e) => {
                e.stopPropagation()
                onWater()
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>💧 {t(lang, 'hero_water')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnFertilize]}
              onPress={(e) => {
                e.stopPropagation()
                onFertilize()
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>🌿 {t(lang, 'hero_fertilize')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 64,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 14,
  },
  featuredLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scientific: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginTop: 1,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  btn: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  btnWater: {
    backgroundColor: 'rgba(82,183,136,0.85)',
  },
  btnFertilize: {
    backgroundColor: 'rgba(45,106,79,0.85)',
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
})
