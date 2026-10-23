import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { usePlants } from '../contexts/PlantContext'
import { getCareStatus } from '../hooks/useCareStatus'
import { useCareLog } from '../hooks/useCareLog'
import { usePreferences } from '../hooks/usePreferences'
import { useThemeColors } from '../hooks/useThemeColors'
import { t } from '../i18n/translations'
import { Shadow, ThemeColors } from '../constants/theme'
import { Icon, IconName } from './Icon'

interface Props {
  plantId: string
  onWater?: () => void
  onFertilize?: () => void
}

const ACTIONS = [
  { type: 'water' as const, icon: 'water' as const, labelKey: 'action_water' as const },
  { type: 'snooze' as const, icon: 'soilMoist' as const, labelKey: 'action_soil_moist' as const },
  { type: 'fertilize' as const, icon: 'fertilize' as const, labelKey: 'action_fertilize' as const },
  { type: 'repot' as const, icon: 'repot' as const, labelKey: 'action_repot' as const },
  { type: 'prune' as const, icon: 'prune' as const, labelKey: 'action_prune' as const },
  { type: 'note' as const, icon: 'note' as const, labelKey: 'action_note' as const },
]

export function QuickActionBar({ plantId, onWater, onFertilize }: Props) {
  const { plants, markWatered, markFertilized, snoozeWatering } = usePlants()
  const plant = plants.find((p) => p.id === plantId)
  // Soil check only makes sense while watering is due or nearly due.
  const showSnooze = plant ? getCareStatus(plant).watering !== 'ok' : false
  const { addAction } = useCareLog()
  const { language } = usePreferences()
  const colors = useThemeColors()
  const [noteModalVisible, setNoteModalVisible] = useState(false)
  const [noteText, setNoteText] = useState('')

  const handleAction = async (type: (typeof ACTIONS)[number]['type']) => {
    if (type === 'water') {
      await markWatered(plantId)
      onWater?.()
    } else if (type === 'snooze') {
      await snoozeWatering(plantId)
    } else if (type === 'fertilize') {
      await markFertilized(plantId)
      onFertilize?.()
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
        {ACTIONS.filter(({ type }) => type !== 'snooze' || showSnooze).map(({ type, icon, labelKey }) => (
          <QuickActionButton
            key={type}
            icon={icon}
            label={t(language, labelKey)}
            colors={colors}
            onPress={() => handleAction(type)}
          />
        ))}
      </ScrollView>

      <Modal visible={noteModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>{t(language, 'note_modal_title')}</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              multiline
              numberOfLines={4}
              placeholder={t(language, 'note_modal_placeholder')}
              placeholderTextColor={colors.textSubtle}
              value={noteText}
              onChangeText={setNoteText}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.surfaceAlt }]}
                onPress={() => {
                  setNoteText('')
                  setNoteModalVisible(false)
                }}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>{t(language, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={handleSaveNote}>
                <Text style={[styles.saveBtnText, { color: colors.textOnPrimary }]}>{t(language, 'save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

interface QuickActionButtonProps {
  icon: IconName
  label: string
  colors: ThemeColors
  onPress: () => void
}

function QuickActionButton({ icon, label, colors, onPress }: QuickActionButtonProps) {
  const scale = useSharedValue(1)
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={buttonStyle}>
      <Pressable
        style={[styles.btn, { backgroundColor: colors.surface }, Shadow.cardSm]}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 12, stiffness: 320 })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 320 })
        }}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.accentSurface }]}>
          <Icon name={icon} size={20} color={colors.primaryLight} />
        </View>
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
      </Pressable>
    </Animated.View>
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
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 76,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
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
    borderRadius: 999,
    alignItems: 'center',
  },
  cancelBtnText: { fontWeight: '600', fontSize: 15 },
  saveBtnText: { fontWeight: '700', fontSize: 15 },
})
