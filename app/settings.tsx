import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { usePreferences } from '../src/hooks/usePreferences'
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
  const { language, theme, adminPin, setLanguage, setTheme, setAdminPin } = usePreferences()
  const router = useRouter()
  const [showPinChange, setShowPinChange] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

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
            if (msg !== 'cancelled') {
              Alert.alert('', t(lang, 'settings_import_error'))
            }
          }
        },
      },
    ])
  }

  const handleSavePin = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      Alert.alert('', lang === 'de' ? 'PIN muss 4 Ziffern haben.' : 'PIN must be 4 digits.')
      return
    }
    if (newPin !== confirmPin) {
      Alert.alert('', lang === 'de' ? 'PINs stimmen nicht überein.' : 'PINs do not match.')
      return
    }
    await setAdminPin(newPin)
    setNewPin('')
    setConfirmPin('')
    setShowPinChange(false)
    Alert.alert('', lang === 'de' ? 'PIN gespeichert.' : 'PIN saved.')
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1B4332', '#2D6A4F']} style={styles.header}>
        <Text style={styles.headerTitle}>{lang === 'de' ? 'Einstellungen' : 'Settings'}</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Language */}
        <Text style={styles.sectionLabel}>{lang === 'de' ? 'Sprache' : 'Language'}</Text>
        <View style={styles.chipRow}>
          <Chip label="Deutsch" active={language === 'de'} onPress={() => setLanguage('de')} />
          <Chip label="English" active={language === 'en'} onPress={() => setLanguage('en')} />
        </View>

        {/* Theme */}
        <Text style={styles.sectionLabel}>{lang === 'de' ? 'Erscheinungsbild' : 'Appearance'}</Text>
        <View style={styles.chipRow}>
          <Chip label={lang === 'de' ? 'Hell' : 'Light'} active={theme === 'light'} onPress={() => setTheme('light')} />
          <Chip label={lang === 'de' ? 'Dunkel' : 'Dark'} active={theme === 'dark'} onPress={() => setTheme('dark')} />
          <Chip label="System" active={theme === 'system'} onPress={() => setTheme('system')} />
        </View>

        {/* Admin */}
        <Text style={styles.sectionLabel}>{lang === 'de' ? 'Admin-Bereich' : 'Admin Area'}</Text>
        <TouchableOpacity style={styles.listItem} onPress={() => setShowPinChange(!showPinChange)}>
          <Text style={styles.listItemText}>
            {lang === 'de' ? 'Admin-PIN' : 'Admin PIN'} {adminPin ? '✓' : '(nicht gesetzt)'}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {showPinChange && (
          <View style={styles.pinForm}>
            <TextInput
              style={styles.pinInput}
              placeholder={lang === 'de' ? 'Neue PIN (4 Ziffern)' : 'New PIN (4 digits)'}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={newPin}
              onChangeText={setNewPin}
            />
            <TextInput
              style={styles.pinInput}
              placeholder={lang === 'de' ? 'PIN bestätigen' : 'Confirm PIN'}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={confirmPin}
              onChangeText={setConfirmPin}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePin}>
              <Text style={styles.saveBtnText}>{lang === 'de' ? 'Speichern' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications */}
        <Text style={styles.sectionLabel}>{t(lang, 'settings_notifications')}</Text>
        <View style={styles.notifCard}>
          <View style={styles.notifRow}>
            <Text style={styles.notifLabel}>{t(lang, 'settings_notifications_enable')}</Text>
            <Switch
              value={reminder.enabled}
              onValueChange={handleToggleReminder}
              trackColor={{ true: '#2D6A4F', false: '#B7E4C7' }}
              thumbColor="#fff"
            />
          </View>
          {reminder.enabled && (
            <View style={[styles.notifRow, { marginTop: 12 }]}>
              <Text style={styles.notifLabel}>{t(lang, 'settings_notifications_time')}</Text>
              <View style={styles.timePicker}>
                <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(-1, 0)}>
                  <Text style={styles.timeBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeDisplay}>{reminder.time.split(':')[0]}</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(1, 0)}>
                  <Text style={styles.timeBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.timeSep}>:</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(0, -15)}>
                  <Text style={styles.timeBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.timeDisplay}>{reminder.time.split(':')[1]}</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => adjustTime(0, 15)}>
                  <Text style={styles.timeBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Data */}
        <Text style={styles.sectionLabel}>{t(lang, 'settings_data')}</Text>
        <View style={styles.dataRow}>
          <TouchableOpacity style={[styles.dataBtn, styles.dataBtnExport]} onPress={handleExport}>
            <Text style={[styles.dataBtnText, { color: '#fff' }]}>📤 {t(lang, 'settings_export')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dataBtn, styles.dataBtnImport]} onPress={handleImport}>
            <Text style={[styles.dataBtnText, { color: '#2D6A4F' }]}>📥 {t(lang, 'settings_import')}</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>{lang === 'de' ? 'Über die App' : 'About'}</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>🪴 Safe My Plants</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutText}>
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

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  scroll: { padding: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52B788',
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
    borderColor: '#B7E4C7',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  chipText: { fontSize: 14, color: '#2D6A4F' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  listItem: {
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
  listItemText: { flex: 1, fontSize: 15, color: '#1B4332' },
  chevron: { fontSize: 20, color: '#74C69D' },
  pinForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pinInput: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F0FFF4',
  },
  saveBtn: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  notifRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifLabel: { fontSize: 15, color: '#1B4332', flex: 1 },
  timePicker: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D8F3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnText: { fontSize: 16, color: '#2D6A4F', fontWeight: '700', lineHeight: 20 },
  timeDisplay: { fontSize: 18, fontWeight: '700', color: '#1B4332', minWidth: 28, textAlign: 'center' },
  timeSep: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginHorizontal: 2 },
  dataRow: { flexDirection: 'row', gap: 10 },
  dataBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dataBtnExport: { backgroundColor: '#2D6A4F' },
  dataBtnImport: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#B7E4C7' },
  dataBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutTitle: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 4 },
  aboutVersion: { fontSize: 13, color: '#74C69D', marginBottom: 8 },
  aboutText: { fontSize: 14, color: '#444', lineHeight: 20 },
})
