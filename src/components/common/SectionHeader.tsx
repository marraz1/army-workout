interface SectionHeaderProps {
  icon: string
  title: string
  subtitle?: string
}

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="m-0 flex items-center gap-2.5 text-xl font-extrabold text-navy dark:text-white">
        <span className="text-2xl">{icon}</span> {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
      <div className="mt-2 h-[3px] rounded bg-gradient-to-r from-navy via-forest to-transparent" />
    </div>
  )
}
