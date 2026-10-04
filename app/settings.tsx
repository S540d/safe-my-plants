import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { AnimatedPressable } from '../src/components/AnimatedPressable'
import { Shadow, Typography } from '../src/constants/theme'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import {
  cancelAll,
  getReminderSettings,
  requestNotificationPermission,
  ReminderSettings,
  saveReminderSettings,
  scheduleDaily,
} from '../src/hooks/useNotificationScheduler'
import { exportData, importData } from '../src/services/exportImport'
import { t } from '../src/i18n/translations'

type ThemeMode = 'light' | 'dark' | 'system'

export default function SettingsScreen() {
  const { language, theme, setLanguage, setTheme } = usePreferences()
  const colors = useThemeColors()
  const router = useRouter()
  const canGoBack = router.canGoBack()

  const lang = language

  const [reminder, setReminder] = useState<ReminderSettings>({ enabled: false, time: '09:00' })

  useEffect(() => {
    getReminderSettings().then(setReminder)
  }, [])

  const applyReminder = async (updated: ReminderSettings) => {
    setReminder(updated)
    await saveReminderSettings(updated)
    if (updated.enabled) {
      const [h, m] = updated.time.split(':').map(Number)
      await scheduleDaily(h, m, lang)
    } else {
      await cancelAll()
    }
  }

  const handleToggleReminder = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission()
      if (!granted) {
        Alert.alert('', t(lang, 'settings_notifications_permission_denied'))
        return
      }
    }
    await applyReminder({ ...reminder, enabled: value })
    if (value) Alert.alert('', t(lang, 'settings_notifications_saved'))
  }

  const adjustTime = async (deltaHour: number, deltaMinute: number) => {
    const [h, m] = reminder.time.split(':').map(Number)
    const totalMinutes = h * 60 + m + deltaHour * 60 + deltaMinute
    const wrapped = ((totalMinutes % 1440) + 1440) % 1440
    const newH = Math.floor(wrapped / 60)
    const newM = wrapped % 60
    const newTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
    const updated = { ...reminder, time: newTime }
    setReminder(updated)
    await saveReminderSettings(updated)
    if (reminder.enabled) {
      await scheduleDaily(newH, newM, lang)
    }
  }

  const handleExport = async () => {
    try {
      await exportData()
    } catch (e) {
      if ((e as Error).message !== 'cancelled') {
        Alert.alert('', lang === 'de' ? 'Export fehlgeschlagen.' : 'Export failed.')
      }
    }
  }

  const handleImport = () => {
    Alert.alert(lang === 'de' ? 'Daten importieren' : 'Import data', t(lang, 'settings_import_confirm'), [
      { text: t(lang, 'cancel'), style: 'cancel' },
      {
        text: lang === 'de' ? 'Importieren' : 'Import',
        onPress: async () => {
          try {
            const { imported, skipped } = await importData()
            const lines = [t(lang, 'settings_import_success', { n: imported })]
            if (skipped > 0) lines.push(t(lang, 'settings_import_skipped', { n: skipped }))
            Alert.alert('', lines.join('\n'))
          } catch (e) {
            const msg = (e as Error).message
            if (msg === 'unsupported_version') {
              Alert.alert('', t(lang, 'settings_import_error_version'))
            } else if (msg !== 'cancelled') {
              Alert.alert('', t(lang, 'settings_import_error'))
            }
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
        <View style={styles.headerRow}>
          {canGoBack && (
            <AnimatedPressable onPress={() => router.back()} style={styles.backBtn} scaleTo={0.9}>
              <Text style={[styles.backBtnText, { color: colors.gradientText }]}>
                ← {lang === 'de' ? 'Zurück' : 'Back'}
              </Text>
            </AnimatedPressable>
          )}
          <Text style={styles.headerTitle}>{lang === 'de' ? 'Einstellungen' : 'Settings'}</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Language */}
        <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
          {lang === 'de' ? 'Sprache' : 'Language'}
        </Text>
        <View style={styles.chipRow}>
          <Chip label="Deutsch" active={language === 'de'} onPress={() => setLanguage('de')} colors={colors} />
          <Chip label="English" active={language === 'en'} onPress={() => setLanguage('en')} colors={colors} />
        </View>

        {/* Theme */}
        <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
          {lang === 'de' ? 'Erscheinungsbild' : 'Appearance'}
        </Text>
        <View style={styles.chipRow}>
          <Chip
            label={lang === 'de' ? 'Hell' : 'Light'}
            active={theme === 'light'}
            onPress={() => setTheme('light')}
            colors={colors}
          />
          <Chip
            label={lang === 'de' ? 'Dunkel' : 'Dark'}
            active={theme === 'dark'}
            onPress={() => setTheme('dark')}
            colors={colors}
          />
          <Chip label="System" active={theme === 'system'} onPress={() => setTheme('system')} colors={colors} />
        </View>

        {/* Notifications */}
        <View style={styles.sectionLabelRow}>
          <Text style={[styles.sectionLabel, { color: colors.primaryLight, marginTop: 0, marginBottom: 0 }]}>
            {t(lang, 'settings_notifications')}
          </Text>
          <View style={[styles.betaBadge, { backgroundColor: colors.statusSoon }]}>
            <Text style={[styles.betaBadgeText, { color: colors.textOnPrimary }]}>Beta</Text>
          </View>
        </View>
        <View style={[styles.notifCard, { backgroundColor: colors.surface }, Shadow.cardSm]}>
          <View style={styles.notifRow}>
            <Text style={[styles.notifLabel, { color: colors.primary }]}>
              {t(lang, 'settings_notifications_enable')}
            </Text>
            <Switch
              value={reminder.enabled}
              onValueChange={handleToggleReminder}
              trackColor={{ true: colors.primaryMid, false: colors.border }}
              thumbColor={colors.surface}
            />
          </View>
          {reminder.enabled && (
            <View style={[styles.notifRow, { marginTop: 12 }]}>
              <Text style={[styles.notifLabel, { color: colors.primary }]}>
                {t(lang, 'settings_notifications_time')}
              </Text>
              <View style={styles.timePicker}>
                <AnimatedPressable
                  style={[styles.timeBtn, { backgroundColor: colors.accentSurface }]}
                  onPress={() => adjustTime(-1, 0)}
                >
                  <Text style={[styles.timeBtnText, { color: colors.primaryMid }]}>−</Text>
                </AnimatedPressable>
                <Text style={[styles.timeDisplay, { color: colors.primary }]}>{reminder.time.split(':')[0]}</Text>
                <AnimatedPressable
                  style={[styles.timeBtn, { backgroundColor: colors.accentSurface }]}
                  onPress={() => adjustTime(1, 0)}
                >
                  <Text style={[styles.timeBtnText, { color: colors.primaryMid }]}>+</Text>
                </AnimatedPressable>
                <Text style={[styles.timeSep, { color: colors.primary }]}>:</Text>
                <AnimatedPressable
                  style={[styles.timeBtn, { backgroundColor: colors.accentSurface }]}
                  onPress={() => adjustTime(0, -15)}
                >
                  <Text style={[styles.timeBtnText, { color: colors.primaryMid }]}>−</Text>
                </AnimatedPressable>
                <Text style={[styles.timeDisplay, { color: colors.primary }]}>{reminder.time.split(':')[1]}</Text>
                <AnimatedPressable
                  style={[styles.timeBtn, { backgroundColor: colors.accentSurface }]}
                  onPress={() => adjustTime(0, 15)}
                >
                  <Text style={[styles.timeBtnText, { color: colors.primaryMid }]}>+</Text>
                </AnimatedPressable>
              </View>
            </View>
          )}
        </View>

        {/* Data */}
        <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>{t(lang, 'settings_data')}</Text>
        <View style={styles.dataRow}>
          <AnimatedPressable
            style={[styles.dataBtn, { backgroundColor: colors.primaryMid }, Shadow.cardSm]}
            onPress={handleExport}
          >
            <Text style={[styles.dataBtnText, { color: colors.textOnPrimary }]}>📤 {t(lang, 'settings_export')}</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[
              styles.dataBtn,
              { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
              Shadow.cardSm,
            ]}
            onPress={handleImport}
          >
            <Text style={[styles.dataBtnText, { color: colors.primaryMid }]}>📥 {t(lang, 'settings_import')}</Text>
          </AnimatedPressable>
        </View>

        {/* About */}
        <Text style={[styles.sectionLabel, { color: colors.primaryLight }]}>
          {lang === 'de' ? 'Über die App' : 'About'}
        </Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.surface }, Shadow.cardSm]}>
          <Text style={[styles.aboutTitle, { color: colors.primary }]}>🪴 Safe My Plants</Text>
          <Text style={[styles.aboutVersion, { color: colors.accent }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutText, { color: colors.text }]}>
            {lang === 'de'
              ? 'Verwalte deine Topfpflanzen, behalte Pflege-Termine im Blick und erkenne Krankheiten frühzeitig.'
              : 'Manage your houseplants, track care schedules, and identify diseases early.'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function Chip({
  label,
  active,
  onPress,
  colors,
}: {
  label: string
  active: boolean
  onPress: () => void
  colors: ReturnType<typeof useThemeColors>
}) {
  return (
    <AnimatedPressable
      style={[
        styles.chip,
        { borderColor: colors.border, backgroundColor: colors.surface },
        active && { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.chipText,
          { color: colors.primaryMid },
          active && { color: colors.textOnPrimary, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backBtnText: { fontSize: 15, fontWeight: '500' },
  headerTitle: { ...Typography.headerTitle, color: '#fff', flex: 1 },
  scroll: { padding: 16 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 8 },
  betaBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  betaBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 14 },
  notifCard: {
    borderRadius: 12,
    padding: 14,
  },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifLabel: { fontSize: 15, flex: 1 },
  timePicker: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnText: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  timeDisplay: { fontSize: 18, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  timeSep: { fontSize: 18, fontWeight: '700', marginHorizontal: 2 },
  dataRow: { flexDirection: 'row', gap: 10 },
  dataBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dataBtnText: { fontSize: 13, fontWeight: '600' },
  aboutCard: {
    borderRadius: 12,
    padding: 16,
  },
  aboutTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  aboutVersion: { fontSize: 13, marginBottom: 8 },
  aboutText: { fontSize: 14, lineHeight: 20 },
})
