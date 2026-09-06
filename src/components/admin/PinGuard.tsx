import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { usePreferences } from '../../hooks/usePreferences'

interface PinGuardProps {
  lang: 'de' | 'en'
  adminPin: string | null
  onUnlock: () => void
}

export function PinGuard({ lang, adminPin, onUnlock }: PinGuardProps) {
  const { setAdminPin } = usePreferences()
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const isFirstTime = !adminPin

  const handleSubmit = async () => {
    if (isFirstTime) {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError(lang === 'de' ? 'PIN muss 4 Ziffern haben.' : 'PIN must be 4 digits.')
        return
      }
      if (pin !== confirm) {
        setError(lang === 'de' ? 'PINs stimmen nicht überein.' : 'PINs do not match.')
        return
      }
      await setAdminPin(pin)
      onUnlock()
    } else {
      if (pin === adminPin) {
        onUnlock()
      } else {
        setError(lang === 'de' ? 'Falsche PIN.' : 'Wrong PIN.')
        setPin('')
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔐</Text>
      <Text style={styles.title}>
        {isFirstTime
          ? lang === 'de'
            ? 'Admin-PIN festlegen'
            : 'Set Admin PIN'
          : lang === 'de'
            ? 'Admin-PIN eingeben'
            : 'Enter Admin PIN'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={lang === 'de' ? '4-stellige PIN' : '4-digit PIN'}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        value={pin}
        onChangeText={(v) => {
          setPin(v)
          setError('')
        }}
      />
      {isFirstTime && (
        <TextInput
          style={styles.input}
          placeholder={lang === 'de' ? 'PIN bestätigen' : 'Confirm PIN'}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          value={confirm}
          onChangeText={(v) => {
            setConfirm(v)
            setError('')
          }}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>{lang === 'de' ? 'Weiter' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1B4332', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 10,
    padding: 12,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    letterSpacing: 8,
  },
  error: { color: '#E63946', fontSize: 14, marginBottom: 8 },
  btn: {
    backgroundColor: '#2D6A4F',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
