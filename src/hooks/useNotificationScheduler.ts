import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { Language, t } from '../i18n/translations'

const REMINDER_KEY = 'smp-reminders'
const NOTIFICATION_CHANNEL_ID = 'safe-my-plants-care'

export interface ReminderSettings {
  enabled: boolean
  time: string // 'HH:mm'
}

const DEFAULT_SETTINGS: ReminderSettings = { enabled: false, time: '09:00' }

function isValidSettings(obj: unknown): obj is ReminderSettings {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as ReminderSettings).enabled === 'boolean' &&
    typeof (obj as ReminderSettings).time === 'string' &&
    /^\d{2}:\d{2}$/.test((obj as ReminderSettings).time)
  )
}

export async function getReminderSettings(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isValidSettings(parsed)) return parsed
    }
    return DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings))
}

async function ensureChannel(lang: Language): Promise<void> {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: t(lang, 'notification_channel_name'),
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleDaily(hour: number, minute: number, lang: Language): Promise<void> {
  await cancelAll()
  await ensureChannel(lang)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🪴 Safe My Plants',
      body: t(lang, 'notification_body'),
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
