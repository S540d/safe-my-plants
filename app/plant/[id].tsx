import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { AnimatedPressable } from '../../src/components/AnimatedPressable'
import { CareConfetti } from '../../src/components/CareConfetti'
import { CareHistoryList } from '../../src/components/CareHistoryList'
import { DiseaseCard } from '../../src/components/DiseaseCard'
import { NotesSection } from '../../src/components/NotesSection'
import { PhotoGalleryModal } from '../../src/components/PhotoGalleryModal'
import { QuickActionBar } from '../../src/components/QuickActionBar'
import { TrafficLight } from '../../src/components/TrafficLight'
import { WaterDropAnimation } from '../../src/components/WaterDropAnimation'
import { Shadow } from '../../src/constants/theme'
import { usePlants } from '../../src/contexts/PlantContext'
import { formatLastDate, formatNextDate, useCareStatus } from '../../src/hooks/useCareStatus'
import { usePreferences } from '../../src/hooks/usePreferences'
import { useThemeColors } from '../../src/hooks/useThemeColors'
import { t } from '../../src/i18n/translations'

const LOCATION_LABELS: Record<string, Record<string, string>> = {
  de: { sun: 'Sonne', 'partial-shade': 'Halbschatten', shade: 'Schatten', indoor: 'Innenraum' },
  en: { sun: 'Full sun', 'partial-shade': 'Partial shade', shade: 'Shade', indoor: 'Indoor' },
}

const HUMIDITY_LABELS: Record<string, Record<string, string>> = {
  de: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' },
  en: { low: 'Low', medium: 'Medium', high: 'High' },
}

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { plants } = usePlants()
  const { language } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)
  const [showWaterDrop, setShowWaterDrop] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const plant = plants.find((p) => p.id === id)

  if (!plant) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.textMuted }]}>Pflanze nicht gefunden</Text>
      </SafeAreaView>
    )
  }

  const careStatus = useCareStatus(plant)
  const lang = language

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header photo */}
        {plant.photos.length > 0 ? (
          <AnimatedPressable
            scaleTo={0.98}
            onPress={() => {
              setGalleryInitialIndex(photoIndex)
              setGalleryVisible(true)
            }}
          >
            <Image source={{ uri: plant.photos[photoIndex].uri }} style={styles.heroPhoto} />
            {plant.photos.length > 1 && (
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>
                  {photoIndex + 1}/{plant.photos.length}
                </Text>
              </View>
            )}
          </AnimatedPressable>
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: colors.primaryMid }]}>
            <Text style={styles.heroEmoji}>🪴</Text>
          </View>
        )}

        <AnimatedPressable style={styles.backButton} onPress={() => router.back()} scaleTo={0.88}>
          <Text style={styles.backButtonText}>←</Text>
        </AnimatedPressable>

        <View style={styles.content}>
          {/* Name & status */}
          <View style={styles.nameRow}>
            <View style={styles.nameBlock}>
              <Text style={[styles.name, { color: colors.primary }]}>{plant.name}</Text>
              {plant.scientificName && (
                <Text style={[styles.scientificName, { color: colors.accent }]}>{plant.scientificName}</Text>
              )}
            </View>
            <TrafficLight status={careStatus.overall} size={20} />
          </View>

          <Text style={[styles.description, { color: colors.text }]}>{plant.description}</Text>

          {/* Quick action bar (replaces individual water/fertilize buttons) */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t(lang, 'detail_quick_actions')}</Text>
          <QuickActionBar
            plantId={plant.id}
            onWater={() => setShowWaterDrop(true)}
            onFertilize={() => setShowConfetti(true)}
          />

          {/* Next care dates */}
          <View style={styles.nextCareRow}>
            <View style={[styles.nextCareItem, { backgroundColor: colors.accentSurface }]}>
              <Text style={[styles.nextCareLabel, { color: colors.primary }]}>💧 {t(lang, 'detail_watering')}</Text>
              <Text style={[styles.nextCareValue, { color: colors.primaryMid }]}>
                {formatNextDate(plant.lastWatered, plant.careInfo.wateringFrequencyDays, lang)}
              </Text>
              <TrafficLight status={careStatus.watering} size={8} />
            </View>
            <View style={[styles.nextCareItem, { backgroundColor: colors.accentSurface }]}>
              <Text style={[styles.nextCareLabel, { color: colors.primary }]}>🌿 {t(lang, 'detail_fertilizing')}</Text>
              <Text style={[styles.nextCareValue, { color: colors.primaryMid }]}>
                {formatNextDate(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays, lang)}
              </Text>
              <TrafficLight status={careStatus.fertilizing} size={8} />
            </View>
          </View>

          {/* Care info */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t(lang, 'detail_care_info')}</Text>

          <View style={[styles.infoGrid, { backgroundColor: colors.surface }, Shadow.cardSm]}>
            <InfoRow
              icon="📍"
              label={t(lang, 'detail_location')}
              value={LOCATION_LABELS[lang][plant.location]}
              colors={colors}
            />
            <InfoRow
              icon="🌡️"
              label={t(lang, 'detail_temperature')}
              value={`${plant.careInfo.temperature.min}–${plant.careInfo.temperature.max} °C`}
              colors={colors}
            />
            <InfoRow
              icon="💦"
              label={t(lang, 'detail_humidity')}
              value={HUMIDITY_LABELS[lang][plant.careInfo.humidity]}
              colors={colors}
            />
            <InfoRow
              icon="💧"
              label={lang === 'de' ? 'Gießintervall' : 'Watering interval'}
              value={`${plant.careInfo.wateringFrequencyDays} ${t(lang, 'days')}`}
              colors={colors}
            />
            <InfoRow
              icon="🌿"
              label={lang === 'de' ? 'Düngintervall' : 'Fertilizing interval'}
              value={`${plant.careInfo.fertilizingFrequencyDays} ${t(lang, 'days')}`}
              colors={colors}
            />
          </View>

          {plant.careInfo.locationTips ? (
            <InfoBlock
              icon="📍"
              title={lang === 'de' ? 'Standorttipps' : 'Location tips'}
              text={plant.careInfo.locationTips}
              colors={colors}
            />
          ) : null}
          {plant.careInfo.wateringTips ? (
            <InfoBlock
              icon="💧"
              title={lang === 'de' ? 'Gießtipps' : 'Watering tips'}
              text={plant.careInfo.wateringTips}
              colors={colors}
            />
          ) : null}
          {plant.careInfo.fertilizingTips ? (
            <InfoBlock
              icon="🌿"
              title={lang === 'de' ? 'Düngetipps' : 'Fertilizing tips'}
              text={plant.careInfo.fertilizingTips}
              colors={colors}
            />
          ) : null}

          {/* Last care dates */}
          <View style={styles.lastDatesRow}>
            <Text style={[styles.lastDate, { color: colors.accent }]}>
              {t(lang, 'detail_last_watered')}: {formatLastDate(plant.lastWatered, lang)}
            </Text>
            <Text style={[styles.lastDate, { color: colors.accent }]}>
              {t(lang, 'detail_last_fertilized')}: {formatLastDate(plant.lastFertilized, lang)}
            </Text>
          </View>

          {/* Diseases */}
          {plant.diseases.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t(lang, 'detail_diseases')}</Text>
              {plant.diseases.map((d) => (
                <DiseaseCard key={d.id} disease={d} lang={lang} />
              ))}
            </>
          )}

          {/* Care History */}
          <CareHistoryList plantId={plant.id} />

          {/* Notes */}
          <NotesSection plantId={plant.id} lang={lang} />

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      {plant.photos.length > 0 && (
        <PhotoGalleryModal
          photos={plant.photos}
          initialIndex={galleryInitialIndex}
          visible={galleryVisible}
          onClose={() => setGalleryVisible(false)}
          lang={lang}
        />
      )}
      <WaterDropAnimation visible={showWaterDrop} onFinish={() => setShowWaterDrop(false)} />
      <CareConfetti visible={showConfetti} onFinish={() => setShowConfetti(false)} />
    </SafeAreaView>
  )
}

type ThemeColors = ReturnType<typeof useThemeColors>

function InfoRow({ icon, label, value, colors }: { icon: string; label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.background }]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.primary }]}>{value}</Text>
    </View>
  )
}

function InfoBlock({ icon, title, text, colors }: { icon: string; title: string; text: string; colors: ThemeColors }) {
  return (
    <View style={[styles.infoBlock, { backgroundColor: colors.surface }, Shadow.cardSm]}>
      <Text style={[styles.infoBlockTitle, { color: colors.primaryLight }]}>
        {icon} {title}
      </Text>
      <Text style={[styles.infoBlockText, { color: colors.text }]}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { padding: 24, fontSize: 16 },
  heroPhoto: { width: '100%', height: 240 },
  heroPlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 80 },
  photoBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  photoBadgeText: { color: '#fff', fontSize: 12 },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 20, lineHeight: 22 },
  content: { padding: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  nameBlock: { flex: 1, marginRight: 8 },
  name: { fontSize: 26, fontWeight: '700' },
  scientificName: { fontSize: 14, fontStyle: 'italic', marginTop: 2 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  nextCareRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  nextCareItem: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  nextCareLabel: { fontSize: 12, fontWeight: '600' },
  nextCareValue: { fontSize: 11, flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 10,
  },
  infoGrid: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  infoIcon: { fontSize: 16, width: 24 },
  infoLabel: { flex: 1, fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  infoBlock: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  infoBlockTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBlockText: { fontSize: 14, lineHeight: 20 },
  lastDatesRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  lastDate: { fontSize: 12 },
  bottomSpacer: { height: 40 },
})
