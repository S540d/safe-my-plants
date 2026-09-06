import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PinGuard } from '../src/components/admin/PinGuard'
import { PlantForm } from '../src/components/admin/PlantForm'
import { TemplatesModal } from '../src/components/admin/TemplatesModal'
import { PlantTemplate } from '../src/constants/plantTemplates'
import { usePlants } from '../src/contexts/PlantContext'
import { usePreferences } from '../src/hooks/usePreferences'
import { Plant } from '../src/types/plant'
import { generateId } from '../src/utils/id'

export default function AdminScreen() {
  const { plants, addPlant, updatePlant, deletePlant } = usePlants()
  const { language, adminPin } = usePreferences()
  const [unlocked, setUnlocked] = useState(false)
  const [editing, setEditing] = useState<Plant | null>(null)
  const [creating, setCreating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const lang = language

  const handleSelectTemplate = (template: PlantTemplate) => {
    setShowTemplates(false)
    const now = new Date().toISOString()
    const prefilled: Plant = {
      ...template,
      id: generateId('plant'),
      photos: [],
      lastWatered: undefined,
      lastFertilized: undefined,
      createdAt: now,
      updatedAt: now,
    }
    setEditing(prefilled)
  }

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
          onSave={async (p) => {
            await addPlant(p)
            setCreating(false)
          }}
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
          onSave={async (p) => {
            await updatePlant(p)
            setEditing(null)
          }}
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
      <TemplatesModal
        lang={lang}
        visible={showTemplates}
        onSelect={handleSelectTemplate}
        onClose={() => setShowTemplates(false)}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
          <Text style={styles.addBtnText}>+ {lang === 'de' ? 'Neue Pflanze' : 'New Plant'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.templateBtn} onPress={() => setShowTemplates(true)}>
          <Text style={styles.templateBtnText}>
            📋 {lang === 'de' ? 'Aus Vorlage hinzufügen' : 'Add from template'}
          </Text>
        </TouchableOpacity>
        {plants.map((plant) => (
          <View key={plant.id} style={styles.plantRow}>
            <Text style={styles.plantName} numberOfLines={1}>
              {plant.name}
            </Text>
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
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  templateBtn: {
    backgroundColor: '#D8F3DC',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#52B788',
  },
  templateBtnText: { color: '#1B4332', fontSize: 15, fontWeight: '600' },
  plantRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  plantName: { flex: 1, fontSize: 16, color: '#1B4332', fontWeight: '500' },
  plantActions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 18 },
  lockBtn: {
    marginTop: 24,
    padding: 12,
    alignItems: 'center',
  },
  lockBtnText: { fontSize: 14, color: '#74C69D' },
})
