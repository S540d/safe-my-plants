import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  FlatList,
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
import { PLANT_TEMPLATES, PlantTemplate } from '../src/constants/plantTemplates'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { Plant } from '../src/types/plant'

function generateId() {
  return `plant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

type Step = 'search' | 'details'

export default function AddPlantScreen() {
  const { plants, addPlant } = usePlants()
  const { language } = usePreferences()
  const router = useRouter()
  const lang = language

  const [step, setStep] = useState<Step>('search')
  const [query, setQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<PlantTemplate | null>(null)
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [showRoomSuggestions, setShowRoomSuggestions] = useState(false)

  const L = (de: string, en: string) => (lang === 'de' ? de : en)

  const existingRooms = [...new Set(plants.map((p) => p.room).filter((r): r is string => !!r?.trim()))]

  const filteredTemplates = PLANT_TEMPLATES.filter((t) => {
    const q = query.toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      (t.scientificName ?? '').toLowerCase().includes(q) ||
      (t.aliases ?? []).some((a) => a.toLowerCase().includes(q))
    )
  })

  const roomSuggestions = existingRooms.filter((r) => r !== room && r.toLowerCase().includes(room.toLowerCase()))

  const handleSelectTemplate = (template: PlantTemplate) => {
    setSelectedTemplate(template)
    setName(template.name)
    setStep('details')
  }

  const handleCustomPlant = () => {
    setSelectedTemplate(null)
    setName(query.trim())
    setStep('details')
  }

  const handleSave = async () => {
    const plantName = name.trim()
    if (!plantName) return

    const now = new Date().toISOString()
    const base = selectedTemplate ?? {
      name: plantName,
      scientificName: undefined,
      description: '',
      location: 'indoor' as const,
      diseases: [],
      careInfo: {
        wateringFrequencyDays: 7,
        wateringTips: '',
        fertilizingFrequencyDays: 14,
        fertilizingTips: '',
        locationTips: '',
        temperature: { min: 16, max: 28 },
        humidity: 'medium' as const,
      },
    }

    const newPlant: Plant = {
      ...base,
      id: generateId(),
      name: plantName,
      room: room.trim() || undefined,
      photos: [],
      lastWatered: undefined,
      lastFertilized: undefined,
      createdAt: now,
      updatedAt: now,
    }

    await addPlant(newPlant)
    router.back()
  }

  if (step === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setStep('search')} style={styles.backBtn}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{L('Pflanze hinzufügen', 'Add Plant')}</Text>
          </View>
        </LinearGradient>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
            {selectedTemplate && (
              <View style={styles.templateBadge}>
                <Text style={styles.templateBadgeText}>
                  📋 {L('Vorlage:', 'Template:')} {selectedTemplate.name}
                </Text>
              </View>
            )}

            <Text style={styles.fieldLabel}>{L('Name *', 'Name *')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={L('Pflanzenname', 'Plant name')}
              autoFocus={!selectedTemplate}
            />

            <Text style={styles.fieldLabel}>{L('Raum / Aufstellort', 'Room / Location')}</Text>
            <TextInput
              style={styles.input}
              value={room}
              onChangeText={(v) => {
                setRoom(v)
                setShowRoomSuggestions(true)
              }}
              onFocus={() => setShowRoomSuggestions(true)}
              onBlur={() => setTimeout(() => setShowRoomSuggestions(false), 150)}
              placeholder={L('z.B. Wohnzimmer', 'e.g. Living room')}
            />
            {showRoomSuggestions && roomSuggestions.length > 0 && (
              <View style={styles.suggestions}>
                {roomSuggestions.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setRoom(r)
                      setShowRoomSuggestions(false)
                    }}
                  >
                    <Text style={styles.suggestionText}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedTemplate && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>{L('Pflegeinfo', 'Care info')}</Text>
                <Text style={styles.previewItem}>
                  💧 {L('Gießen alle', 'Water every')} {selectedTemplate.careInfo.wateringFrequencyDays}{' '}
                  {L('Tage', 'days')}
                </Text>
                <Text style={styles.previewItem}>
                  🌿 {L('Düngen alle', 'Fertilize every')} {selectedTemplate.careInfo.fertilizingFrequencyDays}{' '}
                  {L('Tage', 'days')}
                </Text>
              </View>
            )}

            <Text style={styles.hint}>
              {L(
                'Weitere Details (Fotos, Krankheiten, …) kannst du später über "Pflanzen verwalten" ergänzen.',
                'Additional details (photos, diseases, …) can be added later via "Manage plants".'
              )}
            </Text>

            <TouchableOpacity
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveBtnText}>{L('Pflanze hinzufügen', 'Add plant')} ✓</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{L('Pflanze hinzufügen', 'Add Plant')}</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={L('Name oder wissenschaftlicher Name …', 'Name or scientific name …')}
          placeholderTextColor="#9CA3AF"
          autoFocus
        />
      </View>

      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.templateList}
        ListHeaderComponent={
          query.trim() ? (
            <TouchableOpacity style={styles.customRow} onPress={handleCustomPlant}>
              <View style={styles.customRowContent}>
                <Text style={styles.customRowLabel}>
                  ➕ {L('Eigene Pflanze:', 'Custom plant:')} „{query.trim()}"
                </Text>
                <Text style={styles.customRowSub}>{L('Ohne Vorlage hinzufügen', 'Add without template')}</Text>
              </View>
              <Text style={styles.rowArrow}>→</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.templateRow} onPress={() => handleSelectTemplate(item)}>
            <View style={styles.templateRowContent}>
              <Text style={styles.templateName}>{item.name}</Text>
              {item.scientificName ? <Text style={styles.templateScientific}>{item.scientificName}</Text> : null}
              {item.aliases && item.aliases.length > 0 ? (
                <Text style={styles.templateAliases}>
                  {L('auch:', 'aka:')} {item.aliases.join(', ')}
                </Text>
              ) : null}
              <Text style={styles.templateMeta}>
                💧 {item.careInfo.wateringFrequencyDays}d · 🌿 {item.careInfo.fertilizingFrequencyDays}d
              </Text>
            </View>
            <Text style={styles.rowArrow}>→</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.trim() ? null : (
            <View style={styles.emptyHint}>
              <Text style={styles.emptyHintText}>
                {L('Tippe einen Pflanzennamen ein, um loszulegen.', 'Type a plant name to get started.')}
              </Text>
            </View>
          )
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backBtnText: { color: '#B7E4C7', fontSize: 20, fontWeight: '600' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff', flex: 1 },
  searchContainer: { padding: 12 },
  searchInput: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#1A1A1A',
  },
  templateList: { paddingHorizontal: 12, paddingBottom: 24, gap: 8 },
  customRow: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#52B788',
    marginBottom: 4,
  },
  customRowContent: { flex: 1 },
  customRowLabel: { fontSize: 15, fontWeight: '600', color: '#1B4332' },
  customRowSub: { fontSize: 12, color: '#52B788', marginTop: 2 },
  templateRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  templateRowContent: { flex: 1 },
  templateName: { fontSize: 16, fontWeight: '600', color: '#1B4332' },
  templateScientific: { fontSize: 12, color: '#74C69D', fontStyle: 'italic', marginTop: 1 },
  templateAliases: { fontSize: 11, color: '#95A5A6', marginTop: 1 },
  templateMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  rowArrow: { fontSize: 18, color: '#52B788', marginLeft: 8 },
  emptyHint: { padding: 32, alignItems: 'center' },
  emptyHintText: { fontSize: 15, color: '#74C69D', textAlign: 'center' },
  detailScroll: { padding: 20, gap: 4 },
  templateBadge: {
    backgroundColor: '#D8F3DC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  templateBadgeText: { fontSize: 13, color: '#1B4332', fontWeight: '500' },
  fieldLabel: { fontSize: 13, color: '#666', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  suggestions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    marginTop: 2,
    overflow: 'hidden',
  },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#F0FFF4' },
  suggestionText: { fontSize: 14, color: '#2D6A4F' },
  previewCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },
  previewTitle: { fontSize: 12, fontWeight: '700', color: '#52B788', marginBottom: 6 },
  previewItem: { fontSize: 14, color: '#1B4332', marginBottom: 3 },
  hint: { fontSize: 13, color: '#9CA3AF', marginTop: 16, lineHeight: 18 },
  saveBtn: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: { backgroundColor: '#B7E4C7' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
