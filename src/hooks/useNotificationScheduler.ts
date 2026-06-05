import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { Language, t } from '../i18n/translations'
import { ReminderSettings, getReminderSettings, saveReminderSettings } from '../services/storage'

export type { ReminderSettings }
export { getReminderSettings, saveReminderSettings }

const NOTIFICATION_CHANNEL_ID = 'safe-my-plants-care'

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
