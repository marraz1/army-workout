import { useTranslation } from 'react-i18next'

/** Yellow "✏️ Custom" badge shown when an exercise deviates from its default. */
export function CustomBadge() {
  const { t } = useTranslation()
  return (
    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
      ✏️ {t('plan.custom')}
    </span>
  )
}
