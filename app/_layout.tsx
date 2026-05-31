import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { PlantProvider } from '../src/contexts/PlantContext'

export default function RootLayout() {
  return (
    <PlantProvider>
      <StatusBar style="light" />
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
            tabBarIcon: ({ color }) => <TabIcon emoji="🪴" color={color} />,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Einstellungen',
            tabBarIcon: ({ color }) => <TabIcon emoji="🔧" color={color} />,
          }}
        />
        <Tabs.Screen
          name="plant/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </PlantProvider>
  )
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native')
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>
}
