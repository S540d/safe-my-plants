import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { CareAction } from '../types/careLog'
import { Plant } from '../types/plant'
import { getCareLog, getPlants, saveCareLog, savePlants } from './storage'

const SCHEMA_VERSION = 2

interface BackupPayload {
  smpSchemaVersion: number
  exportedAt: string
  plants: Plant[]
  careLog: CareAction[]
}

export async function exportData(): Promise<void> {
  const plants = await getPlants()
  const careLog = await getCareLog()

  const payload: BackupPayload = {
    smpSchemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    plants,
    careLog,
  }

  const date = new Date().toISOString().slice(0, 10)
  const path = `${FileSystem.cacheDirectory}safe-my-plants-backup-${date}.json`
  await FileSystem.writeAsStringAsync(path, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  })

  await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Safe My Plants Backup' })
}

export interface ImportResult {
  imported: number
  skipped: number
}

export async function importData(): Promise<ImportResult> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  })

  if (result.canceled || !result.assets?.[0]) {
    throw new Error('cancelled')
  }

  const fileUri = result.assets[0].uri
  const raw = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  let payload: BackupPayload
  try {
    payload = JSON.parse(raw) as BackupPayload
  } catch {
    throw new Error('invalid_json')
  }

  if (!payload.plants || !Array.isArray(payload.plants)) {
    throw new Error('invalid_format')
  }

  const existingPlants = await getPlants()
  const existingIds = new Set(existingPlants.map((p) => p.id))

  const newPlants = payload.plants.filter((p) => !existingIds.has(p.id))
  const skipped = payload.plants.length - newPlants.length

  await savePlants([...existingPlants, ...newPlants])

  if (Array.isArray(payload.careLog) && payload.careLog.length > 0) {
    const existingLog = await getCareLog()
    const existingLogIds = new Set(existingLog.map((a) => a.id))
    const newActions = payload.careLog.filter((a) => !existingLogIds.has(a.id))
    if (newActions.length > 0) {
      await saveCareLog([...newActions, ...existingLog])
    }
  }

  return { imported: newPlants.length, skipped }
}
