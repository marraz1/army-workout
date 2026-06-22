import { useState } from "react";

const sections = [
  {
    id: "overview",
    icon: "🎯",
    title: "Project Overview",
    titleLT: "Projekto Apžvalga",
    content: null,
    overview: true,
  },
  {
    id: "users",
    icon: "👥",
    title: "Target Users & Age Groups",
    titleLT: "Tikslinė Grupė ir Amžius",
  },
  {
    id: "exercises",
    icon: "💪",
    title: "Exercise Library by Age",
    titleLT: "Pratimų Biblioteka pagal Amžių",
  },
  {
    id: "schedule",
    icon: "📅",
    title: "Scheduled Workouts",
    titleLT: "Treniruočių Grafikas",
  },
  {
    id: "daily",
    icon: "🌅",
    title: "Daily Routine",
    titleLT: "Dienos Rutina",
  },
  {
    id: "features",
    icon: "⚙️",
    title: "App Features",
    titleLT: "Programėlės Funkcijos",
  },
  {
    id: "ui",
    icon: "📱",
    title: "UI / Mobile Design",
    titleLT: "Dizainas / Mobilusis",
  },
  {
    id: "illustrations",
    icon: "🖼️",
    title: "Image Illustrations",
    titleLT: "Iliustracijos",
  },
  {
    id: "tech",
    icon: "🛠️",
    title: "Technical Stack",
    titleLT: "Techninė Dalis",
  },
];

const ageGroups = [
  {
    range: "25–30",
    label: "Prime Fitness",
    labelLT: "Geriausias Pajėgumas",
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#86efac",
    goal: "Exceed LAF minimums. Build power & endurance.",
    goalLT: "Viršyti LAF minimumą. Ugdyti jėgą ir ištvermę.",
    exercises: [
      { name: "Push-ups", sets: "4×30", target: "≥41 (LAF min)", icon: "💪" },
      { name: "Sit-ups (2 min)", sets: "3×20", target: "≥52 (LAF min)", icon: "🔥" },
      { name: "3 km Run", sets: "3×/week", target: "≤15:30 min", icon: "🏃" },
      { name: "Pull-ups", sets: "3×8", target: "10+", icon: "🏋️" },
      { name: "Burpees", sets: "3×15", target: "Cardio blast", icon: "⚡" },
      { name: "Plank", sets: "3×60s", target: "Core stability", icon: "🧱" },
      { name: "Air Squats", sets: "4×20", target: "Leg power", icon: "🦵" },
      { name: "Flutter Kicks", sets: "3×30s", target: "Core & hip", icon: "🌊" },
    ],
    rest: "60 sec between sets",
    frequency: "5 days/week",
  },
  {
    range: "31–40",
    label: "Sustained Strength",
    labelLT: "Stabili Jėga",
    color: "#2563eb",
    bg: "#dbeafe",
    border: "#93c5fd",
    goal: "Maintain endurance, add mobility. Injury prevention priority.",
    goalLT: "Palaikyti ištvermę, pridėti judrumo. Traumų prevencija.",
    exercises: [
      { name: "Push-ups", sets: "3×25", target: "≥35 sustained", icon: "💪" },
      { name: "Sit-ups (2 min)", sets: "3×18", target: "≥48", icon: "🔥" },
      { name: "3 km Run / Walk-Run", sets: "3×/week", target: "≤17:00 min", icon: "🏃" },
      { name: "Inverted Rows", sets: "3×10", target: "Upper back", icon: "🏋️" },
      { name: "Lunges", sets: "3×12/leg", target: "Functional lower body", icon: "🦵" },
      { name: "Plank", sets: "3×45s", target: "Core stability", icon: "🧱" },
      { name: "Mountain Climbers", sets: "3×20", target: "Cardio + core", icon: "⛰️" },
      { name: "Shoulder Stretch", sets: "Daily 5 min", target: "Mobility", icon: "🧘" },
    ],
    rest: "75 sec between sets",
    frequency: "4–5 days/week",
  },
  {
    range: "41–50",
    label: "Resilient Readiness",
    labelLT: "Atsparus Pasirengimas",
    color: "#9333ea",
    bg: "#f3e8ff",
    border: "#d8b4fe",
    goal: "Maintain military baseline. Joint care. Aerobic base first.",
    goalLT: "Palaikyti karinį pagrindą. Sąnarių priežiūra. Aerobinis pagrindas.",
    exercises: [
      { name: "Knee Push-ups → Full", sets: "3×15", target: "Progress to full", icon: "💪" },
      { name: "Sit-ups (2 min)", sets: "3×15", target: "≥40 sustained", icon: "🔥" },
      { name: "Walk-Run 3 km", sets: "3×/week", target: "≤18:30 min", icon: "🚶" },
      { name: "Wall Sit", sets: "3×30s", target: "Knee-safe leg strength", icon: "🧱" },
      { name: "Band / Towel Rows", sets: "3×12", target: "Back strength", icon: "🏋️" },
      { name: "Hip Bridge", sets: "3×15", target: "Glutes & lower back", icon: "🌉" },
      { name: "Slow Squats", sets: "3×12", target: "Controlled form", icon: "🦵" },
      { name: "Full Body Stretching", sets: "Daily 10 min", target: "Flexibility", icon: "🧘" },
    ],
    rest: "90 sec between sets",
    frequency: "4 days/week",
  },
];

const weekSchedule = [
  { day: "Mon", type: "Strength", icon: "💪", focus: "Push-ups, Sit-ups, Pull-ups / Rows", color: "#ef4444" },
  { day: "Tue", type: "Cardio", icon: "🏃", focus: "3 km Run / Walk-Run intervals", color: "#f97316" },
  { day: "Wed", type: "Core + Mobility", icon: "🧘", focus: "Plank, Flutter Kicks, Stretching", color: "#eab308" },
  { day: "Thu", type: "Strength", icon: "💪", focus: "Squats, Lunges, Burpees", color: "#ef4444" },
  { day: "Fri", type: "Cardio + Full Test", icon: "🏆", focus: "Run + Push-up + Sit-up timed test", color: "#22c55e" },
  { day: "Sat", type: "Active Recovery", icon: "🚴", focus: "Light walk, cycling or swimming", color: "#06b6d4" },
  { day: "Sun", type: "Rest", icon: "😴", focus: "Full rest or optional stretching", color: "#8b5cf6" },
];

const dailyRoutine = [
  { time: "06:00", icon: "⏰", label: "Wake Up", detail: "Alarm + hydration (500ml water)", color: "#f59e0b" },
  { time: "06:05", icon: "🧘", label: "Morning Mobility", detail: "5 min joint warm-up, neck rolls, hip circles", color: "#10b981" },
  { time: "06:15", icon: "💪", label: "Workout Session", detail: "30–45 min structured exercise per schedule", color: "#ef4444" },
  { time: "07:00", icon: "🚿", label: "Cool Down + Shower", detail: "5 min stretch + hygiene", color: "#06b6d4" },
  { time: "07:15", icon: "🍳", label: "Breakfast", detail: "High protein meal (eggs, oats, dairy)", color: "#f97316" },
  { time: "12:30", icon: "🥗", label: "Lunch", detail: "Balanced meal — protein + carbs + vegetables", color: "#22c55e" },
  { time: "15:00", icon: "💧", label: "Hydration Check", detail: "App reminder: drink 500ml water", color: "#3b82f6" },
  { time: "19:00", icon: "🍽️", label: "Dinner", detail: "Light meal, reduce carbs in evening", color: "#8b5cf6" },
  { time: "21:00", icon: "📱", label: "Log Workout", detail: "Mark complete / skip / cheat day in app", color: "#ec4899" },
  { time: "22:00", icon: "😴", label: "Sleep", detail: "8 hours recommended for muscle recovery", color: "#6366f1" },
];

const appFeatures = [
  {
    cat: "User Profile",
    icon: "👤",
    items: [
      "Age input (25–50) → auto-assigns age group plan",
      "Gender selection (M/F) for LAF standard targets",
      "Fitness level self-assessment (Beginner / Intermediate / Advanced)",
      "Name & language preference (LT / EN)",
    ],
  },
  {
    cat: "Workout Engine",
    icon: "🔧",
    items: [
      "Auto-generated 7-day schedule based on age group",
      "Progressive overload: reps increase every 2 weeks (+2 push-ups, +1 rep/set)",
      "Exercise swap suggestions for injuries (e.g. knee push-up instead of full)",
      "Timer built into each exercise set",
    ],
  },
  {
    cat: "Skip / Cheat Day",
    icon: "🎭",
    items: [
      "\"Skip Day\" button: marks day as skipped, reschedules automatically",
      "\"Cheat Day\" button: logs rest, no guilt — max 1/week allowed",
      "Reason selector: Sick / Tired / Travel / Other",
      "Streak counter resets only after 3 consecutive skips",
    ],
  },
  {
    cat: "Progress & Analytics",
    icon: "📊",
    items: [
      "Weekly push-up / sit-up / run time progress charts",
      "LAF readiness score (% of minimum standard achieved)",
      "Calendar heatmap of training consistency",
      "Personal bests tracker",
    ],
  },
  {
    cat: "Notifications",
    icon: "🔔",
    items: [
      "Morning workout reminder (customizable time)",
      "Hydration reminders every 3 hours",
      "Rest day recovery tip",
      "Weekly progress summary push notification",
    ],
  },
  {
    cat: "Image Illustrations",
    icon: "🖼️",
    items: [
      "SVG/animated GIF per exercise showing correct form",
      "Age-appropriate avatar performing each movement",
      "Common mistake callouts (red X overlay)",
      "Breathing cue icons on each rep",
    ],
  },
];

const techStack = [
  { layer: "Frontend", tech: "React + Tailwind CSS (PWA)", why: "Mobile-first, installable, offline-capable" },
  { layer: "Backend", tech: "Node.js + Express or Supabase", why: "User data, progress storage, auth" },
  { layer: "Database", tech: "PostgreSQL (via Supabase)", why: "User profiles, workout logs, streaks" },
  { layer: "Auth", tech: "Supabase Auth / Magic Link", why: "No password friction for users" },
  { layer: "Illustrations", tech: "SVG animations + Lottie", why: "Lightweight, crisp on all screens" },
  { layer: "Languages", tech: "i18next (LT/EN)", why: "Runtime language switch" },
  { layer: "Notifications", tech: "Web Push API + Service Worker", why: "Works on mobile without native app" },
  { layer: "Hosting", tech: "Vercel / Netlify", why: "Free tier, fast CDN, easy CI/CD" },
];

const lafStandards = [
  { group: "Men 21–30", pushups: "41+", situps: "52+ (2min)", run: "≤15:30", note: "LAF baseline" },
  { group: "Men 31–40", pushups: "35+", situps: "48+ (2min)", run: "≤17:00", note: "Adjusted target" },
  { group: "Men 41–50", pushups: "28+", situps: "40+ (2min)", run: "≤18:30", note: "Adjusted target" },
  { group: "Women 21–30", pushups: "18+", situps: "52+ (2min)", run: "≤18:30", note: "LAF baseline" },
  { group: "Women 31–40", pushups: "14+", situps: "44+ (2min)", run: "≤19:30", note: "Adjusted target" },
  { group: "Women 41–50", pushups: "10+", situps: "36+ (2min)", run: "≤21:00", note: "Adjusted target" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeAge, setActiveAge] = useState(0);
  const [lang, setLang] = useState("EN");

  const t = (en, lt) => (lang === "LT" ? lt : en);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)", color: "white", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Project Requirements</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>🇱🇹 LAF Workout App</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Lithuanian Armed Forces · Ages 25–50 · Civilians</div>
          </div>
          <button
            onClick={() => setLang(lang === "EN" ? "LT" : "EN")}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
          >
            {lang === "EN" ? "🇱🇹 LT" : "🇬🇧 EN"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
        {/* Nav pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeSection === s.id ? "#1e3a5f" : "#e2e8f0",
                color: activeSection === s.id ? "white" : "#475569",
                transition: "all 0.2s",
              }}
            >
              {s.icon} {t(s.title.split(" ")[0], s.titleLT.split(" ")[0])}…
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div>
            <SectionHeader icon="🎯" title={t("Project Overview", "Projekto Apžvalga")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { label: t("App Name", "Pavadinimas"), value: "LAF Fit / Karinis Treniruoklis", icon: "📱" },
                { label: t("Target Users", "Tikslinė Grupė"), value: t("Lithuanian civilians (25–50) preparing for LAF conscription", "Lietuvos civiliai (25–50) besiruošiantys NPPKT"), icon: "👥" },
                { label: t("Languages", "Kalbos"), value: "Lithuanian 🇱🇹 + English 🇬🇧", icon: "🌐" },
                { label: t("Platform", "Platforma"), value: t("Mobile-first Web App (PWA) — iOS + Android via browser", "Mobili žiniatinklio programa (PWA)"), icon: "📱" },
                { label: t("Core Goal", "Pagrindinis Tikslas"), value: t("Help civilians pass LAF physical fitness test", "Padėti civiliams išlaikyti LAF kūno rengybos testą"), icon: "🏆" },
                { label: t("Test Standard", "Testo Standartas"), value: t("Push-ups + Sit-ups (2min) + 3km Run", "Atsispaudimai + Pilvo pratimai + 3km bėgimas"), icon: "✅" },
              ].map((item, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: "3px solid #1e3a5f" }}>
                  <div style={{ fontSize: 20 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <Card title={t("LAF Fitness Test Standards (Minimum Pass = 60%)", "LAF Kūno Rengybos Testo Standartai (Min. 60%)")}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#1e3a5f", color: "white" }}>
                      {[t("Age Group","Amžiaus Grupė"), t("Push-ups","Atsispaudimai"), t("Sit-ups 2min","Pilvo Pratimai"), t("3km Run","3km Bėgimas"), t("Note","Pastaba")].map((h,i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lafStandards.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: "#1e3a5f" }}>{row.group}</td>
                        <td style={{ padding: "9px 12px", color: "#16a34a", fontWeight: 700 }}>{row.pushups}</td>
                        <td style={{ padding: "9px 12px", color: "#2563eb", fontWeight: 700 }}>{row.situps}</td>
                        <td style={{ padding: "9px 12px", color: "#dc2626", fontWeight: 700 }}>{row.run}</td>
                        <td style={{ padding: "9px 12px", color: "#64748b", fontSize: 12 }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef9c3", borderRadius: 8, fontSize: 12, color: "#854d0e" }}>
                ⚠️ {t("Source: LRT 2025 report — only 19% of conscripts pass the first LAF fitness test. This app directly targets that gap.", "Šaltinis: LRT 2025 — tik 19% šauktinių išlaiko pirmą LAF testo. Ši programa sprendžia šią problemą.")}
              </div>
            </Card>
          </div>
        )}

        {/* USERS */}
        {activeSection === "users" && (
          <div>
            <SectionHeader icon="👥" title={t("Target Users & Age Groups", "Tikslinė Grupė ir Amžius")} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {ageGroups.map((ag, i) => (
                <div key={i} style={{ background: ag.bg, border: `2px solid ${ag.border}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: ag.color }}>{ag.range}</div>
                  <div style={{ fontWeight: 700, color: ag.color, fontSize: 14 }}>{t(ag.label, ag.labelLT)}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>{t(ag.goal, ag.goalLT)}</div>
                  <div style={{ marginTop: 12, fontSize: 12 }}>
                    <span style={{ background: ag.color, color: "white", borderRadius: 6, padding: "3px 8px", marginRight: 6 }}>📅 {ag.frequency}</span>
                    <span style={{ background: "#e2e8f0", color: "#475569", borderRadius: 6, padding: "3px 8px" }}>⏱ {ag.rest}</span>
                  </div>
                </div>
              ))}
            </div>
            <Card title={t("User Onboarding Flow", "Vartotojo Pradžia")}>
              <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "8px 0" }}>
                {[
                  { step: "1", label: t("Enter Age", "Įvesti Amžių"), icon: "🎂" },
                  { step: "2", label: t("Select Gender", "Pasirinkti Lytį"), icon: "👤" },
                  { step: "3", label: t("Fitness Level", "Pajėgumo Lygis"), icon: "📊" },
                  { step: "4", label: t("Language", "Kalba"), icon: "🌐" },
                  { step: "5", label: t("Set Wake Time", "Pabudimo Laikas"), icon: "⏰" },
                  { step: "6", label: t("Start Plan", "Pradėti Planą"), icon: "🚀" },
                ].map((s, i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ textAlign: "center", minWidth: 90 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1e3a5f", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 6px" }}>{s.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1e3a5f" }}>Step {s.step}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
                    </div>
                    {i < arr.length - 1 && <div style={{ color: "#cbd5e1", fontSize: 20, margin: "0 4px", marginBottom: 16 }}>→</div>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* EXERCISES */}
        {activeSection === "exercises" && (
          <div>
            <SectionHeader icon="💪" title={t("Exercise Library by Age", "Pratimų Biblioteka pagal Amžių")} />
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {ageGroups.map((ag, i) => (
                <button key={i} onClick={() => setActiveAge(i)} style={{
                  padding: "8px 18px", borderRadius: 20, border: `2px solid ${ag.color}`, cursor: "pointer", fontWeight: 700,
                  background: activeAge === i ? ag.color : "white", color: activeAge === i ? "white" : ag.color, fontSize: 14
                }}>
                  {ag.range}
                </button>
              ))}
            </div>
            {ageGroups[activeAge] && (
              <div>
                <div style={{ background: ageGroups[activeAge].bg, border: `2px solid ${ageGroups[activeAge].border}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, color: ageGroups[activeAge].color, fontSize: 16 }}>
                    {t(ageGroups[activeAge].label, ageGroups[activeAge].labelLT)} — Age {ageGroups[activeAge].range}
                  </div>
                  <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{t(ageGroups[activeAge].goal, ageGroups[activeAge].goalLT)}</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>
                    📅 {ageGroups[activeAge].frequency} &nbsp;|&nbsp; ⏱ Rest: {ageGroups[activeAge].rest}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {ageGroups[activeAge].exercises.map((ex, i) => (
                    <div key={i} style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${ageGroups[activeAge].color}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 18 }}>{ex.icon}</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginTop: 4 }}>{ex.name}</div>
                        </div>
                        <div style={{ background: ageGroups[activeAge].bg, color: ageGroups[activeAge].color, borderRadius: 8, padding: "4px 10px", fontWeight: 700, fontSize: 13 }}>{ex.sets}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>🎯 {ex.target}</div>
                      <div style={{ marginTop: 10, background: "#f0fdf4", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#16a34a" }}>
                        🖼️ {t("Illustration: Form guide + breathing cue", "Iliustracija: Formos vadovas + kvėpavimo patarimas")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {activeSection === "schedule" && (
          <div>
            <SectionHeader icon="📅" title={t("Scheduled Workouts (Weekly Plan)", "Treniruočių Grafikas (Savaitinis Planas)")} />
            <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
              {weekSchedule.map((day, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 16, borderLeft: `5px solid ${day.color}` }}>
                  <div style={{ minWidth: 52, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: day.color }}>{day.day}</div>
                  </div>
                  <div style={{ fontSize: 24 }}>{day.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{day.type}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{day.focus}</div>
                  </div>
                  <div style={{ background: day.color + "22", color: day.color, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{day.type}</div>
                </div>
              ))}
            </div>
            <Card title={t("Progressive Overload Plan (12 Weeks)", "Progresyvaus Apkrovimo Planas (12 Savaičių)")}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { phase: t("Weeks 1–4", "1–4 Savaitė"), name: t("Foundation", "Pagrindas"), desc: t("Build baseline. Master form. 3–4 sets, 60–90s rest.", "Ugdyti pagrindą. Forma pirma. 3–4 serijos, 60–90s poilsis."), color: "#22c55e" },
                  { phase: t("Weeks 5–8", "5–8 Savaitė"), name: t("Volume", "Apimtis"), desc: t("Add 1 set. Cut rest by 15s. Increase reps +2 every week.", "Pridėti 1 seriją. Sutrumpinti poilsį 15s. Reps +2 kas savaitę."), color: "#3b82f6" },
                  { phase: t("Weeks 9–12", "9–12 Savaitė"), name: t("Test Prep", "Testo Paruošimas"), desc: t("Simulate LAF test weekly. Max-effort sets. Taper last week.", "Kas savaitę simuliuoti LAF testą. Pilnas intensyvumas."), color: "#ef4444" },
                ].map((phase, i) => (
                  <div key={i} style={{ background: phase.color + "11", border: `2px solid ${phase.color}33`, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: 1 }}>{phase.phase}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", marginTop: 4 }}>{phase.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>{phase.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* DAILY */}
        {activeSection === "daily" && (
          <div>
            <SectionHeader icon="🌅" title={t("Daily Routine", "Dienos Rutina")} />
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 46, top: 0, bottom: 0, width: 2, background: "#e2e8f0", zIndex: 0 }} />
              {dailyRoutine.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, position: "relative", zIndex: 1 }}>
                  <div style={{ minWidth: 56, textAlign: "right", paddingTop: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{item.time}</span>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, boxShadow: "0 0 0 3px white, 0 0 0 4px " + item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ background: "white", borderRadius: 12, padding: "12px 16px", flex: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURES */}
        {activeSection === "features" && (
          <div>
            <SectionHeader icon="⚙️" title={t("App Features", "Programėlės Funkcijos")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {appFeatures.map((cat, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 12, borderBottom: "2px solid #e2e8f0", paddingBottom: 8 }}>{cat.cat}</div>
                  {cat.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: "#475569" }}>
                      <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UI */}
        {activeSection === "ui" && (
          <div>
            <SectionHeader icon="📱" title={t("UI / Mobile Design Requirements", "UI / Mobilaus Dizaino Reikalavimai")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { icon: "📱", title: t("Mobile First", "Mobilioji Pirma"), items: [t("Min touch target 44×44px", "Min lietimo tikslas 44×44px"), t("Thumb-friendly bottom nav", "Navigacija apačioje"), t("No horizontal scroll", "Be horizontalaus slinkimo"), t("Font ≥16px on mobile", "Šriftas ≥16px")] },
                { icon: "🌙", title: t("Theme", "Tema"), items: [t("Dark & Light mode toggle", "Tamsus ir šviesus režimas"), t("Military green/navy palette", "Kariška žalia/tamsiai mėlyna spalva"), t("High contrast for outdoor use", "Didelis kontrastas lauke"), t("Flag color accents (LT)", "Vėliavos spalvų akcentai")] },
                { icon: "♿", title: t("Accessibility", "Prieinamumas"), items: [t("WCAG 2.1 AA compliance", "WCAG 2.1 AA standartai"), t("Screen reader support", "Ekrano skaitytuvo palaikymas"), t("Large text option", "Didelio teksto parinktis"), t("Color-blind safe palette", "Saugi spalvų akliems paletė")] },
                { icon: "🔌", title: t("Offline / PWA", "Offline / PWA"), items: [t("Works offline (no internet needed for workouts)", "Veikia offline"), t("Installable from browser", "Įdiegiama iš naršyklės"), t("Sync when reconnected", "Sinchronizuojasi po ryšio"), t("< 2s load time target", "< 2s kraunamasi")] },
              ].map((block, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{block.icon}</div>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>{block.title}</div>
                  {block.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 12, color: "#475569", marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: "#2563eb" }}>→</span> {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Mock screen preview */}
            <Card title={t("App Screen Map", "Programėlės Ekranų Žemėlapis")}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  ["🏠", t("Home / Today", "Pradžia / Šiandien")],
                  ["💪", t("Workout", "Treniruotė")],
                  ["📅", t("Schedule", "Grafikas")],
                  ["📊", t("Progress", "Pažanga")],
                  ["🖼️", t("Exercise Guide", "Pratimų Vadovas")],
                  ["🎭", t("Skip/Cheat Day", "Praleisti/Ilsėtis")],
                  ["🔔", t("Notifications", "Pranešimai")],
                  ["👤", t("Profile", "Profilis")],
                  ["⚙️", t("Settings", "Nustatymai")],
                ].map(([icon, label], i) => (
                  <div key={i} style={{ background: "#f1f5f9", borderRadius: 10, padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span style={{ color: "#1e293b", fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ILLUSTRATIONS */}
        {activeSection === "illustrations" && (
          <div>
            <SectionHeader icon="🖼️" title={t("Image Illustration Requirements", "Iliustracijų Reikalavimai")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
              {[
                { ex: "Push-up", icon: "💪", views: ["Side view — full form", "Top view — hand placement", "❌ Common error: sagging hips"] },
                { ex: "Sit-up", icon: "🔥", views: ["Side view — spine neutral", "Feet position detail", "❌ Common error: neck pull"] },
                { ex: "3km Run", icon: "🏃", views: ["Posture & arm swing", "Foot strike pattern", "Breathing rhythm icon"] },
                { ex: "Plank", icon: "🧱", views: ["Side view — body line", "Hip height indicator", "❌ Common error: raised hips"] },
                { ex: "Squat", icon: "🦵", views: ["Front & side view", "Knee-toe alignment", "Depth indicator arrow"] },
                { ex: "Pull-up", icon: "🏋️", views: ["Grip width guide", "Full range of motion", "Scaled: inverted row"] },
              ].map((card, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8, background: "#f1f5f9", borderRadius: 8, padding: "12px 0" }}>{card.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 10, textAlign: "center" }}>{card.ex}</div>
                  {card.views.map((v, j) => (
                    <div key={j} style={{ fontSize: 11, color: v.startsWith("❌") ? "#dc2626" : "#475569", marginBottom: 5, display: "flex", gap: 5 }}>
                      <span>{v.startsWith("❌") ? "" : "📸"}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Card title={t("Illustration Spec", "Iliustracijų Specifikacija")}>
              {[
                [t("Format", "Formatas"), "SVG animated (Lottie) + static PNG fallback"],
                [t("Style", "Stilius"), t("Flat military illustration, gender-neutral silhouette", "Plokšias karinis stilius, lyčiai neutralus siluetas")],
                [t("Age Variants", "Amžiaus Variantai"), t("3 avatar builds: lean (25–30), medium (31–40), broader (41–50)", "3 avataro tipai pagal amžiaus grupes")],
                [t("Overlay", "Perdanga"), t("Red X for errors, green checkmark for correct form", "Raudona X klaidoms, žalia ✓ teisingai formai")],
                [t("Cues", "Signalai"), t("Breathing icons (inhale/exhale) per rep phase", "Kvėpavimo piktogramos kiekvienai fazei")],
                [t("Size", "Dydis"), "Max 150KB per illustration (performance)"],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 5 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ minWidth: 120, fontSize: 12, fontWeight: 700, color: "#1e3a5f" }}>{label}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{val}</div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* TECH */}
        {activeSection === "tech" && (
          <div>
            <SectionHeader icon="🛠️" title={t("Technical Stack", "Techninė Dalis")} />
            <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
              {techStack.map((row, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "grid", gridTemplateColumns: "120px 200px 1fr", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{row.layer}</div>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13 }}>{row.tech}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{row.why}</div>
                </div>
              ))}
            </div>
            <Card title={t("Development Phases", "Kūrimo Fazės")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { phase: "Phase 1", time: t("Weeks 1–4", "1–4 Savaitė"), title: t("MVP", "MVP"), items: [t("User onboarding + age profile", "Vartotojo profilis"), t("Static exercise library + illustrations", "Pratimų biblioteka"), t("Basic 7-day schedule", "7 dienų grafikas"), t("Skip/Cheat day toggle", "Praleisti/Ilsėtis"), t("LT + EN language switch", "Kalbų perjungimas")] },
                  { phase: "Phase 2", time: t("Weeks 5–8", "5–8 Savaitė"), title: t("Progress & Notifications", "Pažanga ir Pranešimai"), items: [t("Progress charts", "Pažangos grafikai"), t("Push notifications", "Push pranešimai"), t("Daily routine reminders", "Dienos priminiai"), t("LAF readiness score", "LAF pasirengimo balas"), t("PWA offline mode", "Offline režimas")] },
                  { phase: "Phase 3", time: t("Weeks 9–12", "9–12 Savaitė"), title: t("Polish & Launch", "Tobulinimas ir Paleidimas"), items: [t("Animated exercise illustrations", "Animuotos iliustracijos"), t("12-week progressive plan", "12 savaičių planas"), t("User accounts + cloud sync", "Paskyros + sinchronizacija"), t("Performance optimization", "Optimizavimas"), t("Beta testing with conscripts", "Beta testavimas")] },
                  { phase: "Phase 4", time: t("Post-launch", "Po Paleidimo"), title: t("Growth", "Augimas"), items: [t("Community leaderboard", "Bendruomenės lentelė"), t("Video integration", "Vaizdo integracija"), t("Riflemen's Union partnership", "Šaulių Sąjunga partnerystė"), t("Android/iOS native wrapper", "Natyvus wrapper"), t("Analytics & A/B testing", "Analitika")] },
                ].map((p, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontWeight: 800, color: "#1e3a5f" }}>{p.phase}: {p.title}</span>
                      <span style={{ fontSize: 11, color: "#64748b", background: "#e2e8f0", borderRadius: 6, padding: "2px 8px" }}>{p.time}</span>
                    </div>
                    {p.items.map((item, j) => (
                      <div key={j} style={{ fontSize: 12, color: "#475569", marginBottom: 5, display: "flex", gap: 6 }}>
                        <span style={{ color: "#16a34a" }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 20px", background: "#1e3a5f", borderRadius: 14, color: "white", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🇱🇹 LAF Fit — Requirements v1.0</div>
            <div style={{ opacity: 0.7, marginTop: 2 }}>Project Analyst Document · June 2026 · Confidential Draft</div>
          </div>
          <div style={{ opacity: 0.7, textAlign: "right" }}>
            <div>Target: Pass LAF fitness test</div>
            <div>Ages 25–50 · LT + EN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e3a5f", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>{icon}</span> {title}
      </h2>
      <div style={{ height: 3, background: "linear-gradient(90deg, #1e3a5f, #2d6a4f, transparent)", borderRadius: 2, marginTop: 8 }} />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
