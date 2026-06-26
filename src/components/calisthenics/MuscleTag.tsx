export function MuscleTag({ muscle }: { muscle: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      {muscle}
    </span>
  )
}
