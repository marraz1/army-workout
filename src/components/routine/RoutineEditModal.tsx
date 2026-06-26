'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common/Button'
import type { RoutineItem } from '@/types'

const PRESET_COLORS = [
  '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1',
  '#14b8a6', '#e11d48',
]

function genId() {
  return Math.random().toString(36).slice(2, 11)
}

interface Props {
  items: RoutineItem[]
  onSave: (items: RoutineItem[]) => Promise<void>
  onClose: () => void
}

export function RoutineEditModal({ items: initial, onSave, onClose }: Props) {
  const { t } = useTranslation()
  const [items, setItems] = useState<RoutineItem[]>(initial.map((i) => ({ ...i })))
  const [saving, setSaving] = useState(false)
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null)

  const update = (id: string, field: keyof RoutineItem, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)))
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setItems((prev) => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return
    setItems((prev) => {
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id))

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: genId(),
        time: '08:00',
        icon: '✅',
        label: '',
        detail: '',
        color: '#6366f1',
      },
    ])
  }

  const handleSave = async () => {
    const valid = items.filter((it) => it.label.trim())
    setSaving(true)
    await onSave(valid)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60" onClick={onClose}>
      <div
        className="mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy dark:text-white">
            {t('routine.editTitle')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
            >
              <div className="mb-2 flex items-center gap-2">
                {/* Color swatch */}
                <button
                  className="h-8 w-8 flex-shrink-0 rounded-full ring-2 ring-offset-1 ring-slate-300"
                  style={{ background: item.color }}
                  onClick={() => setColorPickerFor(colorPickerFor === item.id ? null : item.id)}
                />

                {/* Time */}
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => update(item.id, 'time', e.target.value)}
                  className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

                {/* Icon */}
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => update(item.id, 'icon', e.target.value)}
                  className="w-12 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  maxLength={2}
                />

                {/* Order buttons */}
                <div className="ml-auto flex gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="rounded px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Color picker */}
              {colorPickerFor === item.id && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`h-6 w-6 rounded-full ring-offset-1 ${
                        item.color === c
                          ? 'ring-2 ring-slate-700 dark:ring-white'
                          : 'ring-1 ring-slate-200 dark:ring-slate-600'
                      }`}
                      style={{ background: c }}
                      onClick={() => {
                        update(item.id, 'color', c)
                        setColorPickerFor(null)
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Label */}
              <input
                type="text"
                value={item.label}
                onChange={(e) => update(item.id, 'label', e.target.value)}
                placeholder={t('routine.labelPlaceholder')}
                className="mb-1.5 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />

              {/* Detail */}
              <input
                type="text"
                value={item.detail}
                onChange={(e) => update(item.id, 'detail', e.target.value)}
                placeholder={t('routine.detailPlaceholder')}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-400 hover:border-navy hover:text-navy dark:border-slate-600 dark:hover:border-flag-yellow dark:hover:text-flag-yellow"
        >
          + {t('routine.addItem')}
        </button>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? t('routine.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
