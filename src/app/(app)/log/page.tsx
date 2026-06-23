import { Suspense } from 'react'
import WorkoutLogger from '@/screens/WorkoutLogger'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorkoutLogger />
    </Suspense>
  )
}
