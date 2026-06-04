import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { DiseaseCard } from '../../src/components/DiseaseCard'
import { NotesSection } from '../../src/components/NotesSection'
import { TrafficLight } from '../../src/components/TrafficLight'
import { WaterDropAnimation } from '../../src/components/WaterDropAnimation'
import { usePlants } from '../../src/contexts/PlantContext'
import { formatLastDate, formatNextDate, useCareStatus } from '../../src/hooks/useCareStatus'
import { usePreferences } from '../../src/hooks/usePreferences'

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
  const { plants, markWatered, markFertilized } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showWaterDrop, setShowWaterDrop] = useState(false)

  const plant = plants.find((p) => p.id === id)

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Pflanze nicht gefunden</Text>
      </SafeAreaView>
    )
  }

  const careStatus = useCareStatus(plant)
  const lang = language

  const handleMarkWatered = () => {
    const msg = lang === 'de' ? 'Als gegossen markieren?' : 'Mark as watered?'
    Alert.alert('', msg, [
      { text: lang === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          await markWatered(plant.id)
          setShowWaterDrop(true)
        }
      },
    ])
  }

  const handleMarkFertilized = () => {
    const msg = lang === 'de' ? 'Als gedüngt markieren?' : 'Mark as fertilized?'
    Alert.alert('', msg, [
      { text: lang === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => markFertilized(plant.id) },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header photo */}
        {plant.photos.length > 0 ? (
          <TouchableOpacity onPress={() => setPhotoIndex((i) => (i + 1) % plant.photos.length)}>
            <Image source={{ uri: plant.photos[photoIndex] }} style={styles.heroPhoto} />
            {plant.photos.length > 1 && (
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>
                  {photoIndex + 1}/{plant.photos.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroEmoji}>🪴</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Name & status */}
          <View style={styles.nameRow}>
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{plant.name}</Text>
              {plant.scientificName && <Text style={styles.scientificName}>{plant.scientificName}</Text>}
            </View>
            <TrafficLight status={careStatus.overall} size={20} />
          </View>

          <Text style={styles.description}>{plant.description}</Text>

          {/* Care action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, careStatus.watering === 'ok' ? styles.actionBtnOk : styles.actionBtnAlert]}
              onPress={handleMarkWatered}
            >
              <Text style={styles.actionIcon}>💧</Text>
              <View>
                <Text style={styles.actionLabel}>{lang === 'de' ? 'Gießen' : 'Water'}</Text>
                <Text style={styles.actionSub}>{formatNextDate(plant.lastWatered, plant.careInfo.wateringFrequencyDays, lang)}</Text>
              </View>
              <TrafficLight status={careStatus.watering} size={10} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, careStatus.fertilizing === 'ok' ? styles.actionBtnOk : styles.actionBtnAlert]}
              onPress={handleMarkFertilized}
            >
              <Text style={styles.actionIcon}>🌿</Text>
              <View>
                <Text style={styles.actionLabel}>{lang === 'de' ? 'Düngen' : 'Fertilize'}</Text>
                <Text style={styles.actionSub}>{formatNextDate(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays, lang)}</Text>
              </View>
              <TrafficLight status={careStatus.fertilizing} size={10} />
            </TouchableOpacity>
          </View>

          {/* Care info */}
          <Text style={styles.sectionTitle}>{lang === 'de' ? 'Pflegehinweise' : 'Care Instructions'}</Text>

          <View style={styles.infoGrid}>
            <InfoRow icon="📍" label={lang === 'de' ? 'Standort' : 'Location'} value={LOCATION_LABELS[lang][plant.location]} />
            <InfoRow icon="🌡️" label={lang === 'de' ? 'Temperatur' : 'Temperature'} value={`${plant.careInfo.temperature.min}–${plant.careInfo.temperature.max} °C`} />
            <InfoRow icon="💦" label={lang === 'de' ? 'Luftfeuchtigkeit' : 'Humidity'} value={HUMIDITY_LABELS[lang][plant.careInfo.humidity]} />
            <InfoRow icon="💧" label={lang === 'de' ? 'Gießintervall' : 'Watering interval'} value={`${plant.careInfo.wateringFrequencyDays} ${lang === 'de' ? 'Tage' : 'days'}`} />
            <InfoRow icon="🌿" label={lang === 'de' ? 'Düngintervall' : 'Fertilizing interval'} value={`${plant.careInfo.fertilizingFrequencyDays} ${lang === 'de' ? 'Tage' : 'days'}`} />
          </View>

          {plant.careInfo.locationTips ? (
            <InfoBlock icon="📍" title={lang === 'de' ? 'Standorttipps' : 'Location tips'} text={plant.careInfo.locationTips} />
          ) : null}
          {plant.careInfo.wateringTips ? (
            <InfoBlock icon="💧" title={lang === 'de' ? 'Gießtipps' : 'Watering tips'} text={plant.careInfo.wateringTips} />
          ) : null}
          {plant.careInfo.fertilizingTips ? (
            <InfoBlock icon="🌿" title={lang === 'de' ? 'Düngetipps' : 'Fertilizing tips'} text={plant.careInfo.fertilizingTips} />
          ) : null}

          {/* Last care dates */}
          <View style={styles.lastDatesRow}>
            <Text style={styles.lastDate}>
              {lang === 'de' ? 'Gegossen' : 'Watered'}: {formatLastDate(plant.lastWatered, lang)}
            </Text>
            <Text style={styles.lastDate}>
              {lang === 'de' ? 'Gedüngt' : 'Fertilized'}: {formatLastDate(plant.lastFertilized, lang)}
            </Text>
          </View>

          {/* Diseases */}
          {plant.diseases.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{lang === 'de' ? 'Krankheiten & Schädlinge' : 'Diseases & Pests'}</Text>
              {plant.diseases.map((d) => (
                <DiseaseCard key={d.id} disease={d} lang={lang} />
              ))}
            </>
          )}

          {/* Notes */}
          <NotesSection plantId={plant.id} lang={lang} />

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <WaterDropAnimation visible={showWaterDrop} onFinish={() => setShowWaterDrop(false)} />
    </SafeAreaView>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

function InfoBlock({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoBlockTitle}>{icon} {title}</Text>
      <Text style={styles.infoBlockText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  notFound: { padding: 24, fontSize: 16, color: '#666' },
  heroPhoto: { width: '100%', height: 240 },
  heroPlaceholder: {
    width: '100%', height: 200,
    backgroundColor: '#2D6A4F',
    alignItems: 'center', justifyContent: 'center',
  },
  heroEmoji: { fontSize: 80 },
  photoBadge: {
    position: 'absolute', right: 12, bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2,
  },
  photoBadgeText: { color: '#fff', fontSize: 12 },
  backButton: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20, width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 20, lineHeight: 22 },
  content: { padding: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  nameBlock: { flex: 1, marginRight: 8 },
  name: { fontSize: 26, fontWeight: '700', color: '#1B4332' },
  scientificName: { fontSize: 14, color: '#74C69D', fontStyle: 'italic', marginTop: 2 },
  description: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderRadius: 12,
  },
  actionBtnOk: { backgroundColor: '#D8F3DC' },
  actionBtnAlert: { backgroundColor: '#FFE8D6' },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#1B4332' },
  actionSub: { fontSize: 11, color: '#52B788', marginTop: 1 },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#1B4332',
    marginTop: 4, marginBottom: 10,
  },
  infoGrid: {
    backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0FFF4',
  },
  infoIcon: { fontSize: 16, width: 24 },
  infoLabel: { flex: 1, fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1B4332' },
  infoBlock: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  infoBlockTitle: { fontSize: 13, fontWeight: '700', color: '#52B788', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoBlockText: { fontSize: 14, color: '#444', lineHeight: 20 },
  lastDatesRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  lastDate: { fontSize: 12, color: '#74C69D' },
  bottomSpacer: { height: 40 },
})
