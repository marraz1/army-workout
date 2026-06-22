import type { LafStandard } from '@/types'

export const lafStandards: LafStandard[] = [
  { group: 'Men 21–30', pushups: '41+', situps: '52+ (2min)', run: '≤15:30', note: 'LAF baseline' },
  { group: 'Men 31–40', pushups: '35+', situps: '48+ (2min)', run: '≤17:00', note: 'Adjusted target' },
  { group: 'Men 41–50', pushups: '28+', situps: '40+ (2min)', run: '≤18:30', note: 'Adjusted target' },
  { group: 'Women 21–30', pushups: '18+', situps: '52+ (2min)', run: '≤18:30', note: 'LAF baseline' },
  { group: 'Women 31–40', pushups: '14+', situps: '44+ (2min)', run: '≤19:30', note: 'Adjusted target' },
  { group: 'Women 41–50', pushups: '10+', situps: '36+ (2min)', run: '≤21:00', note: 'Adjusted target' },
]
