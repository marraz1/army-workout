const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface DayPickerProps {
  selected: number[]
  onChange: (days: number[]) => void
}

export function DayPicker({ selected, onChange }: DayPickerProps) {
  const toggle = (d: number) => {
    onChange(selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d])
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {DAYS.map((label, i) => (
        <button
          key={i}
          type="button"
          onClick={() => toggle(i)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            selected.includes(i)
              ? 'bg-purple-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
