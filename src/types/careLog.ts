export type CareActionType = 'water' | 'fertilize' | 'repot' | 'prune' | 'note'

export interface CareAction {
  id: string
  plantId: string
  type: CareActionType
  timestamp: string // ISO-8601
  note?: string
}
