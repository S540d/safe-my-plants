import type { IconName } from '../components/Icon'
import { PlantLocation } from '../types/plant'

export const LOCATION_ICONS: Record<PlantLocation, IconName> = {
  sun: 'sun',
  'partial-shade': 'partialShade',
  shade: 'shade',
  indoor: 'indoor',
}
