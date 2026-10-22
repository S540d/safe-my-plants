import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Radius, Shadow, Spacing } from '../constants/theme'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'
import { AnimatedPressable } from './AnimatedPressable'
import { Icon, IconName } from './Icon'

interface HeaderMenuProps {
  lang: Language
}

const MENU_ITEMS: { key: string; labelKey: Parameters<typeof t>[1]; route: string }[] = [
  { key: 'add-plant', labelKey: 'add_plant_title', route: '/add-plant' },
  { key: 'manage-plants', labelKey: 'manage_plants_title', route: '/manage-plants' },
  { key: 'symptom-guide', labelKey: 'symptom_guide_title', route: '/symptom-guide' },
  { key: 'stats', labelKey: 'stats_title', route: '/stats' },
  { key: 'settings', labelKey: 'settings_title', route: '/settings' },
]

const MENU_ICONS: Record<string, IconName> = {
  'add-plant': 'add',
  'manage-plants': 'plants',
  'symptom-guide': 'guide',
  stats: 'stats',
  settings: 'settings',
}

export function HeaderMenu({ lang }: HeaderMenuProps) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const colors = useThemeColors()

  return (
    <>
      <AnimatedPressable onPress={() => setVisible(true)} style={styles.trigger} scaleTo={0.85} hitSlop={12}>
        <Icon name="more" size={24} color={colors.headerTitle} />
      </AnimatedPressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={[styles.menu, { backgroundColor: colors.surface }, Shadow.menu]}>
            {MENU_ITEMS.map((item, index) => (
              <AnimatedPressable
                key={item.key}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.accentSurface },
                ]}
                onPress={() => {
                  setVisible(false)
                  router.push(item.route as Parameters<typeof router.push>[0])
                }}
                scaleTo={0.96}
              >
                <Icon name={MENU_ICONS[item.key]} size={20} color={colors.primaryLight} />
                <Text style={[styles.menuLabel, { color: colors.text }]}>{t(lang, item.labelKey)}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    padding: Spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg + 2,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
})
