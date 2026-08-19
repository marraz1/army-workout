import type { AgeGroup } from '@/types'

/**
 * Age-group training plans. Source of truth:
 * LAF_Workout_App_Requirements.jsx
 *
 * NOTE: each exercise's `id` slug is a DB key (workout_plans / session_sets /
 * personal_bests reference it). These slugs are FROZEN — renaming one orphans
 * the rows that point at it. Hold exercises (plank/wall sit/flutter kicks) use
 * `repsTarget` as SECONDS, not reps, and set `isHold`. Run items set `isRun`
 * and `runGoalSec` and are not logged set-by-set (`isRepBased: false`).
 */
export const ageGroups: AgeGroup[] = [
  {
    range: '25–30',
    min: 25,
    max: 30,
    label: 'Prime Fitness',
    labelLT: 'Geriausias Pajėgumas',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#86efac',
    goal: 'Exceed LAF minimums. Build power & endurance.',
    goalLT: 'Viršyti LAF minimumą. Ugdyti jėgą ir ištvermę.',
    exercises: [
      { id: 'push-ups', name: 'Push-ups', nameLT: 'Atsispaudimai', sets: '4×30', target: '≥41 (LAF min)', targetLT: '≥41 (LAF min.)', icon: '💪', setsCount: 4, repsTarget: 30, restSec: 60, goalValue: 41, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'sit-ups', name: 'Sit-ups (2 min)', nameLT: 'Pilvo presas (2 min.)', sets: '3×20', target: '≥52 (LAF min)', targetLT: '≥52 (LAF min.)', icon: '🔥', setsCount: 3, repsTarget: 20, restSec: 60, goalValue: 52, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'run-3km', name: '3 km Run', nameLT: '3 km bėgimas', sets: '3×/week', setsLT: '3×/sav.', target: '≤15:30 min', targetLT: '≤15:30 min.', icon: '🏃', setsCount: 1, repsTarget: 0, restSec: 60, runGoalSec: 930, isRepBased: false, isRun: true, days: ['Tue', 'Fri'] },
      { id: 'pull-ups', name: 'Pull-ups', nameLT: 'Prisitraukimai', sets: '3×8', target: '10+', icon: '🏋️', setsCount: 3, repsTarget: 8, restSec: 60, goalValue: 10, isRepBased: true, days: ['Mon'] },
      { id: 'burpees', name: 'Burpees', nameLT: 'Burpės', sets: '3×15', target: 'Cardio blast', targetLT: 'Kardio krūvis', icon: '⚡', setsCount: 3, repsTarget: 15, restSec: 60, isRepBased: true, days: ['Thu'] },
      { id: 'plank', name: 'Plank', nameLT: 'Lenta', sets: '3×60s', target: 'Core stability', targetLT: 'Liemens stabilumas', icon: '🧱', setsCount: 3, repsTarget: 60, restSec: 60, isRepBased: true, isHold: true, days: ['Wed'] },
      { id: 'air-squats', name: 'Air Squats', nameLT: 'Pritūpimai', sets: '4×20', target: 'Leg power', targetLT: 'Kojų jėga', icon: '🦵', setsCount: 4, repsTarget: 20, restSec: 60, isRepBased: true, days: ['Thu'] },
      { id: 'flutter-kicks', name: 'Flutter Kicks', nameLT: 'Kojų plakimai', sets: '3×30s', target: 'Core & hip', targetLT: 'Liemuo ir klubai', icon: '🌊', setsCount: 3, repsTarget: 30, restSec: 60, isRepBased: true, isHold: true, days: ['Wed'] },
    ],
    rest: '60 sec between sets', restLT: '60 sek. tarp serijų',
    frequency: '5 days/week', frequencyLT: '5 d./sav.',
  },
  {
    range: '31–40',
    min: 31,
    max: 40,
    label: 'Sustained Strength',
    labelLT: 'Stabili Jėga',
    color: '#2563eb',
    bg: '#dbeafe',
    border: '#93c5fd',
    goal: 'Maintain endurance, add mobility. Injury prevention priority.',
    goalLT: 'Palaikyti ištvermę, pridėti judrumo. Traumų prevencija.',
    exercises: [
      { id: 'push-ups', name: 'Push-ups', nameLT: 'Atsispaudimai', sets: '3×25', target: '≥35 sustained', targetLT: '≥35 be pertrūkio', icon: '💪', setsCount: 3, repsTarget: 25, restSec: 75, goalValue: 35, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'sit-ups', name: 'Sit-ups (2 min)', nameLT: 'Pilvo presas (2 min.)', sets: '3×18', target: '≥48', icon: '🔥', setsCount: 3, repsTarget: 18, restSec: 75, goalValue: 48, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'run-3km', name: '3 km Run / Walk-Run', nameLT: '3 km bėgimas / ėjimas-bėgimas', sets: '3×/week', setsLT: '3×/sav.', target: '≤17:00 min', targetLT: '≤17:00 min.', icon: '🏃', setsCount: 1, repsTarget: 0, restSec: 75, runGoalSec: 1020, isRepBased: false, isRun: true, days: ['Tue', 'Fri'] },
      { id: 'inverted-rows', name: 'Inverted Rows', nameLT: 'Irklavimas gulint', sets: '3×10', target: 'Upper back', targetLT: 'Viršutinė nugara', icon: '🏋️', setsCount: 3, repsTarget: 10, restSec: 75, isRepBased: true, days: ['Mon'] },
      { id: 'lunges', name: 'Lunges', nameLT: 'Išpuoliai', sets: '3×12/leg', setsLT: '3×12/koją', target: 'Functional lower body', targetLT: 'Funkcinė apatinė kūno dalis', icon: '🦵', setsCount: 3, repsTarget: 12, restSec: 75, isRepBased: true, days: ['Thu'] },
      { id: 'plank', name: 'Plank', nameLT: 'Lenta', sets: '3×45s', target: 'Core stability', targetLT: 'Liemens stabilumas', icon: '🧱', setsCount: 3, repsTarget: 45, restSec: 75, isRepBased: true, isHold: true, days: ['Wed'] },
      { id: 'mountain-climbers', name: 'Mountain Climbers', nameLT: 'Alpinistas', sets: '3×20', target: 'Cardio + core', targetLT: 'Kardio + liemuo', icon: '⛰️', setsCount: 3, repsTarget: 20, restSec: 75, isRepBased: true, days: ['Thu'] },
      { id: 'shoulder-stretch', name: 'Shoulder Stretch', nameLT: 'Pečių tempimas', sets: 'Daily 5 min', setsLT: 'Kasdien 5 min.', target: 'Mobility', targetLT: 'Mobilumas', icon: '🧘', setsCount: 1, repsTarget: 0, restSec: 75, isRepBased: false, days: ['Wed'] },
    ],
    rest: '75 sec between sets', restLT: '75 sek. tarp serijų',
    frequency: '4–5 days/week', frequencyLT: '4–5 d./sav.',
  },
  {
    range: '41–50',
    min: 41,
    max: 50,
    label: 'Resilient Readiness',
    labelLT: 'Atsparus Pasirengimas',
    color: '#9333ea',
    bg: '#f3e8ff',
    border: '#d8b4fe',
    goal: 'Maintain military baseline. Joint care. Aerobic base first.',
    goalLT: 'Palaikyti karinį pagrindą. Sąnarių priežiūra. Aerobinis pagrindas.',
    exercises: [
      { id: 'knee-push-ups', name: 'Knee Push-ups → Full', nameLT: 'Atsispaudimai nuo kelių → pilni', sets: '3×15', target: 'Progress to full', targetLT: 'Progresas iki pilnų', icon: '💪', setsCount: 3, repsTarget: 15, restSec: 90, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'sit-ups', name: 'Sit-ups (2 min)', nameLT: 'Pilvo presas (2 min.)', sets: '3×15', target: '≥40 sustained', targetLT: '≥40 be pertrūkio', icon: '🔥', setsCount: 3, repsTarget: 15, restSec: 90, goalValue: 40, isRepBased: true, days: ['Mon', 'Fri'] },
      { id: 'run-3km', name: 'Walk-Run 3 km', nameLT: 'Ėjimas-bėgimas 3 km', sets: '3×/week', setsLT: '3×/sav.', target: '≤18:30 min', targetLT: '≤18:30 min.', icon: '🚶', setsCount: 1, repsTarget: 0, restSec: 90, runGoalSec: 1110, isRepBased: false, isRun: true, days: ['Tue', 'Fri'] },
      { id: 'wall-sit', name: 'Wall Sit', nameLT: 'Sėdėjimas prie sienos', sets: '3×30s', target: 'Knee-safe leg strength', targetLT: 'Keliams saugi kojų jėga', icon: '🧱', setsCount: 3, repsTarget: 30, restSec: 90, isRepBased: true, isHold: true, days: ['Thu'] },
      { id: 'band-rows', name: 'Band / Towel Rows', nameLT: 'Irklavimas su guma / rankšluosčiu', sets: '3×12', target: 'Back strength', targetLT: 'Nugaros jėga', icon: '🏋️', setsCount: 3, repsTarget: 12, restSec: 90, isRepBased: true, days: ['Mon'] },
      { id: 'hip-bridge', name: 'Hip Bridge', nameLT: 'Klubų tiltelis', sets: '3×15', target: 'Glutes & lower back', targetLT: 'Sėdmenys ir juosmuo', icon: '🌉', setsCount: 3, repsTarget: 15, restSec: 90, isRepBased: true, days: ['Thu'] },
      { id: 'slow-squats', name: 'Slow Squats', nameLT: 'Lėti pritūpimai', sets: '3×12', target: 'Controlled form', targetLT: 'Kontroliuojama forma', icon: '🦵', setsCount: 3, repsTarget: 12, restSec: 90, isRepBased: true, days: ['Thu'] },
      { id: 'full-body-stretching', name: 'Full Body Stretching', nameLT: 'Viso kūno tempimas', sets: 'Daily 10 min', setsLT: 'Kasdien 10 min.', target: 'Flexibility', targetLT: 'Lankstumas', icon: '🧘', setsCount: 1, repsTarget: 0, restSec: 90, isRepBased: false, days: ['Wed'] },
    ],
    rest: '90 sec between sets', restLT: '90 sek. tarp serijų',
    frequency: '4 days/week', frequencyLT: '4 d./sav.',
  },
]

/** Map a numeric age to its training group (clamps to the nearest band). */
export function ageGroupForAge(age: number): AgeGroup {
  const match = ageGroups.find((g) => age >= g.min && age <= g.max)
  if (match) return match
  return age < ageGroups[0].min ? ageGroups[0] : ageGroups[ageGroups.length - 1]
}
