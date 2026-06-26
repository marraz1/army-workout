import { Suspense } from 'react'
import CustomExerciseBuilder from '@/screens/CustomExerciseBuilder'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CustomExerciseBuilder />
    </Suspense>
  )
}
