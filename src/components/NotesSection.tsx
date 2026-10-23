import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Shadow, Typography } from '../constants/theme'
import { useCareLog } from '../hooks/useCareLog'
import { useThemeColors } from '../hooks/useThemeColors'
import { t, Language } from '../i18n/translations'
import { Icon } from './Icon'

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
  const colors = useThemeColors()
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
    <View
      style={[
        styles.noteItem,
        { backgroundColor: colors.surface, borderLeftColor: colors.primaryLight },
        Shadow.cardSm,
      ]}
    >
      <Text style={[styles.noteDate, { color: colors.primaryLight }]}>{formatNoteDate(date, lang)}</Text>
      <Text style={[styles.noteText, { color: colors.text }]}>{displayed}</Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
          <Text style={[styles.expandLink, { color: colors.primaryLight }]}>
            {expanded ? t(lang, 'notes_show_less') : t(lang, 'notes_show_more')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export function NotesSection({ plantId, lang }: Props) {
  const { addAction, actions } = useCareLog()
  const colors = useThemeColors()
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
        <Text style={[styles.title, { color: colors.primary }]}>{t(lang, 'notes_title')}</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          accessibilityLabel={t(lang, 'notes_add')}
        >
          <Icon name="add" size={20} color={colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSubtle }]}>{t(lang, 'notes_empty')}</Text>
      ) : (
        notes.map((note) => <NoteItem key={note.id} text={note.note ?? ''} date={note.timestamp} lang={lang} />)
      )}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sheetTitle, { color: colors.primary }]}>{t(lang, 'notes_add')}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.background, color: colors.text },
              ]}
              placeholder={t(lang, 'notes_placeholder')}
              placeholderTextColor={colors.textSubtle}
              multiline
              numberOfLines={5}
              value={draft}
              onChangeText={setDraft}
              autoFocus
              textAlignVertical="top"
            />
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
                onPress={handleClose}
              >
                <Text style={[styles.btnSecondaryText, { color: colors.primaryMid }]}>{t(lang, 'cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                <Text style={[styles.btnPrimaryText, { color: colors.textOnPrimary }]}>{t(lang, 'notes_save')}</Text>
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
  title: { ...Typography.sectionTitle },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { fontSize: 14, fontStyle: 'italic', paddingVertical: 8 },
  noteItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  noteDate: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  noteText: { fontSize: 14, lineHeight: 20 },
  expandLink: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  sheetTitle: { ...Typography.title, marginBottom: 12 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 110,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 999, alignItems: 'center' },
  btnSecondary: { borderWidth: 1.5 },
  btnPrimaryText: { fontSize: 15, fontWeight: '600' },
  btnSecondaryText: { fontSize: 15 },
})
