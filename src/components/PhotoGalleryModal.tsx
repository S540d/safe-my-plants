import React, { useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { PlantPhoto } from '../types/plant'

interface Props {
  photos: PlantPhoto[]
  initialIndex?: number
  visible: boolean
  onClose: () => void
  lang: string
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

function formatMonth(iso: string, lang: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

export function PhotoGalleryModal({ photos, initialIndex = 0, visible, onClose, lang }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const flatListRef = useRef<FlatList<PlantPhoto>>(null)

  const showCompare = photos.length >= 2
  const [compareMode, setCompareMode] = useState(false)

  const handleViewableChange = ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    const idx = viewableItems[0]?.index
    if (idx != null) setCurrentIndex(idx)
  }

  return (
    <Modal visible={visible} transparent={false} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {photos.length}
          </Text>
          {showCompare && (
            <TouchableOpacity
              style={[styles.compareBtn, compareMode && styles.compareBtnActive]}
              onPress={() => setCompareMode((v) => !v)}
            >
              <Text style={[styles.compareBtnText, compareMode && styles.compareBtnTextActive]}>
                {lang === 'de' ? 'Vergleich' : 'Compare'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {compareMode && showCompare ? (
          // Side-by-side compare: first vs latest
          <View style={styles.compareContainer}>
            <View style={styles.compareItem}>
              <Image source={{ uri: photos[0].uri }} style={styles.compareImage} resizeMode="cover" />
              <Text style={styles.compareLabel}>
                {lang === 'de' ? 'Erstes Foto' : 'First photo'}
              </Text>
              <Text style={styles.compareDate}>{formatMonth(photos[0].takenAt, lang)}</Text>
            </View>
            <View style={styles.compareDivider} />
            <View style={styles.compareItem}>
              <Image source={{ uri: photos[photos.length - 1].uri }} style={styles.compareImage} resizeMode="cover" />
              <Text style={styles.compareLabel}>
                {lang === 'de' ? 'Neuestes Foto' : 'Latest photo'}
              </Text>
              <Text style={styles.compareDate}>{formatMonth(photos[photos.length - 1].takenAt, lang)}</Text>
            </View>
          </View>
        ) : (
          // Swipe gallery
          <>
            <FlatList
              ref={flatListRef}
              data={photos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
              onViewableItemsChanged={handleViewableChange}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              keyExtractor={(item, index) => `${item.uri}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image source={{ uri: item.uri }} style={styles.image} resizeMode="contain" />
                </View>
              )}
            />
            {/* Date overlay */}
            <View style={styles.dateOverlay}>
              <Text style={styles.dateText}>{formatMonth(photos[currentIndex]?.takenAt ?? '', lang)}</Text>
            </View>
            {/* Pagination dots */}
            {photos.length > 1 && (
              <View style={styles.dots}>
                {photos.map((_, i) => (
                  <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    gap: 8,
  },
  counter: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
  compareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#52B788',
  },
  compareBtnActive: { backgroundColor: '#52B788' },
  compareBtnText: { color: '#52B788', fontSize: 13, fontWeight: '600' },
  compareBtnTextActive: { color: '#000' },
  closeBtn: { padding: 8 },
  closeBtnText: { color: '#fff', fontSize: 22 },
  slide: { width: SCREEN_WIDTH, flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: SCREEN_WIDTH, height: '100%' },
  dateOverlay: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  dots: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: { backgroundColor: '#fff', width: 18 },
  compareContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    gap: 4,
  },
  compareItem: { flex: 1, alignItems: 'center' },
  compareImage: { flex: 1, width: '100%', borderRadius: 8 },
  compareDivider: { width: 1, backgroundColor: '#333' },
  compareLabel: { color: '#52B788', fontSize: 12, fontWeight: '600', marginTop: 8 },
  compareDate: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
})
