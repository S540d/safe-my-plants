import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Icon, IconName } from '../src/components/Icon'
import { brandHeader, brandPalette } from '../src/constants/brandPalette'
import { Typography } from '../src/constants/theme'
import { usePreferences } from '../src/hooks/usePreferences'
import { t } from '../src/i18n/translations'

// Onboarding nutzt bewusst immer die dunkle Markenfläche (wie der Header).
const BG = brandHeader.light.background
const ON_BG = brandHeader.light.title
const ON_BG_MUTED = brandHeader.light.subtitle
const STATUS_DOTS = [brandPalette.dark.statusOk, brandPalette.dark.statusSoon, brandPalette.dark.statusOverdue]

const ONBOARDED_KEY = 'smp-onboarded'
const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface Slide {
  /** `traffic` = Ampel-Illustration aus den drei Statusfarben. */
  icon: IconName | 'traffic'
  titleKey: 'onboarding_slide1_title' | 'onboarding_slide2_title' | 'onboarding_slide3_title'
  bodyKey: 'onboarding_slide1_body' | 'onboarding_slide2_body' | 'onboarding_slide3_body'
}

const SLIDES: Slide[] = [
  {
    icon: 'plants',
    titleKey: 'onboarding_slide1_title',
    bodyKey: 'onboarding_slide1_body',
  },
  {
    icon: 'traffic',
    titleKey: 'onboarding_slide2_title',
    bodyKey: 'onboarding_slide2_body',
  },
  {
    icon: 'water',
    titleKey: 'onboarding_slide3_title',
    bodyKey: 'onboarding_slide3_body',
  },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const { language } = usePreferences()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<Slide>>(null)

  async function completeOnboarding() {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true')
    router.replace('/')
  }

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
      setCurrentIndex(nextIndex)
    } else {
      completeOnboarding()
    }
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / SCREEN_WIDTH)
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index)
    }
  }

  const isLastSlide = currentIndex === SLIDES.length - 1

  return (
    <View style={[styles.container, { backgroundColor: BG }]}>
      {/* Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton}>
          <Text style={styles.skipText}>{t(language, 'onboarding_skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.titleKey}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustration}>
              {item.icon === 'traffic' ? (
                <View style={styles.trafficRow}>
                  {STATUS_DOTS.map((color) => (
                    <View key={color} style={[styles.trafficDot, { backgroundColor: color }]} />
                  ))}
                </View>
              ) : (
                <Icon name={item.icon} size={64} color={ON_BG} />
              )}
            </View>
            <Text style={styles.title}>{t(language, item.titleKey)}</Text>
            <Text style={styles.body}>{t(language, item.bodyKey)}</Text>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View key={index} style={[styles.dot, index === currentIndex ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      {/* Next / Finish button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {isLastSlide ? t(language, 'onboarding_finish') : t(language, 'onboarding_next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: ON_BG_MUTED,
    fontSize: 15,
    fontWeight: '500',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  trafficRow: { flexDirection: 'row', gap: 12 },
  trafficDot: { width: 28, height: 28, borderRadius: 14 },
  title: {
    ...Typography.headerTitle,
    color: ON_BG,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  body: {
    fontSize: 17,
    color: ON_BG_MUTED,
    textAlign: 'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: ON_BG,
    width: 24,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  nextButton: {
    backgroundColor: ON_BG,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
    color: BG,
    fontSize: 17,
    fontWeight: '700',
  },
})
