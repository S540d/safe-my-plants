import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { AnimatedPressable } from '../src/components/AnimatedPressable'
import { Radius, Shadow, Spacing } from '../src/constants/theme'
import { SYMPTOM_GUIDE } from '../src/constants/symptomGuide'
import { usePreferences } from '../src/hooks/usePreferences'
import { useThemeColors } from '../src/hooks/useThemeColors'
import { t } from '../src/i18n/translations'

export default function SymptomGuideScreen() {
  const { language } = usePreferences()
  const colors = useThemeColors()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.primary }]}>{t(language, 'symptom_guide_title')}</Text>
        <Text style={[styles.intro, { color: colors.textMuted }]}>{t(language, 'symptom_guide_intro')}</Text>

        {SYMPTOM_GUIDE.map((symptom) => {
          const open = openId === symptom.id
          return (
            <View key={symptom.id} style={[styles.card, { backgroundColor: colors.surface }, Shadow.cardSm]}>
              <AnimatedPressable
                style={styles.cardHeader}
                onPress={() => setOpenId(open ? null : symptom.id)}
                scaleTo={0.98}
              >
                <Text style={styles.icon}>{symptom.icon}</Text>
                <Text style={[styles.symptomTitle, { color: colors.primary }]}>{symptom.title[language]}</Text>
                <Text style={[styles.chevron, { color: colors.accent }]}>{open ? '⌃' : '⌄'}</Text>
              </AnimatedPressable>

              {open &&
                symptom.causes.map((cause, index) => (
                  <View key={cause.id} style={[styles.cause, { borderTopColor: colors.accentSurface }]}>
                    <Text style={[styles.causeTitle, { color: colors.primary }]}>
                      {index + 1}. {cause.title[language]}
                    </Text>
                    <Text style={[styles.label, { color: colors.primaryMid }]}>
                      {t(language, 'symptom_guide_check')}
                    </Text>
                    <Text style={[styles.body, { color: colors.text }]}>{cause.check[language]}</Text>
                    <Text style={[styles.label, { color: colors.primaryMid }]}>{t(language, 'symptom_guide_fix')}</Text>
                    <Text style={[styles.body, { color: colors.text }]}>{cause.fix[language]}</Text>
                  </View>
                ))}
            </View>
          )
        })}

        <Text style={[styles.disclaimer, { color: colors.textSubtle }]}>{t(language, 'symptom_guide_disclaimer')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.sm },
  intro: { fontSize: 14, lineHeight: 20, marginBottom: Spacing.lg },
  card: { borderRadius: Radius.lg, marginBottom: Spacing.md, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  icon: { fontSize: 24 },
  symptomTitle: { flex: 1, fontSize: 16, fontWeight: '600' },
  chevron: { fontSize: 20 },
  cause: { borderTopWidth: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: 4 },
  causeTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: Spacing.xs },
  body: { fontSize: 14, lineHeight: 20 },
  disclaimer: { fontSize: 12, lineHeight: 17, marginTop: Spacing.md, textAlign: 'center' },
})
