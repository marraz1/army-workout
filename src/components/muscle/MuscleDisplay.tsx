import React from 'react'
import {
  ArmIcon,
  BackLegs,
  BackTorso,
  FrontLegs,
  FrontTorso,
  type MuscleHighlight,
} from '@/components/muscle/MuscleIconComponents'
import { getMuscleHighlights } from '@/data/muscleMap'

interface MuscleDisplayProps {
  exerciseId?: string
  highlights?: MuscleHighlight[]
  /** Render at ~55% of natural size for inline/card use. */
  compact?: boolean
}

// Natural dimensions for each component — used to derive compact sizes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nativeSizes = new Map<React.ComponentType<any>, [number, number]>([
  [FrontTorso, [80, 90]],
  [BackTorso,  [80, 90]],
  [FrontLegs,  [70, 110]],
  [BackLegs,   [80, 110]],
  [ArmIcon,    [44, 100]],
])

const COMPACT_SCALE = 0.55

export function MuscleDisplay({ exerciseId, highlights, compact = false }: MuscleDisplayProps) {
  const items = highlights ?? (exerciseId ? getMuscleHighlights(exerciseId) : [])
  if (items.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: compact ? 6 : 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {items.map((h, i) => {
        const Comp = h.component as React.ComponentType<{
          highlight?: string[]
          width?: number
          height?: number
          side?: string
        }>
        const [nW, nH] = nativeSizes.get(h.component) ?? [80, 90]
        const w = compact ? Math.round(nW * COMPACT_SCALE) : nW
        const hh = compact ? Math.round(nH * COMPACT_SCALE) : nH

        return (
          <Comp
            key={i}
            highlight={h.highlight}
            width={w}
            height={hh}
            {...(h.props as object ?? {})}
          />
        )
      })}
    </div>
  )
}
