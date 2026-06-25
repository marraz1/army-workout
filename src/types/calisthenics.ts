export type CalisthenicsLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type CalisthenicsSource = 'library' | 'custom'
export type IllustrationTemplate = 'push' | 'pull' | 'squat' | 'hold'

export interface CalisthenicsExerciseData {
  id: number
  name: string
  level: CalisthenicsLevel
  muscles: string[]
  description: string
  defaultSets: number
  defaultReps: number
  defaultRestSec: number
  isTimed: boolean
  illustrationKey: string
  progressions: string[]
}

export interface CustomExercise {
  id: string
  userId: string
  name: string
  muscles: string[]
  level: CalisthenicsLevel
  defaultSets: number
  defaultRepsOrSecs: number
  isTimed: boolean
  restSec: number
  description?: string
  notes?: string
  illustrationTemplate?: IllustrationTemplate
  createdAt: string
}

export interface CalisthenicsPlan {
  id: string
  userId: string
  source: CalisthenicsSource
  libraryExerciseId?: number
  customExerciseId?: string
  dayOfWeek: number   // 0=Sun, 1=Mon … 6=Sat
  timeOfDay: string   // HH:MM
  sets: number
  repsOrSecs: number
  restSec: number
  goalTarget?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  // resolved exercise (included from API)
  libraryExercise?: CalisthenicsExerciseData
  customExercise?: CustomExercise
}

export interface CalisthenicsLog {
  id: string
  userId: string
  planId?: string
  source: CalisthenicsSource
  exerciseId: string  // library Int as string, or custom cuid
  sessionDate: string // YYYY-MM-DD
  setNumber: number
  plannedReps: number
  actualReps: number
  completed: boolean
  notes?: string
  createdAt: string
}

export interface CalisthenicsSetInput {
  setNumber: number
  plannedReps: number
  actualReps: number
  completed: boolean
  notes?: string
}

export interface CalisthenicsSessionPayload {
  sessionDate: string
  planId?: string
  source: CalisthenicsSource
  exerciseId: string
  sets: CalisthenicsSetInput[]
}

export interface CalisthenicsPersonalBest {
  exerciseId: string
  source: CalisthenicsSource
  bestReps: number
}
