import React, { useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { usePlants } from '../contexts/PlantContext'
import { useCareLog } from '../hooks/useCareLog'
import { usePreferences } from '../hooks/usePreferences'
import { t } from '../i18n/translations'

interface Props {
  plantId: string
}

const ACTIONS = [
  { type: 'water' as const, icon: '💧', labelKey: 'action_water' as const },
  { type: 'fertilize' as const, icon: '🌿', labelKey: 'action_fertilize' as const },
  { type: 'repot' as const, icon: '🪴', labelKey: 'action_repot' as const },
  { type: 'prune' as const, icon: '✂️', labelKey: 'action_prune' as const },
  { type: 'note' as const, icon: '📝', labelKey: 'action_note' as const },
]

export function QuickActionBar({ plantId }: Props) {
  const { markWatered, markFertilized } = usePlants()
  const { addAction } = useCareLog()
  const { language } = usePreferences()
  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const [noteText, setNoteText] = useState('')

  const handleAction = async (type: (typeof ACTIONS)[number]['type']) => {
    if (type === 'water') {
      await markWatered(plantId)
    } else if (type === 'fertilize') {
      await markFertilized(plantId)
    } else if (type === 'note') {
      setNoteModalVisible(true)
    } else {
      await addAction({ plantId, type })
    }
  }

  const handleSaveNote = async () => {
    if (noteText.trim()) {
      await addAction({ plantId, type: 'note', note: noteText.trim() })
    }
    setNoteText('')
    setNoteModalVisible(false)
  }

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}
      >
        {ACTIONS.map(({ type, icon, labelKey }) => (
          <TouchableOpacity key={type} style={styles.btn} onPress={() => handleAction(type)} activeOpacity={0.7}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{t(language, labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={noteModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t(language, 'note_modal_title')}</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholder={t(language, 'note_modal_placeholder')}
              placeholderTextColor="#9CA3AF"
              value={noteText}
              onChangeText={setNoteText}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setNoteText('')
                  setNoteModalVisible(false)
                }}
              >
                <Text style={styles.cancelBtnText}>{t(language, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSaveNote}>
                <Text style={styles.saveBtnText}>{t(language, 'save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -16 },
  row: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  btn: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 72,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  label: { fontSize: 11, color: '#1B4332', fontWeight: '600', textAlign: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1FAE5',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  saveBtn: { backgroundColor: '#2D6A4F' },
  cancelBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
