import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const REMINDER_KEY = 'smp-reminders'
const NOTIFICATION_CHANNEL_ID = 'safe-my-plants-care'

export interface ReminderSettings {
  enabled: boolean
  time: string // 'HH:mm'
}

const DEFAULT_SETTINGS: ReminderSettings = { enabled: false, time: '09:00' }

export async function getReminderSettings(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY)
    return raw ? (JSON.parse(raw) as ReminderSettings) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings))
}

async function ensureChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Pflege-Erinnerungen',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleDaily(hour: number, minute: number): Promise<void> {
  await cancelAll()
  await ensureChannel()

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🪴 Safe My Plants',
      body: 'Schau nach deinen Pflanzen – vielleicht braucht eine heute Pflege!',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}
