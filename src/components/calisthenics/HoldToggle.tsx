interface HoldToggleProps {
  isTimed: boolean
  onChange: (isTimed: boolean) => void
}

export function HoldToggle({ isTimed, onChange }: HoldToggleProps) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 w-fit">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          !isTimed
            ? 'bg-purple-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        Reps
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          isTimed
            ? 'bg-purple-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        Hold (s)
      </button>
    </div>
  )
}
