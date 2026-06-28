import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useThemeColors } from '../hooks/useThemeColors'
import { Language } from '../i18n/translations'

interface HeaderMenuProps {
  lang: Language
}

const MENU_ITEMS = {
  de: [
    { key: 'add-plant', label: '➕  Pflanze hinzufügen', route: '/add-plant' },
    { key: 'manage-plants', label: '🪴  Pflanzen verwalten', route: '/manage-plants' },
    { key: 'stats', label: '📊  Statistik', route: '/stats' },
    { key: 'settings', label: '⚙️  Einstellungen', route: '/settings' },
  ],
  en: [
    { key: 'add-plant', label: '➕  Add plant', route: '/add-plant' },
    { key: 'manage-plants', label: '🪴  Manage plants', route: '/manage-plants' },
    { key: 'stats', label: '📊  Statistics', route: '/stats' },
    { key: 'settings', label: '⚙️  Settings', route: '/settings' },
  ],
} as const

export function HeaderMenu({ lang }: HeaderMenuProps) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const colors = useThemeColors()
  const items = MENU_ITEMS[lang]

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.trigger} hitSlop={12}>
        <Text style={styles.triggerText}>⋮</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={[styles.menu, { backgroundColor: colors.surface }]}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#D8F3DC' },
                ]}
                onPress={() => {
                  setVisible(false)
                  router.push(item.route)
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.menuLabel, { color: colors.primary }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  triggerText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 32,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 16,
  },
  menu: {
    borderRadius: 14,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
})
