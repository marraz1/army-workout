import { useState } from 'react'

const PRESETS = [30, 45, 60, 90, 120]

interface RestPickerProps {
  value: number
  onChange: (sec: number) => void
}

export function RestPicker({ value, onChange }: RestPickerProps) {
  const [custom, setCustom] = useState(!PRESETS.includes(value))

  const selectPreset = (sec: number) => {
    setCustom(false)
    onChange(sec)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => selectPreset(sec)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !custom && value === sec
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {sec}s
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCustom(true)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            custom
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          Custom
        </button>
      </div>
      {custom && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={15}
            max={300}
            value={value}
            onChange={(e) => onChange(Math.min(300, Math.max(15, Number(e.target.value))))}
            className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <span className="text-sm text-slate-500">seconds (15–300)</span>
        </div>
      )}
    </div>
  )
}
