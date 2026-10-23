import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold'
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces/700Bold'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { PlantProvider } from '../src/contexts/PlantContext'

const ONBOARDED_KEY = 'smp-onboarded'

SplashScreen.preventAutoHideAsync().catch(() => {})

function AppStack() {
  const router = useRouter()

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      if (!value) {
        router.replace('/onboarding')
      }
    })
  }, [router])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-plant" />
      <Stack.Screen name="manage-plants" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="symptom-guide" />
      <Stack.Screen name="plant/[id]" />
      <Stack.Screen name="onboarding" />
    </Stack>
  )
}

export default function RootLayout() {
  // Display-Schrift (Fraunces) lokal gebündelt; bei Ladefehler greift die Systemschrift.
  const [fontsLoaded, fontError] = useFonts({ Fraunces_600SemiBold, Fraunces_700Bold })
  const fontsReady = fontsLoaded || !!fontError

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => {})
  }, [fontsReady])

  if (!fontsReady) return null

  return (
    <PlantProvider>
      <StatusBar style="light" />
      <AppStack />
    </PlantProvider>
  )
}
