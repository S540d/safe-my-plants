import { getCareStatus } from '../hooks/useCareStatus'
import { Plant } from '../types/plant'
import { filterAndSortPlants } from './plantFilter'

export interface HomeSection {
  /** `due` = „Heute dran", `room` = Raum (oder „Ohne Raum"). */
  kind: 'due' | 'room'
  title: string
  data: Plant[]
}

interface Labels {
  dueTitle: string
  noRoomTitle: string
  locale: string
}

/**
 * Startseite: oben die Pflanzen, die jetzt Pflege brauchen (Gießen oder Düngen überfällig,
 * dringendste zuerst), darunter alle übrigen nach Raum. Jede Pflanze steht in genau einer Sektion.
 */
export function buildHomeSections(plants: Plant[], { dueTitle, noRoomTitle, locale }: Labels): HomeSection[] {
  const due = filterAndSortPlants(
    plants.filter((p) => getCareStatus(p).overall === 'overdue'),
    { query: '', locations: [], statuses: [], sort: 'nextCare' }
  )
  const dueIds = new Set(due.map((p) => p.id))

  const rooms = new Map<string, Plant[]>()
  const noRoom: Plant[] = []
  for (const plant of plants) {
    if (dueIds.has(plant.id)) continue
    const room = plant.room?.trim()
    if (!room) {
      noRoom.push(plant)
    } else {
      rooms.set(room, [...(rooms.get(room) ?? []), plant])
    }
  }

  const sections: HomeSection[] = []
  if (due.length > 0) sections.push({ kind: 'due', title: dueTitle, data: due })
  ;[...rooms.entries()]
    .sort(([a], [b]) => a.localeCompare(b, locale))
    .forEach(([title, data]) => sections.push({ kind: 'room', title, data }))
  if (noRoom.length > 0) sections.push({ kind: 'room', title: noRoomTitle, data: noRoom })
  return sections
}
