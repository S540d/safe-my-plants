import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Language, t, TranslationKey } from '../i18n/translations'
import { SortOption } from '../utils/plantFilter'

interface Props {
  value: SortOption
  onChange: (sort: SortOption) => void
  lang: Language
}

const OPTIONS: { value: SortOption; labelKey: TranslationKey }[] = [
  { value: 'name', labelKey: 'sort_name' },
  { value: 'nextCare', labelKey: 'sort_next_care' },
  { value: 'recent', labelKey: 'sort_recent' },
]

export function SortMenu({ value, onChange, lang }: Props) {
  const [open, setOpen] = useState(false)
  const current = OPTIONS.find((o) => o.value === value)!

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>↕ {t(lang, current.labelKey)}</Text>
      </TouchableOpacity>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, opt.value === value && styles.optionActive]}
              onPress={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              <Text style={[styles.optionText, opt.value === value && styles.optionTextActive]}>
                {opt.value === value ? '✓  ' : '    '}
                {t(lang, opt.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  triggerText: { fontSize: 13, color: '#2D6A4F', fontWeight: '600' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    position: 'absolute',
    right: 16,
    top: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FFF4',
  },
  optionActive: { backgroundColor: '#F0FFF4' },
  optionText: { fontSize: 15, color: '#1B4332' },
  optionTextActive: { color: '#2D6A4F', fontWeight: '600' },
})
