import AsyncStorage from '@react-native-async-storage/async-storage'
import { Tabs, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { PlantProvider } from '../src/contexts/PlantContext'
import { useOverdueCount } from '../src/hooks/useOverdueCount'

const ONBOARDED_KEY = 'smp-onboarded'

function AppTabs() {
  const { overdue } = useOverdueCount()
  const router = useRouter()

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      if (!value) {
        router.replace('/onboarding')
      }
    })
  }, [router])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: '#74C69D',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#D8F3DC',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pflanzen',
          tabBarIcon: () => <TabIcon emoji="🪴" />,
          tabBarBadge: overdue > 0 ? overdue : undefined,
          tabBarBadgeStyle: { backgroundColor: '#E63946' },
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: () => <TabIcon emoji="⚙️" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Einstellungen',
          tabBarIcon: () => <TabIcon emoji="🔧" />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistiken',
          tabBarIcon: () => <TabIcon emoji="📊" />,
        }}
      />
      <Tabs.Screen
        name="plant/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}

export default function RootLayout() {
  return (
    <PlantProvider>
      <StatusBar style="light" />
      <AppTabs />
    </PlantProvider>
  )
}

function TabIcon({ emoji }: { emoji: string; color?: unknown }) {
  const { Text } = require('react-native')
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>
}
