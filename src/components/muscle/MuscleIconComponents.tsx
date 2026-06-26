import React from 'react'

export const C = {
  body:      '#b0bec5',
  outline:   '#78909c',
  bone:      '#cfd8dc',
  primary:   '#e53935',
  secondary: '#fb8c00',
  bg:        '#f8fafc',
}

export type MuscleHighlight = {
  component: React.ComponentType<MuscleIconProps | ArmIconProps>
  highlight: string[]
  props?: Record<string, unknown>
}

export interface MuscleIconProps {
  highlight?: string[]
  width?: number
  height?: number
}

export interface ArmIconProps extends MuscleIconProps {
  side?: 'front' | 'back'
}

export function FrontTorso({ highlight = [], width = 80, height = 90 }: MuscleIconProps) {
  const isPrimary = (id: string) => highlight[0] === id
  const fill = (id: string) =>
    highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body

  return (
    <svg viewBox="0 0 80 90" width={width} height={height} style={{ display: 'block' }}>
      {/* Neck */}
      <rect x="33" y="2" width="14" height="12" rx="4" fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Traps */}
      <path d="M 33,8 C 28,10 18,14 16,22 C 20,20 28,18 33,14 Z" fill={fill('traps')} stroke={C.outline} strokeWidth="1" />
      <path d="M 47,8 C 52,10 62,14 64,22 C 60,20 52,18 47,14 Z" fill={fill('traps')} stroke={C.outline} strokeWidth="1" />

      {/* Shoulders */}
      <ellipse cx="13" cy="28" rx="9" ry="10" fill={fill('shoulders')} stroke={C.outline} strokeWidth="1.2" />
      <ellipse cx="67" cy="28" rx="9" ry="10" fill={fill('shoulders')} stroke={C.outline} strokeWidth="1.2" />

      {/* Chest left */}
      <path d="M 22,20 C 16,22 14,30 16,38 C 20,42 32,42 36,38 C 38,32 36,22 30,20 Z"
        fill={fill('chest')} stroke={C.outline} strokeWidth="1.2" />
      {/* Chest right */}
      <path d="M 58,20 C 64,22 66,30 64,38 C 60,42 48,42 44,38 C 42,32 44,22 50,20 Z"
        fill={fill('chest')} stroke={C.outline} strokeWidth="1.2" />
      <line x1="40" y1="20" x2="40" y2="42" stroke={C.outline} strokeWidth="1" />

      {/* Abs — 3 rows × 2 cols */}
      {[0, 1, 2].map(row => [0, 1].map(col2 => (
        <rect key={`${row}-${col2}`}
          x={30 + col2 * 11} y={44 + row * 13} width={9} height={11} rx={3}
          fill={fill('abs')} stroke={C.outline} strokeWidth="1" />
      )))}

      {/* Obliques */}
      <path d="M 22,44 C 16,50 14,60 16,72 C 20,76 28,74 30,68 C 32,58 28,48 22,44 Z"
        fill={fill('obliques')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,44 C 64,50 66,60 64,72 C 60,76 52,74 50,68 C 48,58 52,48 58,44 Z"
        fill={fill('obliques')} stroke={C.outline} strokeWidth="1.2" />

      {/* Lower torso / hip */}
      <path d="M 30,82 C 26,84 22,88 22,90 L 58,90 C 58,88 54,84 50,82 C 46,80 34,80 30,82 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1" />
    </svg>
  )
}

export function BackTorso({ highlight = [], width = 80, height = 90 }: MuscleIconProps) {
  const isPrimary = (id: string) => highlight[0] === id
  const fill = (id: string) =>
    highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body

  return (
    <svg viewBox="0 0 80 90" width={width} height={height} style={{ display: 'block' }}>
      {/* Neck */}
      <rect x="33" y="2" width="14" height="12" rx="4" fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Traps upper */}
      <path d="M 33,8 C 24,12 16,18 16,26 C 22,22 32,18 40,18 C 48,18 58,22 64,26 C 64,18 56,12 47,8 Z"
        fill={fill('traps')} stroke={C.outline} strokeWidth="1.2" />

      {/* Rear delts */}
      <ellipse cx="12" cy="30" rx="9" ry="10" fill={fill('rear_delt')} stroke={C.outline} strokeWidth="1.2" />
      <ellipse cx="68" cy="30" rx="9" ry="10" fill={fill('rear_delt')} stroke={C.outline} strokeWidth="1.2" />

      {/* Lats */}
      <path d="M 21,28 C 16,34 14,50 16,62 C 20,70 30,74 36,70 C 40,62 40,44 38,30 Z"
        fill={fill('lats')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 59,28 C 64,34 66,50 64,62 C 60,70 50,74 44,70 C 40,62 40,44 42,30 Z"
        fill={fill('lats')} stroke={C.outline} strokeWidth="1.2" />

      {/* Rhomboids / mid back */}
      <path d="M 38,28 C 35,34 34,50 36,60 L 44,60 C 46,50 45,34 42,28 Z"
        fill={fill('lower_back')} stroke={C.outline} strokeWidth="1" />

      {/* Lower back / lumbar */}
      <path d="M 30,68 C 26,72 24,80 24,90 L 56,90 C 56,80 54,72 50,68 C 46,64 34,64 30,68 Z"
        fill={fill('lower_back')} stroke={C.outline} strokeWidth="1.2" />

      {/* Spine line */}
      <line x1="40" y1="20" x2="40" y2="72" stroke={C.outline} strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  )
}

export function FrontLegs({ highlight = [], width = 70, height = 110 }: MuscleIconProps) {
  const isPrimary = (id: string) => highlight[0] === id
  const fill = (id: string) =>
    highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body

  return (
    <svg viewBox="0 0 80 110" width={width} height={height} style={{ display: 'block' }}>
      {/* Hip / pelvis */}
      <path d="M 14,4 C 10,8 8,16 10,22 L 40,26 L 70,22 C 72,16 70,8 66,4 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Hip flexors */}
      <path d="M 18,20 C 14,24 12,30 14,36 C 18,38 26,36 28,30 C 30,24 26,20 18,20 Z"
        fill={fill('hip_flexors')} stroke={C.outline} strokeWidth="1" />
      <path d="M 62,20 C 66,24 68,30 66,36 C 62,38 54,36 52,30 C 50,24 54,20 62,20 Z"
        fill={fill('hip_flexors')} stroke={C.outline} strokeWidth="1" />

      {/* Quads left */}
      <path d="M 14,34 C 10,40 9,58 11,72 C 14,78 22,80 26,76 C 32,68 32,48 30,36 C 26,32 18,32 14,34 Z"
        fill={fill('quads')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 20,38 C 16,46 16,62 20,70" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Quads right */}
      <path d="M 66,34 C 70,40 71,58 69,72 C 66,78 58,80 54,76 C 48,68 48,48 50,36 C 54,32 62,32 66,34 Z"
        fill={fill('quads')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 60,38 C 64,46 64,62 60,70" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Adductors / inner thigh */}
      <path d="M 30,36 C 32,44 34,60 36,74 L 40,76 L 44,74 C 46,60 48,44 50,36 C 46,30 34,30 30,36 Z"
        fill={fill('adductors')} stroke={C.outline} strokeWidth="1" />

      {/* Knee caps */}
      <ellipse cx="22" cy="78" rx="8" ry="5" fill={C.bone} stroke={C.outline} strokeWidth="1" />
      <ellipse cx="58" cy="78" rx="8" ry="5" fill={C.bone} stroke={C.outline} strokeWidth="1" />

      {/* Calves front (tibialis) */}
      <path d="M 15,84 C 11,90 11,102 15,108 C 19,112 25,110 27,104 C 29,96 27,86 23,82 Z"
        fill={fill('calves')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 65,84 C 69,90 69,102 65,108 C 61,112 55,110 53,104 C 51,96 53,86 57,82 Z"
        fill={fill('calves')} stroke={C.outline} strokeWidth="1.2" />
    </svg>
  )
}

export function BackLegs({ highlight = [], width = 80, height = 110 }: MuscleIconProps) {
  const isPrimary = (id: string) => highlight[0] === id
  const fill = (id: string) =>
    highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body

  return (
    <svg viewBox="0 0 80 110" width={width} height={height} style={{ display: 'block' }}>
      {/* Hip / pelvis */}
      <path d="M 14,4 C 10,8 8,16 10,22 L 40,24 L 70,22 C 72,16 70,8 66,4 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Glutes */}
      <path d="M 12,18 C 8,24 8,38 14,46 C 20,52 34,52 38,44 C 40,36 38,22 32,16 C 26,12 16,14 12,18 Z"
        fill={fill('glutes')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 68,18 C 72,24 72,38 66,46 C 60,52 46,52 42,44 C 40,36 42,22 48,16 C 54,12 64,14 68,18 Z"
        fill={fill('glutes')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 18,42 C 24,48 36,48 38,44" stroke={C.outline} strokeWidth="0.8" fill="none" />
      <path d="M 62,42 C 56,48 44,48 42,44" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Hamstrings */}
      <path d="M 14,50 C 10,58 10,72 14,82 C 18,88 28,88 32,82 C 36,72 34,56 30,48 C 24,44 16,46 14,50 Z"
        fill={fill('hamstrings')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 22,52 C 20,62 20,74 22,82" stroke={C.outline} strokeWidth="0.8" fill="none" />

      <path d="M 66,50 C 70,58 70,72 66,82 C 62,88 52,88 48,82 C 44,72 46,56 50,48 C 56,44 64,46 66,50 Z"
        fill={fill('hamstrings')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,52 C 60,62 60,74 58,82" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Back of calves (gastrocnemius) */}
      <path d="M 14,86 C 10,94 10,106 15,110 C 20,114 28,110 30,102 C 32,92 28,84 22,82 Z"
        fill={fill('calves')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 22,86 C 20,92 19,102 20,108" stroke={C.outline} strokeWidth="0.8" fill="none" />

      <path d="M 66,86 C 70,94 70,106 65,110 C 60,114 52,110 50,102 C 48,92 52,84 58,82 Z"
        fill={fill('calves')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,86 C 60,92 61,102 60,108" stroke={C.outline} strokeWidth="0.8" fill="none" />
    </svg>
  )
}

export function ArmIcon({ highlight = [], side = 'front', width = 44, height = 100 }: ArmIconProps) {
  const isPrimary = (id: string) => highlight[0] === id
  const fill = (id: string) =>
    highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body

  return (
    <svg viewBox="0 0 44 100" width={width} height={height} style={{ display: 'block' }}>
      {/* Shoulder cap */}
      <ellipse cx="22" cy="10" rx="14" ry="12" fill={fill('shoulders')} stroke={C.outline} strokeWidth="1.2" />

      {/* Upper arm */}
      <path d="M 10,18 C 6,26 6,48 10,58 C 14,64 22,64 28,60 C 34,54 36,34 34,20 C 30,14 14,14 10,18 Z"
        fill={fill(side === 'front' ? 'biceps' : 'triceps')} stroke={C.outline} strokeWidth="1.2" />
      <path d={side === 'front'
        ? 'M 18,20 C 14,30 14,48 18,58'
        : 'M 22,20 C 26,30 26,48 22,58'}
        stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Elbow */}
      <ellipse cx="22" cy="62" rx="10" ry="6" fill={C.bone} stroke={C.outline} strokeWidth="1" />

      {/* Forearm */}
      <path d="M 12,66 C 9,74 9,88 13,96 C 17,100 27,100 31,96 C 35,88 35,74 32,66 Z"
        fill={fill('forearms')} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 18,68 C 16,78 16,90 18,96" stroke={C.outline} strokeWidth="0.8" fill="none" />
    </svg>
  )
}
