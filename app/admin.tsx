import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { Disease, Plant, PlantLocation } from '../src/types/plant'

function generateId() {
  return `plant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const LOCATIONS: PlantLocation[] = ['sun', 'partial-shade', 'shade', 'indoor']
const LOCATION_LABELS: Record<string, Record<PlantLocation, string>> = {
  de: { sun: '☀️ Sonne', 'partial-shade': '⛅ Halbschatten', shade: '🌥️ Schatten', indoor: '🏠 Innenraum' },
  en: { sun: '☀️ Full sun', 'partial-shade': '⛅ Partial shade', shade: '🌥️ Shade', indoor: '🏠 Indoor' },
}

// ─── PIN Guard ────────────────────────────────────────────────────────────────

function PinGuard({ lang, adminPin, onUnlock }: { lang: 'de' | 'en'; adminPin: string | null; onUnlock: () => void }) {
  const { setAdminPin } = usePreferences()
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const isFirstTime = !adminPin

  const handleSubmit = async () => {
    if (isFirstTime) {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError(lang === 'de' ? 'PIN muss 4 Ziffern haben.' : 'PIN must be 4 digits.')
        return
      }
      if (pin !== confirm) {
        setError(lang === 'de' ? 'PINs stimmen nicht überein.' : 'PINs do not match.')
        return
      }
      await setAdminPin(pin)
      onUnlock()
    } else {
      if (pin === adminPin) {
        onUnlock()
      } else {
        setError(lang === 'de' ? 'Falsche PIN.' : 'Wrong PIN.')
        setPin('')
      }
    }
  }

  return (
    <View style={pinStyles.container}>
      <Text style={pinStyles.emoji}>🔐</Text>
      <Text style={pinStyles.title}>{isFirstTime ? (lang === 'de' ? 'Admin-PIN festlegen' : 'Set Admin PIN') : (lang === 'de' ? 'Admin-PIN eingeben' : 'Enter Admin PIN')}</Text>
      <TextInput
        style={pinStyles.input}
        placeholder={lang === 'de' ? '4-stellige PIN' : '4-digit PIN'}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        value={pin}
        onChangeText={(v) => { setPin(v); setError('') }}
      />
      {isFirstTime && (
        <TextInput
          style={pinStyles.input}
          placeholder={lang === 'de' ? 'PIN bestätigen' : 'Confirm PIN'}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          value={confirm}
          onChangeText={(v) => { setConfirm(v); setError('') }}
        />
      )}
      {error ? <Text style={pinStyles.error}>{error}</Text> : null}
      <TouchableOpacity style={pinStyles.btn} onPress={handleSubmit}>
        <Text style={pinStyles.btnText}>{lang === 'de' ? 'Weiter' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  )
}

// ─── Plant Form ───────────────────────────────────────────────────────────────

function emptyPlant(): Plant {
  return {
    id: generateId(),
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
  return { id: generateId(), name: '', symptoms: '', treatment: '' }
}

interface PlantFormProps {
  lang: 'de' | 'en'
  initial?: Plant
  onSave: (plant: Plant) => void
  onCancel: () => void
}

function PlantForm({ lang, initial, onSave, onCancel }: PlantFormProps) {
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
      set({ photos: [...plant.photos, result.assets[0].uri] })
    }
  }

  const removePhoto = (uri: string) => set({ photos: plant.photos.filter((p) => p !== uri) })

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
      <ScrollView contentContainerStyle={formStyles.scroll} showsVerticalScrollIndicator={false}>
        <SectionLabel text={L('Pflanzendaten', 'Plant Info')} />

        <Label text={L('Name *', 'Name *')} />
        <TextInput style={formStyles.input} value={plant.name} onChangeText={(v) => set({ name: v })} placeholder={L('z.B. Monstera', 'e.g. Monstera')} />

        <Label text={L('Wissenschaftlicher Name', 'Scientific Name')} />
        <TextInput style={formStyles.input} value={plant.scientificName} onChangeText={(v) => set({ scientificName: v })} placeholder="Monstera deliciosa" />

        <Label text={L('Beschreibung', 'Description')} />
        <TextInput style={[formStyles.input, formStyles.multiline]} value={plant.description} onChangeText={(v) => set({ description: v })} multiline numberOfLines={3} placeholder={L('Kurze Beschreibung der Pflanze...', 'Short plant description...')} />

        <SectionLabel text={L('Standort', 'Location')} />
        <View style={formStyles.chipRow}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity key={loc} style={[formStyles.chip, plant.location === loc && formStyles.chipActive]} onPress={() => set({ location: loc })}>
              <Text style={[formStyles.chipText, plant.location === loc && formStyles.chipTextActive]}>{LOCATION_LABELS[lang][loc]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Pflege', 'Care')} />

        <Label text={L('Gießintervall (Tage)', 'Watering interval (days)')} />
        <TextInput style={formStyles.input} value={String(plant.careInfo.wateringFrequencyDays)} onChangeText={(v) => setCare({ wateringFrequencyDays: parseInt(v) || 7 })} keyboardType="number-pad" />

        <Label text={L('Gießtipps', 'Watering tips')} />
        <TextInput style={[formStyles.input, formStyles.multiline]} value={plant.careInfo.wateringTips} onChangeText={(v) => setCare({ wateringTips: v })} multiline numberOfLines={2} />

        <Label text={L('Düngintervall (Tage)', 'Fertilizing interval (days)')} />
        <TextInput style={formStyles.input} value={String(plant.careInfo.fertilizingFrequencyDays)} onChangeText={(v) => setCare({ fertilizingFrequencyDays: parseInt(v) || 14 })} keyboardType="number-pad" />

        <Label text={L('Düngetipps', 'Fertilizing tips')} />
        <TextInput style={[formStyles.input, formStyles.multiline]} value={plant.careInfo.fertilizingTips} onChangeText={(v) => setCare({ fertilizingTips: v })} multiline numberOfLines={2} />

        <Label text={L('Standorttipps', 'Location tips')} />
        <TextInput style={[formStyles.input, formStyles.multiline]} value={plant.careInfo.locationTips} onChangeText={(v) => setCare({ locationTips: v })} multiline numberOfLines={2} />

        <Label text={L('Temperatur min (°C)', 'Temperature min (°C)')} />
        <TextInput style={formStyles.input} value={String(plant.careInfo.temperature.min)} onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, min: parseInt(v) || 0 } })} keyboardType="number-pad" />

        <Label text={L('Temperatur max (°C)', 'Temperature max (°C)')} />
        <TextInput style={formStyles.input} value={String(plant.careInfo.temperature.max)} onChangeText={(v) => setCare({ temperature: { ...plant.careInfo.temperature, max: parseInt(v) || 30 } })} keyboardType="number-pad" />

        <Label text={L('Luftfeuchtigkeit', 'Humidity')} />
        <View style={formStyles.chipRow}>
          {(['low', 'medium', 'high'] as const).map((h) => (
            <TouchableOpacity key={h} style={[formStyles.chip, plant.careInfo.humidity === h && formStyles.chipActive]} onPress={() => setCare({ humidity: h })}>
              <Text style={[formStyles.chipText, plant.careInfo.humidity === h && formStyles.chipTextActive]}>
                {h === 'low' ? L('Niedrig', 'Low') : h === 'medium' ? L('Mittel', 'Medium') : L('Hoch', 'High')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text={L('Fotos', 'Photos')} />
        <View style={formStyles.photoGrid}>
          {plant.photos.map((uri) => (
            <View key={uri} style={formStyles.photoWrapper}>
              <Image source={{ uri }} style={formStyles.photo} />
              <TouchableOpacity style={formStyles.removePhoto} onPress={() => removePhoto(uri)}>
                <Text style={formStyles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={formStyles.addPhotoBtn} onPress={addPhoto}>
            <Text style={formStyles.addPhotoText}>+</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel text={L('Krankheiten & Schädlinge', 'Diseases & Pests')} />
        {plant.diseases.map((d) => (
          <View key={d.id} style={formStyles.diseaseChip}>
            <Text style={formStyles.diseaseChipText}>🦠 {d.name}</Text>
            <TouchableOpacity onPress={() => removeDisease(d.id)}>
              <Text style={formStyles.removePhotoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {newDisease ? (
          <View style={formStyles.diseaseForm}>
            <Label text={L('Krankheitsname', 'Disease name')} />
            <TextInput style={formStyles.input} value={newDisease.name} onChangeText={(v) => setNewDisease({ ...newDisease, name: v })} />
            <Label text={L('Symptome', 'Symptoms')} />
            <TextInput style={[formStyles.input, formStyles.multiline]} value={newDisease.symptoms} onChangeText={(v) => setNewDisease({ ...newDisease, symptoms: v })} multiline numberOfLines={2} />
            <Label text={L('Behandlung', 'Treatment')} />
            <TextInput style={[formStyles.input, formStyles.multiline]} value={newDisease.treatment} onChangeText={(v) => setNewDisease({ ...newDisease, treatment: v })} multiline numberOfLines={2} />
            <View style={formStyles.row}>
              <TouchableOpacity style={[formStyles.btn, formStyles.btnSecondary]} onPress={() => setNewDisease(null)}>
                <Text style={formStyles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[formStyles.btn, formStyles.btnPrimary]} onPress={saveDisease}>
                <Text style={formStyles.btnPrimaryText}>{L('Hinzufügen', 'Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={formStyles.addDiseaseBtn} onPress={() => setNewDisease(emptyDisease())}>
            <Text style={formStyles.addDiseaseBtnText}>+ {L('Krankheit hinzufügen', 'Add disease')}</Text>
          </TouchableOpacity>
        )}

        <View style={formStyles.actions}>
          <TouchableOpacity style={[formStyles.btn, formStyles.btnSecondary]} onPress={onCancel}>
            <Text style={formStyles.btnSecondaryText}>{L('Abbrechen', 'Cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[formStyles.btn, formStyles.btnPrimary]} onPress={handleSave}>
            <Text style={formStyles.btnPrimaryText}>{L('Speichern', 'Save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={formStyles.label}>{text}</Text>
}
function SectionLabel({ text }: { text: string }) {
  return <Text style={formStyles.sectionLabel}>{text}</Text>
}

// ─── Main Admin Screen ────────────────────────────────────────────────────────

export default function AdminScreen() {
  const { plants, addPlant, updatePlant, deletePlant } = usePlants()
  const { language, adminPin } = usePreferences()
  const [unlocked, setUnlocked] = useState(false)
  const [editing, setEditing] = useState<Plant | null>(null)
  const [creating, setCreating] = useState(false)
  const lang = language

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
          <Text style={styles.headerTitle}>{lang === 'de' ? 'Admin' : 'Admin'}</Text>
        </LinearGradient>
        <PinGuard lang={lang} adminPin={adminPin} onUnlock={() => setUnlocked(true)} />
      </SafeAreaView>
    )
  }

  if (creating) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
          <Text style={styles.headerTitle}>{lang === 'de' ? 'Pflanze hinzufügen' : 'Add Plant'}</Text>
        </LinearGradient>
        <PlantForm
          lang={lang}
          onSave={async (p) => { await addPlant(p); setCreating(false) }}
          onCancel={() => setCreating(false)}
        />
      </SafeAreaView>
    )
  }

  if (editing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
          <Text style={styles.headerTitle}>{lang === 'de' ? 'Pflanze bearbeiten' : 'Edit Plant'}</Text>
        </LinearGradient>
        <PlantForm
          lang={lang}
          initial={editing}
          onSave={async (p) => { await updatePlant(p); setEditing(null) }}
          onCancel={() => setEditing(null)}
        />
      </SafeAreaView>
    )
  }

  const handleDelete = (plant: Plant) => {
    Alert.alert(
      lang === 'de' ? 'Löschen?' : 'Delete?',
      lang === 'de' ? `"${plant.name}" wirklich löschen?` : `Really delete "${plant.name}"?`,
      [
        { text: lang === 'de' ? 'Abbrechen' : 'Cancel', style: 'cancel' },
        { text: lang === 'de' ? 'Löschen' : 'Delete', style: 'destructive', onPress: () => deletePlant(plant.id) },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <Text style={styles.headerTitle}>{lang === 'de' ? 'Admin' : 'Admin'}</Text>
        <Text style={styles.headerSub}>{lang === 'de' ? 'Pflanzenverwaltung' : 'Plant Management'}</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
          <Text style={styles.addBtnText}>+ {lang === 'de' ? 'Neue Pflanze' : 'New Plant'}</Text>
        </TouchableOpacity>
        {plants.map((plant) => (
          <View key={plant.id} style={styles.plantRow}>
            <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
            <View style={styles.plantActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(plant)}>
                <Text style={styles.editBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(plant)}>
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.lockBtn} onPress={() => setUnlocked(false)}>
          <Text style={styles.lockBtnText}>🔒 {lang === 'de' ? 'Admin sperren' : 'Lock Admin'}</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 14, color: '#B7E4C7', marginTop: 2 },
  scroll: { padding: 16 },
  addBtn: {
    backgroundColor: '#2D6A4F', borderRadius: 12,
    padding: 14, alignItems: 'center', marginBottom: 16,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  plantRow: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  plantName: { flex: 1, fontSize: 16, color: '#1B4332', fontWeight: '500' },
  plantActions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 18 },
  lockBtn: {
    marginTop: 24, padding: 12, alignItems: 'center',
  },
  lockBtnText: { fontSize: 14, color: '#74C69D' },
})

const pinStyles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1B4332', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%', borderWidth: 1.5, borderColor: '#B7E4C7',
    borderRadius: 10, padding: 12, fontSize: 20, textAlign: 'center',
    backgroundColor: '#fff', marginBottom: 12, letterSpacing: 8,
  },
  error: { color: '#E63946', fontSize: 14, marginBottom: 8 },
  btn: {
    backgroundColor: '#2D6A4F', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 40, marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})

const formStyles = StyleSheet.create({
  scroll: { padding: 16 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: '#52B788',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginTop: 20, marginBottom: 8,
  },
  label: { fontSize: 13, color: '#666', marginBottom: 4, marginTop: 10 },
  input: {
    borderWidth: 1.5, borderColor: '#B7E4C7', borderRadius: 8,
    padding: 10, fontSize: 15, backgroundColor: '#fff',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18,
    borderWidth: 1.5, borderColor: '#B7E4C7', backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  chipText: { fontSize: 13, color: '#2D6A4F' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrapper: { position: 'relative' },
  photo: { width: 80, height: 80, borderRadius: 8 },
  removePhoto: {
    position: 'absolute', top: -6, right: -6,
    backgroundColor: '#E63946', borderRadius: 10, width: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  removePhotoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  addPhotoBtn: {
    width: 80, height: 80, borderRadius: 8,
    borderWidth: 2, borderColor: '#B7E4C7', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0FFF4',
  },
  addPhotoText: { fontSize: 28, color: '#52B788' },
  diseaseChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF9F0', borderRadius: 8, padding: 10,
    marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#F4A261',
  },
  diseaseChipText: { fontSize: 14, color: '#1B4332' },
  diseaseForm: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#B7E4C7',
  },
  addDiseaseBtn: {
    padding: 10, alignItems: 'center', borderRadius: 8,
    borderWidth: 1.5, borderColor: '#B7E4C7', borderStyle: 'dashed',
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
