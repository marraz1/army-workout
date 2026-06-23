import { Suspense } from 'react'
import PlanEditor from '@/screens/PlanEditor'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PlanEditor />
    </Suspense>
  )
}
