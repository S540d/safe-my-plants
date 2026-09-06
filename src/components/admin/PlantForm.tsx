import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Disease, Plant, PlantLocation, PlantPhoto } from '../../types/plant'
import { generateId } from '../../utils/id'

const LOCATIONS: PlantLocation[] = ['sun', 'partial-shade', 'shade', 'indoor']
const LOCATION_LABELS: Record<string, Record<PlantLocation, string>> = {
  de: { sun: '☀️ Sonne', 'partial-shade': '⛅ Halbschatten', shade: '🌥️ Schatten', indoor: '🏠 Innenraum' },
  en: { sun: '☀️ Full sun', 'partial-shade': '⛅ Partial shade', shade: '🌥️ Shade', indoor: '🏠 Indoor' },
}

export function emptyPlant(): Plant {
  return {
    id: generateId('plant'),
    name: '',
    scientificName: '',
    description: '',
    photos: [],
    location: 'indoor',
    careInfo: {
      wateringFrequencyDays: 7,
      wateringTips: '',
      fertilizingFrequencyDays: 14,
      fertilizingTips: '',
      locationTips: '',
      temperature: { min: 16, max: 28 },
      humidity: 'medium',
    },
    diseases: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function emptyDisease(): Disease {
  return { id: generateId('disease'), name: '', symptoms: '', treatment: '' }
}

interface PlantFormProps {
  lang: 'de' | 'en'
  initial?: Plant
  onSave: (plant: Plant) => void
  onCancel: () => void
}

export function PlantForm({ lang, initial, onSave, onCancel }: PlantFormProps) {
  const [plant, setPlant] = useState<Plant>(initial ?? emptyPlant())
  const [newDisease, setNewDisease] = useState<Disease | null>(null)

  const set = (update: Partial<Plant>) => setPlant((p) => ({ ...p, ...update, updatedAt: new Date().toISOString() }))
  const setCare = (update: Partial<Plant['careInfo']>) => set({ careInfo: { ...plant.careInfo, ...update } })

  const addPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      const photo: PlantPhoto = { uri: result.assets[0].uri, takenAt: new Date().toISOString() }
      set({ photos: [...plant.photos, photo] })
    }
  }

  const removePhoto = (uri: string) => set({ photos: plant.photos.filter((p) => p.uri !== uri) })

  const saveDisease = () => {
    if (!newDisease || !newDisease.name.trim()) return
    set({ diseases: [...plant.diseases, newDisease] })
    setNewDisease(null)
  }

  const removeDisease = (id: string) => set({ diseases: plant.diseases.filter((d) => d.id !== id) })

  const handleSave = () => {
    if (!plant.name.trim()) {
      Alert.alert('', lang === 'de' ? 'Name ist erforderlich.' : 'Name is required.')
      return
    }
    onSave(plant)
  }

  const L = (de: string, en: string) => (lang === 'de' ? de : en)

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionLabel text={L('Pflanzendaten', 'Plant Info')} />

        <Label text={L('Name *', 'Name *')} />
        <TextInput
          style={styles.input}
          value={plant.name}
          onChangeText={(v) => set({ name: v })}
          placeholder={L('z.B. Monstera', 'e.g. Monstera')}
        />

        <Label text={L('Wissenschaftlicher Name', 'Scientific Name')} />
        <TextInput
          style={styles.input}
          value={plant.scientificName}
          onChangeText={(v) => set({ scientificName: v })}
          placeholder="Monstera deliciosa"
        />

        <Label text={L('Beschreibung', 'Description')} />
        <TextInput
          style={[styles.input, styles.multiline]}
          value={plant.description}
          onChangeText={(v) => set({ description: v })}
          multiline
          numberOfLines={3}
          placeholder={L('Kurze Beschreibung der Pflanze...', 'Short plant description...')}
        />

        <SectionLabel text={L('Standort', 'Location')} />
        <View style={styles.chipRow}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.chip, plant.location === loc && styles.chipActive]}
              onPress={() => set({ location: loc })}
            >
              <Text style={[styles.chipText, plant.location === loc && styles.chipTextActive]}>
                {LOCATION_LABELS[lang][loc]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Pflege', 'Care')} />

        <Label text={L('Gießintervall (Tage)', 'Watering interval (days)')} />
        <TextInput
          style={styles.input}
          value={String(plant.careInfo.wateringFrequencyDays)}
          onChangeText={(v) => setCare({ wateringFrequencyDays: parseInt(v) || 7 })}
          keyboardType="number-pad"
        />

        <Label text={L('Gießtipps', 'Watering tips')} />
        <TextInput
          style={[styles.input, styles.multiline]}
          value={plant.careInfo.wateringTips}
          onChangeText={(v) => setCare({ wateringTips: v })}
          multiline
          numberOfLines={2}
        />

        <Label text={L('Düngintervall (Tage)', 'Fertilizing interval (days)')} />
        <TextInput
          style={styles.input}
          value={String(plant.careInfo.fertilizingFrequencyDays)}
          onChangeText={(v) => setCare({ fertilizingFrequencyDays: parseInt(v) || 14 })}
          keyboardType="number-pad"
        />

        <Label text={L('Düngetipps', 'Fertilizing tips')} />
        <TextInput
          style={[styles.input, styles.multiline]}
          value={plant.careInfo.fertilizingTips}
          onChangeText={(v) => setCare({ fertilizingTips: v })}
          multiline
          numberOfLines={2}
        />

        <Label text={L('Standorttipps', 'Location tips')} />
        <TextInput
          style={[styles.input, styles.multiline]}
          value={plant.careInfo.locationTips}
          onChangeText={(v) => setCare({ locationTips: v })}
          multiline
          numberOfLines={2}
        />

        <Label text={L('Temperatur min (°C)', 'Temperature min (°C)')} />
        <TextInput
          style={styles.input}
          value={String(plant.careInfo.temperature.min)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, min: parseInt(v) || 0 } })}
          keyboardType="number-pad"
        />

        <Label text={L('Temperatur max (°C)', 'Temperature max (°C)')} />
        <TextInput
          style={styles.input}
          value={String(plant.careInfo.temperature.max)}
          onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, max: parseInt(v) || 30 } })}
          keyboardType="number-pad"
        />

        <Label text={L('Luftfeuchtigkeit', 'Humidity')} />
        <View style={styles.chipRow}>
          {(['low', 'medium', 'high'] as const).map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.chip, plant.careInfo.humidity === h && styles.chipActive]}
              onPress={() => setCare({ humidity: h })}
            >
              <Text style={[styles.chipText, plant.careInfo.humidity === h && styles.chipTextActive]}>
                {h === 'low' ? L('Niedrig', 'Low') : h === 'medium' ? L('Mittel', 'Medium') : L('Hoch', 'High')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Fotos', 'Photos')} />
        <View style={styles.photoGrid}>
          {plant.photos.map((photo) => (
            <View key={photo.uri} style={styles.photoWrapper}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <TouchableOpacity style={styles.removePhoto} onPress={() => removePhoto(photo.uri)}>
                <Text style={styles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto}>
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel text={L('Krankheiten & Schädlinge', 'Diseases & Pests')} />
        {plant.diseases.map((d) => (
          <View key={d.id} style={styles.diseaseChip}>
            <Text style={styles.diseaseChipText}>🦠 {d.name}</Text>
            <TouchableOpacity onPress={() => removeDisease(d.id)}>
              <Text style={styles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {newDisease ? (
          <View style={styles.diseaseForm}>
            <Label text={L('Krankheitsname', 'Disease name')} />
            <TextInput
              style={styles.input}
              value={newDisease.name}
              onChangeText={(v) => setNewDisease({ ...newDisease, name: v })}
            />
            <Label text={L('Symptome', 'Symptoms')} />
            <TextInput
              style={[styles.input, styles.multiline]}
              value={newDisease.symptoms}
              onChangeText={(v) => setNewDisease({ ...newDisease, symptoms: v })}
              multiline
              numberOfLines={2}
            />
            <Label text={L('Behandlung', 'Treatment')} />
            <TextInput
              style={[styles.input, styles.multiline]}
              value={newDisease.treatment}
              onChangeText={(v) => setNewDisease({ ...newDisease, treatment: v })}
              multiline
              numberOfLines={2}
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setNewDisease(null)}>
                <Text style={styles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={saveDisease}>
                <Text style={styles.btnPrimaryText}>{L('Hinzufügen', 'Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addDiseaseBtn} onPress={() => setNewDisease(emptyDisease())}>
            <Text style={styles.addDiseaseBtnText}>+ {L('Krankheit hinzufügen', 'Add disease')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onCancel}>
            <Text style={styles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
            <Text style={styles.btnPrimaryText}>{L('Speichern', 'Save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>
}
function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52B788',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
  },
  label: { fontSize: 13, color: '#666', marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  chipText: { fontSize: 13, color: '#2D6A4F' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrapper: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: 8 },
  removePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E63946',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#B7E4C7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FFF4',
  },
  addPhotoText: { fontSize: 28, color: '#52B788' },
  diseaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F4A261',
  },
  diseaseChipText: { fontSize: 14, color: '#1B4332' },
  diseaseForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },
  addDiseaseBtn: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addDiseaseBtnText: { color: '#52B788', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2D6A4F' },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#B7E4C7' },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecondaryText: { color: '#2D6A4F', fontSize: 15 },
})
