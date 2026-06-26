import { Suspense } from 'react'
import CalisthenicsPlanner from '@/screens/CalisthenicsPlanner'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CalisthenicsPlanner />
    </Suspense>
  )
}
