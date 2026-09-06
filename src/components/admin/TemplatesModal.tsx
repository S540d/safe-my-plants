import React, { useState } from 'react'
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PLANT_TEMPLATES, PlantTemplate } from '../../constants/plantTemplates'

interface TemplatesModalProps {
  lang: 'de' | 'en'
  visible: boolean
  onSelect: (template: PlantTemplate) => void
  onClose: () => void
}

export function TemplatesModal({ lang, visible, onSelect, onClose }: TemplatesModalProps) {
  const [query, setQuery] = useState('')
  const filtered = PLANT_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      (t.scientificName ?? '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{lang === 'de' ? 'Vorlage wählen' : 'Choose template'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder={lang === 'de' ? 'Vorlage suchen …' : 'Search templates …'}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
              <View style={styles.rowContent}>
                <Text style={styles.rowName}>{item.name}</Text>
                {item.scientificName ? <Text style={styles.rowScientific}>{item.scientificName}</Text> : null}
                <Text style={styles.rowMeta}>
                  💧 {item.careInfo.wateringFrequencyDays}d · 🌿 {item.careInfo.fertilizingFrequencyDays}d
                </Text>
              </View>
              <Text style={styles.rowArrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D8F3DC',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1B4332' },
  closeBtn: { padding: 6 },
  closeBtnText: { fontSize: 20, color: '#74C69D' },
  searchInput: {
    margin: 12,
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#1A1A1A',
  },
  list: { padding: 12, gap: 8 },
  row: {
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
  rowContent: { flex: 1 },
  rowName: { fontSize: 16, fontWeight: '600', color: '#1B4332' },
  rowScientific: { fontSize: 12, color: '#74C69D', fontStyle: 'italic', marginTop: 1 },
  rowMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  rowArrow: { fontSize: 18, color: '#52B788', marginLeft: 8 },
})
