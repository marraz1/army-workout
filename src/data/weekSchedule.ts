import type { ScheduleDay } from '@/types'

export const weekSchedule: ScheduleDay[] = [
  { day: 'Mon', type: 'Strength', typeLT: 'Jėga', icon: '💪', focus: 'Push-ups, Sit-ups, Pull-ups / Rows', focusLT: 'Atsispaudimai, pilvo presas, prisitraukimai / irklavimas', color: '#ef4444' },
  { day: 'Tue', type: 'Cardio', typeLT: 'Kardio', icon: '🏃', focus: '3 km Run / Walk-Run intervals', focusLT: '3 km bėgimas / ėjimo-bėgimo intervalai', color: '#f97316' },
  { day: 'Wed', type: 'Core + Mobility', typeLT: 'Liemuo ir Mobilumas', icon: '🧘', focus: 'Plank, Flutter Kicks, Stretching', focusLT: 'Lenta, kojų plakimai, tempimas', color: '#eab308' },
  { day: 'Thu', type: 'Strength', typeLT: 'Jėga', icon: '💪', focus: 'Squats, Lunges, Burpees', focusLT: 'Pritūpimai, išpuoliai, burpės', color: '#ef4444' },
  { day: 'Fri', type: 'Cardio + Full Test', typeLT: 'Kardio ir Pilnas Testas', icon: '🏆', focus: 'Run + Push-up + Sit-up timed test', focusLT: 'Bėgimas + atsispaudimų ir pilvo preso testas', color: '#22c55e' },
  { day: 'Sat', type: 'Active Recovery', typeLT: 'Aktyvus Poilsis', icon: '🚴', focus: 'Light walk, cycling or swimming', focusLT: 'Lengvas pasivaikščiojimas, dviratis ar plaukimas', color: '#06b6d4' },
  { day: 'Sun', type: 'Rest', typeLT: 'Poilsis', icon: '😴', focus: 'Full rest or optional stretching', focusLT: 'Visiškas poilsis arba lengvas tempimas', color: '#8b5cf6' },
]

/** JS getDay() returns 0=Sun..6=Sat. Map to our Mon-first array index. */
export function scheduleForDate(date = new Date()): ScheduleDay {
  const jsDay = date.getDay() // 0 = Sunday
  const monFirstIndex = (jsDay + 6) % 7 // 0 = Monday
  return weekSchedule[monFirstIndex]
}

export interface TrainingPhase {
  phase: string
  phaseLT: string
  name: string
  nameLT: string
  desc: string
  descLT: string
  color: string
}

export const trainingPhases: TrainingPhase[] = [
  {
    phase: 'Weeks 1–4',
    phaseLT: '1–4 Savaitė',
    name: 'Foundation',
    nameLT: 'Pagrindas',
    desc: 'Build baseline. Master form. 3–4 sets, 60–90s rest.',
    descLT: 'Ugdyti pagrindą. Forma pirma. 3–4 serijos, 60–90s poilsis.',
    color: '#22c55e',
  },
  {
    phase: 'Weeks 5–8',
    phaseLT: '5–8 Savaitė',
    name: 'Volume',
    nameLT: 'Apimtis',
    desc: 'Add 1 set. Cut rest by 15s. Increase reps +2 every week.',
    descLT: 'Pridėti 1 seriją. Sutrumpinti poilsį 15s. Reps +2 kas savaitę.',
    color: '#3b82f6',
  },
  {
    phase: 'Weeks 9–12',
    phaseLT: '9–12 Savaitė',
    name: 'Test Prep',
    nameLT: 'Testo Paruošimas',
    desc: 'Simulate LAF test weekly. Max-effort sets. Taper last week.',
    descLT: 'Kas savaitę simuliuoti LAF testą. Pilnas intensyvumas.',
    color: '#ef4444',
  },
]
