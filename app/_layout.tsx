import AsyncStorage from '@react-native-async-storage/async-storage'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { PlantProvider } from '../src/contexts/PlantContext'

const ONBOARDED_KEY = 'smp-onboarded'

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
      <Stack.Screen name="admin" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="plant/[id]" />
      <Stack.Screen name="onboarding" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <PlantProvider>
      <StatusBar style="light" />
      <AppStack />
    </PlantProvider>
  )
}
