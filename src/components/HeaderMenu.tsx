import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Radius, Shadow, Spacing } from '../constants/theme'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'

interface HeaderMenuProps {
  lang: Language
}

type MenuItem = { key: string; labelKey: 'home_title'; route: string }

const MENU_ITEMS: { key: string; labelKey: Parameters<typeof t>[1]; route: string }[] = [
  { key: 'add-plant', labelKey: 'add_plant_title', route: '/add-plant' },
  { key: 'manage-plants', labelKey: 'manage_plants_title', route: '/manage-plants' },
  { key: 'stats', labelKey: 'stats_title', route: '/stats' },
  { key: 'settings', labelKey: 'settings_title', route: '/settings' },
]

const MENU_ICONS: Record<string, string> = {
  'add-plant': '➕',
  'manage-plants': '🪴',
  stats: '📊',
  settings: '⚙️',
}

export function HeaderMenu({ lang }: HeaderMenuProps) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const colors = useThemeColors()

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.trigger} hitSlop={12}>
        <Text style={styles.triggerText}>⋮</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={[styles.menu, { backgroundColor: colors.surface }, Shadow.menu]}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.accentSurface },
                ]}
                onPress={() => {
                  setVisible(false)
                  router.push(item.route as Parameters<typeof router.push>[0])
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.menuLabel, { color: colors.primary }]}>
                  {MENU_ICONS[item.key]}
                  {'  '}
                  {t(lang, item.labelKey)}
                </Text>
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
    paddingHorizontal: Spacing.xs,
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
    paddingRight: Spacing.lg,
  },
  menu: {
    borderRadius: Radius.xl,
    minWidth: 220,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg + 2,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
})
