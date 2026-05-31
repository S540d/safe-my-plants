import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { usePreferences } from '../src/hooks/usePreferences'

type ThemeMode = 'light' | 'dark' | 'system'

export default function SettingsScreen() {
  const { language, theme, adminPin, setLanguage, setTheme, setAdminPin } = usePreferences()
  const router = useRouter()
  const [showPinChange, setShowPinChange] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const lang = language

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
          <Text style={styles.listItemText}>{lang === 'de' ? 'Admin-PIN' : 'Admin PIN'} {adminPin ? '✓' : '(nicht gesetzt)'}</Text>
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
    fontSize: 12, fontWeight: '700', color: '#52B788',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginTop: 20, marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#B7E4C7',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  chipText: { fontSize: 14, color: '#2D6A4F' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  listItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  listItemText: { flex: 1, fontSize: 15, color: '#1B4332' },
  chevron: { fontSize: 20, color: '#74C69D' },
  pinForm: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginTop: 8, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  pinInput: {
    borderWidth: 1.5, borderColor: '#B7E4C7', borderRadius: 8,
    padding: 10, fontSize: 16, backgroundColor: '#F0FFF4',
  },
  saveBtn: {
    backgroundColor: '#2D6A4F', borderRadius: 8,
    padding: 12, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  aboutCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  aboutTitle: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 4 },
  aboutVersion: { fontSize: 13, color: '#74C69D', marginBottom: 8 },
  aboutText: { fontSize: 14, color: '#444', lineHeight: 20 },
})
