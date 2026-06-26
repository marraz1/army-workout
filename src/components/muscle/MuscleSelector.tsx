'use client'

import React from 'react'
import { C } from '@/components/muscle/MuscleIconComponents'
import { ALL_MUSCLES } from '@/data/muscleMap'

export interface MuscleState {
  primary: string[]
  secondary: string[]
}

interface MuscleSelectorProps {
  value: MuscleState
  onChange: (value: MuscleState) => void
}

type MuscleStatus = 'none' | 'primary' | 'secondary'

const CYCLE: Record<MuscleStatus, MuscleStatus> = {
  none:      'primary',
  primary:   'secondary',
  secondary: 'none',
}

const STATUS_STYLE: Record<MuscleStatus, { border: string; bg: string; label: string }> = {
  none:      { border: '#e2e8f0', bg: '#f8fafc', label: '' },
  primary:   { border: C.primary,   bg: '#fde8e8', label: '1°' },
  secondary: { border: C.secondary, bg: '#fef3e2', label: '2°' },
}

/** Icon reference sheet with clickable muscle groups. Tap to cycle: none → primary → secondary → none. */
export function MuscleSelector({ value, onChange }: MuscleSelectorProps) {
  function getStatus(id: string): MuscleStatus {
    if (value.primary.includes(id)) return 'primary'
    if (value.secondary.includes(id)) return 'secondary'
    return 'none'
  }

  function toggle(id: string) {
    const current = getStatus(id)
    const next = CYCLE[current]
    const primary = value.primary.filter((m) => m !== id)
    const secondary = value.secondary.filter((m) => m !== id)
    if (next === 'primary') primary.push(id)
    if (next === 'secondary') secondary.push(id)
    onChange({ primary, secondary })
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: C.primary }} />
          Primary
        </span>
        <span className="flex items-center gap-1">
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: C.secondary }} />
          Secondary
        </span>
        <span className="text-slate-400">Tap to cycle</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {ALL_MUSCLES.map(({ id, label, component: Comp, highlight }) => {
          const status = getStatus(id)
          const style = STATUS_STYLE[status]
          const CompTyped = Comp as React.ComponentType<{
            highlight?: string[]
            width?: number
            height?: number
            side?: string
          }>
          const sideProps = id === 'biceps' ? { side: 'front' } : id === 'triceps' || id === 'forearms' ? { side: 'back' } : {}

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: 6,
                borderRadius: 10,
                border: `2px solid ${style.border}`,
                background: style.bg,
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {status !== 'none' && (
                <span style={{
                  position: 'absolute',
                  top: 3,
                  right: 5,
                  fontSize: 9,
                  fontWeight: 800,
                  color: status === 'primary' ? C.primary : C.secondary,
                }}>
                  {style.label}
                </span>
              )}
              <CompTyped highlight={highlight} width={44} height={50} {...sideProps} />
              <span style={{ fontSize: 9, fontWeight: 600, color: '#64748b', textAlign: 'center', lineHeight: 1.2 }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Serialize/deserialize muscle state for DB storage. */
export function serializeMuscles(state: MuscleState): string {
  return JSON.stringify(state)
}

export function deserializeMuscles(json: string | undefined): MuscleState {
  if (!json) return { primary: [], secondary: [] }
  try {
    return JSON.parse(json) as MuscleState
  } catch {
    return { primary: [], secondary: [] }
  }
}
