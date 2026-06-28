import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useCareLog } from '../hooks/useCareLog'
import { t, Language } from '../i18n/translations'

interface Props {
  plantId: string
  lang: Language
}

function formatNoteDate(iso: string, lang: Language): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t(lang, 'today')
  if (diffDays === 1) return t(lang, 'yesterday')
  if (diffDays < 30) return t(lang, 'days_ago', { n: diffDays })
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function NoteItem({ text, date, lang }: { text: string; date: string; lang: Language }) {
  const [expanded, setExpanded] = useState(false)
  const lines = text.split('\n')
  // isLong: either too many chars OR too many lines
  const isLong = text.length > 180 || lines.length > 3

  const displayed =
    !isLong || expanded
      ? text
      : lines.length > 3
        ? lines.slice(0, 3).join('\n').trimEnd() + '…'
        : text.slice(0, 180).trimEnd() + '…'

  return (
    <View style={styles.noteItem}>
      <Text style={styles.noteDate}>{formatNoteDate(date, lang)}</Text>
      <Text style={styles.noteText}>{displayed}</Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
          <Text style={styles.expandLink}>{expanded ? t(lang, 'notes_show_less') : t(lang, 'notes_show_more')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export function NotesSection({ plantId, lang }: Props) {
  const { addAction, actions } = useCareLog()
  const [modalVisible, setModalVisible] = useState(false)
  const [draft, setDraft] = useState('')

  // Filter notes from the full actions list to avoid the slice-before-filter bug
  const notes = actions
    .filter((a) => a.plantId === plantId && a.type === 'note')
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)

  const handleSave = async () => {
    const text = draft.trim()
    if (!text) return
    await addAction({ plantId, type: 'note', note: text })
    setDraft('')
    setModalVisible(false)
  }

  const handleClose = () => {
    setDraft('')
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t(lang, 'notes_title')}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          accessibilityLabel={t(lang, 'notes_add')}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <Text style={styles.empty}>{t(lang, 'notes_empty')}</Text>
      ) : (
        notes.map((note) => <NoteItem key={note.id} text={note.note ?? ''} date={note.timestamp} lang={lang} />)
      )}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{t(lang, 'notes_add')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t(lang, 'notes_placeholder')}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              value={draft}
              onChangeText={setDraft}
              autoFocus
              textAlignVertical="top"
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleClose}>
                <Text style={styles.btnSecondaryText}>{t(lang, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
                <Text style={styles.btnPrimaryText}>{t(lang, 'notes_save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginTop: 8, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#1B4332' },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#52B788',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 20, lineHeight: 22, fontWeight: '600' },
  empty: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic', paddingVertical: 8 },
  noteItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#52B788',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  noteDate: { fontSize: 11, color: '#74C69D', fontWeight: '600', marginBottom: 4 },
  noteText: { fontSize: 14, color: '#333', lineHeight: 20 },
  expandLink: { fontSize: 12, color: '#52B788', marginTop: 4, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: '#1B4332', marginBottom: 12 },
  input: {
    borderWidth: 1.5,
    borderColor: '#B7E4C7',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 110,
    backgroundColor: '#F0FFF4',
    color: '#1A1A1A',
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2D6A4F' },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#B7E4C7' },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnSecondaryText: { color: '#2D6A4F', fontSize: 15 },
})
