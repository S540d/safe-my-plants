import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface Props {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
}

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSent = useRef(value)

  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value
      setLocal(value)
    }
  }, [value])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  function handleChange(text: string) {
    setLocal(text)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      lastSent.current = text
      onChangeText(text)
    }, 150)
  }

  function handleClear() {
    setLocal('')
    if (timer.current) clearTimeout(timer.current)
    lastSent.current = ''
    onChangeText('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={local}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#74C69D"
        returnKeyType="search"
        clearButtonMode="never"
      />
      {local.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  clear: { fontSize: 14, color: '#74C69D', paddingLeft: 8 },
})
