import { useState } from "react";

// ─── What changed vs v1.0 ──────────────────────────────────────────────────
// v1.0 built: Exercise Library, Weekly Schedule, Daily Routine, App Features,
//             UI/Mobile, Illustrations, Tech Stack — all DONE, not repeated here.
//
// v1.1 DELTA adds 3 new functional flows + touches 4 existing screens:
//   NEW  → Plan Customisation   (new screen + modal)
//   NEW  → Workout Logger       (new screen)
//   NEW  → History & Progress   (new screen + sub-views)
//   EDIT → Exercise card        (+Edit button + Custom badge)
//   EDIT → Day schedule card    (+Edit Plan entry point)
//   EDIT → App Features list    (+3 new feature categories)
//   EDIT → Database schema      (+3 new tables)
// ──────────────────────────────────────────────────────────────────────────

const sections = [
  { id: "delta",    icon: "🔄", title: "What Changed (Delta)",     titleLT: "Kas Pasikeitė" },
  { id: "planedit", icon: "✏️", title: "Plan Customisation",       titleLT: "Plano Keitimas" },
  { id: "logger",   icon: "📝", title: "Workout Logger",           titleLT: "Treniruotės Įrašas" },
  { id: "history",  icon: "📈", title: "History & Progress",       titleLT: "Istorija ir Pažanga" },
  { id: "touches",  icon: "🔧", title: "Existing Screen Changes",  titleLT: "Esami Ekranų Pakeitimai" },
  { id: "db",       icon: "🗄️", title: "Database Changes",        titleLT: "DB Pakeitimai" },
];

// ─── Delta summary ─────────────────────────────────────────────────────────
const deltaRows = [
  { type: "NEW",   area: "Screen",         item: "Plan Customisation",                desc: "Entirely new screen + scope modal",                     color: "#16a34a" },
  { type: "NEW",   area: "Screen",         item: "Workout Logger",                    desc: "Entirely new screen + session summary",                 color: "#16a34a" },
  { type: "NEW",   area: "Screen",         item: "History & Progress",                desc: "New screen with 6 sub-views",                          color: "#16a34a" },
  { type: "EDIT",  area: "Exercise Card",  item: "Edit button + Custom badge",        desc: "Add ✏️ Edit button; show ✏️ Custom badge when modified",color: "#2563eb" },
  { type: "EDIT",  area: "Schedule Card",  item: "Edit Plan entry point",             desc: "Tap day → Edit Plan option visible in day detail",      color: "#2563eb" },
  { type: "EDIT",  area: "Session Screen", item: "Start + Log buttons",               desc: "Add Start Session / Log Result CTAs to workout view",   color: "#2563eb" },
  { type: "EDIT",  area: "App Features",   item: "3 new feature categories",          desc: "Plan Customisation, Workout Logger, Progress Analytics",color: "#2563eb" },
  { type: "NEW",   area: "Database",       item: "3 new tables",                      desc: "workout_plans, session_sets, run_logs, personal_bests", color: "#16a34a" },
  { type: "EDIT",  area: "Database",       item: "workout_sessions extended",         desc: "Add energy_rating, notes, total_duration_min columns",  color: "#2563eb" },
  { type: "NO CHG",area: "Exercise Library","item": "No change",                      desc: "v1.0 exercise data unchanged",                          color: "#94a3b8" },
  { type: "NO CHG",area: "Daily Routine",  item: "No change",                         desc: "v1.0 timeline unchanged",                              color: "#94a3b8" },
  { type: "NO CHG",area: "Illustrations",  item: "No change",                         desc: "v1.0 illustration spec unchanged",                     color: "#94a3b8" },
];

// ─── Plan Customisation ────────────────────────────────────────────────────
const planEditFields = [
  { field: "Sets",          icon: "🔢", type: "number",  example: "3 → 4",       rule: "Min 1, Max 8 per exercise", fieldLT: "Serijos" },
  { field: "Reps / Count",  icon: "🔁", type: "number",  example: "20 → 30",     rule: "Min 1, Max 200",            fieldLT: "Kartojimai" },
  { field: "Goal Target",   icon: "🎯", type: "text",    example: "≥41 → ≥50",   rule: "Free text or numeric",      fieldLT: "Tikslas" },
  { field: "Rest Time (s)", icon: "⏱", type: "number",  example: "60s → 45s",   rule: "Min 15s, Max 300s",         fieldLT: "Poilsio Laikas" },
  { field: "Run Goal Time", icon: "🏃", type: "time",    example: "15:30 → 14:50",rule: "MM:SS, min 08:00",         fieldLT: "Bėgimo Tikslas" },
  { field: "Add Exercise",  icon: "➕", type: "select",  example: "+ Jump Squats",rule: "From library or custom",   fieldLT: "Pridėti Pratimą" },
  { field: "Remove Exercise",icon:"🗑️",type: "action",  example: "Remove Burpees",rule:"Confirm prompt required",  fieldLT: "Pašalinti" },
  { field: "Reset to Default",icon:"↩️",type: "action", example: "Revert all",   rule: "Confirmation modal",        fieldLT: "Grąžinti Numatytąjį" },
];

const planEditFlow = [
  { step:"1", icon:"📅", label:"Open Day",       detail:"Tap any scheduled day in weekly plan" },
  { step:"2", icon:"✏️", label:"Tap Edit",       detail:"Edit Plan button in top-right of day card" },
  { step:"3", icon:"🔢", label:"Modify Fields",  detail:"Sets, reps, goal, rest — inline inputs" },
  { step:"4", icon:"💾", label:"Save",           detail:"Save locks edits for this exercise" },
  { step:"5", icon:"📋", label:"Scope Choice",   detail:"Modal: This workout only / All future" },
  { step:"6", icon:"✅", label:"Confirmed",      detail:"Custom badge appears on modified exercise" },
];

// ─── Workout Logger ────────────────────────────────────────────────────────
const loggerFields = [
  { field:"Set Completion",   fieldLT:"Serijos Atlikimas", icon:"✅", type:"toggle",       desc:"Green ✓ = done / Red ✗ = skipped per set",                          color:"#22c55e" },
  { field:"Actual Reps Done", fieldLT:"Realūs Kartojimai", icon:"🔢", type:"number input", desc:"Tap +/− or type the count achieved in each set",                     color:"#3b82f6" },
  { field:"Run Time Achieved",fieldLT:"Bėgimo Rezultatas", icon:"⏱", type:"time input",   desc:"MM:SS entry — auto-compared against goal time",                       color:"#f97316" },
  { field:"Session Note",     fieldLT:"Seanso Pastaba",    icon:"📝", type:"text area",    desc:"Free-text note max 300 chars: how felt, pain, conditions",            color:"#8b5cf6" },
  { field:"Energy Level",     fieldLT:"Energijos Lygis",   icon:"⚡", type:"emoji scale",  desc:"1–5 emoji: 😴 Exhausted → 💪 Energised",                            color:"#eab308" },
  { field:"Session Status",   fieldLT:"Statusas",          icon:"🎭", type:"select",       desc:"Completed / Partial / Skipped / Cheat Day",                          color:"#ec4899" },
];

const loggerFlow = [
  { step:"1", icon:"📅", label:"Today's Workout",  detail:"Home screen shows today's scheduled exercises" },
  { step:"2", icon:"▶️", label:"Start Session",    detail:"Tap Start → timer begins, first exercise shown" },
  { step:"3", icon:"✅", label:"Log Each Set",     detail:"After each set: ✓/✗ toggle + type actual reps" },
  { step:"4", icon:"⏭",  label:"Next Exercise",   detail:"Rest timer counts down → auto-advances" },
  { step:"5", icon:"🏁", label:"Finish Session",   detail:"All exercises done → summary screen shown" },
  { step:"6", icon:"📝", label:"Add Notes",        detail:"Optional: energy emoji + free-text note" },
  { step:"7", icon:"💾", label:"Save to History",  detail:"Session saved with timestamp + all set data" },
];

// ─── History & Progress ────────────────────────────────────────────────────
const historyViews = [
  { view:"Calendar Heatmap",    viewLT:"Kalendoriaus Žemėlapis", icon:"📆", color:"#16a34a", desc:"Monthly grid — each day coloured by status. Tap any day → session detail.",    detail:"Green/Yellow/Red/Purple/Cyan/Grey" },
  { view:"Exercise Charts",     viewLT:"Pratimų Grafikai",       icon:"📊", color:"#2563eb", desc:"Line graph per exercise: reps over time, run time over time.",                  detail:"Toggle push-ups / sit-ups / run / all" },
  { view:"LAF Readiness Score", viewLT:"LAF Pasirengimo Balas",  icon:"🏆", color:"#f97316", desc:"% bar for each LAF standard. Auto-updated after every saved session.",         detail:"<60% Fail · 60–79% Pass · 80%+ Good" },
  { view:"Personal Bests",      viewLT:"Asmeniniai Rekordai",    icon:"⭐", color:"#eab308", desc:"All-time max reps, fastest run, longest plank. Date + session link shown.",    detail:"PB badge on session detail view" },
  { view:"Session History List",viewLT:"Seansų Sąrašas",         icon:"📋", color:"#8b5cf6", desc:"Scrollable list — date, status badge, total reps summary. Tap → detail.",      detail:"Filterable by date range or status" },
  { view:"Weekly Summary",      viewLT:"Savaitės Suvestinė",     icon:"📅", color:"#06b6d4", desc:"Auto-generated Monday: 7-day volume, completed vs skipped, vs prior week.",   detail:"Triggered by push notification" },
];

const sessionDetailFields = [
  { label:"Date & Time",         icon:"🕐", desc:"Exact timestamp of session start and finish" },
  { label:"Exercises Completed", icon:"✅", desc:"List of each exercise with set-by-set actual reps" },
  { label:"vs. Plan",            icon:"🎯", desc:"Side-by-side: planned reps vs. actual reps per set" },
  { label:"Run Result",          icon:"🏃", desc:"Actual time vs. goal time — delta shown (+/−)" },
  { label:"LAF % Achieved",      icon:"🏆", desc:"Readiness score calculated from this session" },
  { label:"Energy Rating",       icon:"⚡", desc:"Emoji rating logged at end of session" },
  { label:"Session Notes",       icon:"📝", desc:"Free-text notes saved with this session" },
  { label:"Personal Bests",      icon:"⭐", desc:"Badge shown if any PB was set in this session" },
];

// ─── Existing screen changes ───────────────────────────────────────────────
const screenTouches = [
  {
    screen: "Exercise Card (Exercise Library)",
    screenLT: "Pratimo Kortelė",
    icon: "💪",
    color: "#2563eb",
    changes: [
      { type: "ADD",    item: "✏️ Edit button",      desc: "Top-right corner of each exercise card. Opens Plan Customisation for that exercise only." },
      { type: "ADD",    item: "✏️ Custom badge",     desc: "Yellow badge shown when user has modified this exercise from its age-group default." },
      { type: "ADD",    item: "Default values line", desc: "Below the custom values, show a muted line: 'Default was: 4×30, Goal: ≥41' for reference." },
    ],
  },
  {
    screen: "Day Schedule Card (Scheduled Workouts)",
    screenLT: "Dienos Kortelė",
    icon: "📅",
    color: "#f97316",
    changes: [
      { type: "ADD",    item: "Edit Plan button",     desc: "Visible when user taps/expands a day card. Navigates to Plan Customisation scoped to that day." },
      { type: "ADD",    item: "Start Session button", desc: "On workout days (not Rest/Recovery): primary CTA to open the Workout Logger." },
      { type: "ADD",    item: "Session status badge", desc: "After logging: show Completed / Partial / Skipped badge on the day card." },
    ],
  },
  {
    screen: "Home / Today Screen",
    screenLT: "Pradžios Ekranas",
    icon: "🏠",
    color: "#16a34a",
    changes: [
      { type: "ADD",    item: "Today's session card", desc: "Summary card: today's day type, exercises count, ▶ Start button, last session result if already done." },
      { type: "ADD",    item: "LAF score widget",     desc: "Small readiness % bar on home screen. Tapping navigates to full History & Progress." },
      { type: "ADD",    item: "Streak counter",       desc: "Shows current consecutive days trained. Resets after 3 skips." },
    ],
  },
  {
    screen: "App Features List",
    screenLT: "Funkcijų Sąrašas",
    icon: "⚙️",
    color: "#9333ea",
    changes: [
      { type: "ADD",    item: "Plan Customisation category",  desc: "New category with 4 items: edit sets/reps/rest/goal, run goal, add/remove exercise, reset to default." },
      { type: "ADD",    item: "Workout Logger category",      desc: "New category: per-set logging, actual vs planned, run time, notes, energy rating, session status." },
      { type: "EXTEND", item: "Progress & Analytics extended",desc: "Extend existing category: add session drill-down, personal bests, heatmap, LAF readiness score." },
    ],
  },
];

// ─── DB changes ────────────────────────────────────────────────────────────
const dbNew = [
  { table:"workout_plans",   status:"NEW",    fields:"user_id, exercise_id, sets, reps, goal_target, rest_sec, run_goal_time, is_custom, scope", note:"One row per exercise per user plan. is_custom=true when user deviated from age-group default." },
  { table:"session_sets",    status:"NEW",    fields:"set_id, session_id, exercise_id, set_number, planned_reps, actual_reps, completed (bool)", note:"One row per set per session. Links session → individual set results." },
  { table:"run_logs",        status:"NEW",    fields:"run_id, session_id, distance_km, goal_time_sec, actual_time_sec",                          note:"Separate table for run results. Allows delta vs goal time calculation." },
  { table:"personal_bests",  status:"NEW",    fields:"pb_id, user_id, exercise_id, metric, value, session_id, date",                            note:"Auto-updated on session save when a new max is detected." },
  { table:"workout_sessions",status:"EXTEND", fields:"+ energy_rating (1–5), + notes (text), + total_duration_min (int)",                       note:"3 new columns added to existing table. Existing rows: all nullable defaults." },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("delta");
  const [lang, setLang] = useState("EN");
  const t = (en, lt) => (lang === "LT" ? lt : en);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)", color: "white", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 960, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Update Requirements</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>🇱🇹 LAF Workout App — v1.1 Delta</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Changes only · Built on top of v1.0 · June 2026</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>
              v1.0 ✓ Built &nbsp;→&nbsp; v1.1 🔧 Delta
            </div>
            <button onClick={() => setLang(lang === "EN" ? "LT" : "EN")}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              {lang === "EN" ? "🇱🇹 LT" : "🇬🇧 EN"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px" }}>

        {/* Nav pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeSection === s.id ? "#1e3a5f" : "#e2e8f0",
                color: activeSection === s.id ? "white" : "#475569",
                transition: "all 0.2s",
              }}>
              {s.icon} {t(s.title, s.titleLT)}
            </button>
          ))}
        </div>

        {/* ══ DELTA OVERVIEW ════════════════════════════════════════════ */}
        {activeSection === "delta" && (
          <div>
            <SectionHeader icon="🔄" title={t("What Changed — v1.0 → v1.1","Kas Pasikeitė — v1.0 → v1.1")} />

            <div style={{ background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>📌</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("Scope of this document","Šio dokumento apimtis")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t(
                    "v1.0 is already built. This document covers ONLY the additions and changes needed for v1.1: three new screens (Plan Customisation, Workout Logger, History & Progress), four existing screens that need small additions, and three new database tables. Nothing from v1.0 needs to be rebuilt.",
                    "v1.0 jau sukurta. Šis dokumentas apima TIK v1.1 papildymus: tris naujus ekranus, keturių esamų ekranų pakeitimus ir tris naujas DB lenteles. Nieko iš v1.0 nereikia perdaryti."
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { type: "NEW",    color: "#16a34a", bg: "#f0fdf4", desc: "Brand new — build from scratch" },
                { type: "EDIT",   color: "#2563eb", bg: "#eff6ff", desc: "Existing screen — add to it" },
                { type: "NO CHG", color: "#94a3b8", bg: "#f8fafc", desc: "Already built — leave as-is" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: l.bg, border: `1px solid ${l.color}33`, borderRadius: 8, padding: "6px 12px" }}>
                  <span style={{ background: l.color, color: "white", borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 800 }}>{l.type}</span>
                  <span style={{ fontSize: 12, color: "#475569" }}>{l.desc}</span>
                </div>
              ))}
            </div>

            {/* Delta table */}
            <Card title={t("Full Change Log","Pilnas Pakeitimų Žurnalas")}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#1e3a5f", color: "white" }}>
                      {["Type","Area","Item","Description"].map((h,i)=>(
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deltaRows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                        <td style={{ padding: "9px 12px" }}>
                          <span style={{ background: row.color, color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>{row.type}</span>
                        </td>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: "#1e3a5f", fontSize: 12 }}>{row.area}</td>
                        <td style={{ padding: "9px 12px", fontWeight: 600, color: "#334155", fontSize: 12 }}>{row.item}</td>
                        <td style={{ padding: "9px 12px", color: "#64748b", fontSize: 12 }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Flow diagram */}
            <Card title={t("New User Flow — How the 3 screens connect","Naujas Vartotojo Srautas — Kaip sujungiami 3 ekranai")}>
              <div style={{ overflowX: "auto", padding: "8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 700 }}>
                  {[
                    { icon:"📅", label:"Schedule / Day Card",    sub:"existing",  color:"#2563eb" },
                    { arrow:"→" },
                    { icon:"✏️", label:"Plan Customisation",     sub:"NEW",       color:"#16a34a" },
                    { arrow:"→" },
                    { icon:"💾", label:"Saved Custom Plan",       sub:"DB",        color:"#9333ea" },
                    { arrow:"→" },
                    { icon:"▶️", label:"Start Session",          sub:"existing + START button",   color:"#2563eb" },
                    { arrow:"→" },
                    { icon:"📝", label:"Workout Logger",          sub:"NEW",       color:"#16a34a" },
                    { arrow:"→" },
                    { icon:"📈", label:"History & Progress",     sub:"NEW",       color:"#16a34a" },
                  ].map((item, i) =>
                    item.arrow ? (
                      <div key={i} style={{ color: "#cbd5e1", fontSize: 22, margin: "0 6px", flexShrink: 0 }}>→</div>
                    ) : (
                      <div key={i} style={{ textAlign: "center", minWidth: 110, flexShrink: 0 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: item.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 6px" }}>{item.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{item.label}</div>
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{item.sub}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══ PLAN CUSTOMISATION ════════════════════════════════════════ */}
        {activeSection === "planedit" && (
          <div>
            <SectionHeader icon="✏️" title={t("Plan Customisation — New Screen","Plano Keitimas — Naujas Ekranas")} />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "No equivalent exists in v1.0. Entry point is the Edit Plan button added to the existing day schedule card (see Existing Screen Changes tab).",
                "v1.0 tokio ekrano nėra. Įėjimo taškas — mygtukas 'Redaguoti planą', pridėtas prie esamos dienos kortelės."
              )}
              color="#16a34a" bg="#f0fdf4" border="#86efac"
            />

            {/* Edit flow */}
            <Card title={t("Edit Flow — 6 Steps","Keitimo Eiga — 6 Žingsniai")}>
              <FlowStepper steps={planEditFlow} color="#1e3a5f" />
            </Card>

            {/* Editable fields */}
            <Card title={t("Editable Fields","Redaguojami Laukai")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {planEditFields.map((f, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13 }}>{t(f.field, f.fieldLT)}</div>
                      <span style={{ marginLeft: "auto", background: "#e2e8f0", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{f.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 4 }}>e.g. {f.example}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Rule: {f.rule}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Scope modal */}
            <Card title={t("Scope Selection Modal","Taikymo Srities Modalas")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                {[
                  { scope: t("This workout only","Tik šiai treniruotei"), icon:"1️⃣", color:"#f97316",
                    desc: t("Applies today only. Next session reverts to the stored plan.","Galioja tik šiandien. Kitas seansas naudos išsaugotą planą.") },
                  { scope: t("All future workouts","Visos būsimos treniruotės"), icon:"♾️", color:"#2563eb",
                    desc: t("Becomes the new personal default. Overwrites age-group defaults for this user.","Tampa nauju asmeniniu numatytuoju. Perrašo amžiaus grupės numatytuosius.") },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.color + "11", border: `2px solid ${s.color}33`, borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, color: s.color, fontSize: 14, marginBottom: 8 }}>{s.scope}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", background: "#fef9c3", borderRadius: 8, fontSize: 12, color: "#854d0e" }}>
                ↩️ {t("Reset to Default: always visible. Requires confirmation modal. Clears is_custom flag in workout_plans table.","Grąžinti numatytąjį: visada matomas. Reikia patvirtinimo. Išvalo is_custom žymę workout_plans lentelėje.")}
              </div>
            </Card>

            {/* Custom badge spec */}
            <Card title={t("Custom Badge — Visual Spec","Custom Ženkliukas — Vizualinė Spec")}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: "4px solid #16a34a", minWidth: 220 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>💪 Push-ups</div>
                    <span style={{ background: "#fef9c3", color: "#854d0e", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>✏️ Custom</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>5×35 &nbsp;·&nbsp; Goal: ≥50</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Default: 4×30 · Goal: ≥41</div>
                </div>
                <div style={{ fontSize: 13, color: "#475569", flex: 1, minWidth: 220 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>{t("Badge logic:","Ženkliuko logika:")}</div>
                  <div style={{ marginBottom: 6 }}>✏️ <b>Custom</b> badge — any exercise where is_custom = true</div>
                  <div style={{ marginBottom: 6 }}>🔒 No badge — exercise matches age-group default exactly</div>
                  <div style={{ marginBottom: 6 }}>📋 Default line — always shown below current values for reference</div>
                  <div>↩️ Reset clears badge + reverts values to defaults</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══ WORKOUT LOGGER ════════════════════════════════════════════ */}
        {activeSection === "logger" && (
          <div>
            <SectionHeader icon="📝" title={t("Workout Logger — New Screen","Treniruotės Įrašas — Naujas Ekranas")} />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "No equivalent exists in v1.0. Entry point is the Start Session button added to the existing day schedule card.",
                "v1.0 tokio ekrano nėra. Įėjimo taškas — mygtukas 'Pradėti seansą', pridėtas prie dienos kortelės."
              )}
              color="#16a34a" bg="#f0fdf4" border="#86efac"
            />

            <Card title={t("Logging Flow — 7 Steps","Įrašymo Eiga — 7 Žingsniai")}>
              <FlowStepper steps={loggerFlow} color="#16a34a" />
            </Card>

            <Card title={t("Input Fields Per Session","Įvesties Laukai Kiekvienam Seansui")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {loggerFields.map((f, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${f.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                      <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>{t(f.field, f.fieldLT)}</div>
                      <span style={{ marginLeft: "auto", background: f.color + "22", color: f.color, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{f.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Set logging card mockup */}
            <Card title={t("UI Mockup — Single Set Logging Card","UI Maketas — Vienos Serijos Kortelė")}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", width: 320, border: "1px solid #e2e8f0", flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#1e3a5f" }}>💪 Push-ups</div>
                    <div style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", borderRadius: 6, padding: "3px 10px" }}>Set 2 / 4</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
                    📋 Plan: <b>30 reps</b> &nbsp;·&nbsp; ⏱ Rest after: <b>60s</b>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Actual reps:</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>−</button>
                      <div style={{ width: 64, height: 36, borderRadius: 8, border: "2px solid #1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#1e3a5f" }}>28</div>
                      <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f1f5f9", fontSize: 18, cursor: "pointer" }}>+</button>
                      <div style={{ fontSize: 12, color: "#ea580c", fontWeight: 700 }}>−2 vs plan</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "2px solid #22c55e", background: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✓ Done</button>
                    <button style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "2px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✗ Skip</button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14, marginBottom: 12 }}>{t("Behaviour notes:","Elgsenos pastabos:")}</div>
                  {[
                    "−2 delta shown in orange when actual < planned",
                    "+N delta shown in green when actual > planned",
                    "Tapping ✗ Skip saves 0 reps for that set and marks completed=false",
                    "Rest timer starts automatically after Done or Skip",
                    "User can override rest timer duration mid-session",
                    "Swipe left on any completed set to re-log it",
                  ].map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 12, color: "#475569" }}>
                      <span style={{ color: "#1e3a5f", fontWeight: 700, flexShrink: 0 }}>→</span> {note}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Session summary */}
            <Card title={t("Session Summary Screen — shown after last exercise","Seanso Suvestinė — rodoma po paskutinio pratimo")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[
                  { label:t("Total Reps","Visi Kartojimai"),     value:"187 / 210 planned", delta:"−23", ok:false, icon:"🔢" },
                  { label:t("Sets Done","Atliktos Serijos"),      value:"11 / 12 sets",      delta:"−1",  ok:false, icon:"✅" },
                  { label:t("Run Time","Bėgimo Laikas"),          value:"15:12 / 15:30 goal",delta:"−18s",ok:true,  icon:"🏃" },
                  { label:t("LAF Score","LAF Balas"),             value:"74% readiness",     delta:"+3%", ok:true,  icon:"🏆" },
                ].map((row, i) => (
                  <div key={i} style={{ background: row.ok ? "#f0fdf4" : "#fff7ed", borderRadius: 12, padding: 14, border: `1px solid ${row.ok ? "#86efac" : "#fed7aa"}` }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{row.icon}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{row.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", marginTop: 2 }}>{row.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: row.ok ? "#16a34a" : "#ea580c", marginTop: 2 }}>{row.delta} vs plan</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "#1e3a5f", color: "white", borderRadius: 10, padding: "12px 0", textAlign: "center", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>💾 {t("Save to History","Išsaugoti")}</div>
                <div style={{ background: "#f1f5f9", color: "#475569", borderRadius: 10, padding: "12px 16px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>📝 {t("Add Note","Pridėti Pastabą")}</div>
              </div>
            </Card>
          </div>
        )}

        {/* ══ HISTORY & PROGRESS ════════════════════════════════════════ */}
        {activeSection === "history" && (
          <div>
            <SectionHeader icon="📈" title={t("History & Progress — New Screen","Istorija ir Pažanga — Naujas Ekranas")} />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "No equivalent exists in v1.0. Feeds directly from the Workout Logger. Entry point on Home screen via LAF score widget (tap → opens this screen).",
                "v1.0 tokio ekrano nėra. Duomenis gauna iš Treniruotės Įrašo. Įėjimo taškas — LAF balas pradžios ekrane."
              )}
              color="#16a34a" bg="#f0fdf4" border="#86efac"
            />

            {/* Views */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              {historyViews.map((v, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${v.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{v.icon}</span>
                    <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{t(v.view, v.viewLT)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{v.desc}</div>
                  <div style={{ fontSize: 11, color: v.color, fontWeight: 600, background: v.color + "11", borderRadius: 6, padding: "4px 8px", display: "inline-block" }}>→ {v.detail}</div>
                </div>
              ))}
            </div>

            {/* Session detail */}
            <Card title={t("Session Detail View — Drill-Down Fields","Seanso Detalės — Išsamūs Laukai")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {sessionDetailFields.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#f8fafc", borderRadius: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Heatmap legend */}
            <Card title={t("Calendar Heatmap — Colour Legend","Kalendoriaus Spalvų Legenda")}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { color:"#22c55e", label:t("Completed","Atlikta"),        sub:"All planned sets done" },
                  { color:"#eab308", label:t("Partial","Dalinai"),          sub:"Some sets skipped" },
                  { color:"#ef4444", label:t("Skipped","Praleista"),        sub:"Workout not done" },
                  { color:"#8b5cf6", label:t("Cheat Day","Ilsėjimosi"),     sub:"Logged rest day" },
                  { color:"#06b6d4", label:t("Active Recovery","Aktyvus"),  sub:"Light activity" },
                  { color:"#cbd5e1", label:t("Rest Day","Poilsis"),         sub:"Planned rest" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: c.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#1e293b" }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* LAF score calc */}
            <Card title={t("LAF Readiness Score — Calculation & Bands","LAF Balas — Skaičiavimas ir Juostos")}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {[
                  { ex:"Push-ups", target:"41", current:"35", pct:85, color:"#eab308" },
                  { ex:"Sit-ups",  target:"52", current:"50", pct:96, color:"#22c55e" },
                  { ex:"3km Run",  target:"15:30", current:"16:10", pct:72, color:"#f97316" },
                ].map((row, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, marginBottom: 10 }}>{row.ex}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>Target: <b>{row.target}</b> · Current: <b>{row.current}</b></div>
                    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: row.color, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: row.color }}>{row.pct}%</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { range:"< 60%",  label:t("Fail","Nepavyko"),    color:"#ef4444", bg:"#fef2f2" },
                  { range:"60–79%", label:t("Pass","Išlaikyta"),   color:"#eab308", bg:"#fefce8" },
                  { range:"80–99%", label:t("Good","Gerai"),       color:"#22c55e", bg:"#f0fdf4" },
                  { range:"100%+",  label:t("Excellent","Puikiai"),color:"#1e3a5f", bg:"#dbeafe" },
                ].map((r, i) => (
                  <div key={i} style={{ flex: 1, background: r.bg, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontWeight: 800, color: r.color, fontSize: 14 }}>{r.range}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ EXISTING SCREEN CHANGES ═══════════════════════════════════ */}
        {activeSection === "touches" && (
          <div>
            <SectionHeader icon="🔧" title={t("Existing Screen Changes","Esami Ekranų Pakeitimai")} />

            <div style={{ background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>🔧</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("These screens already exist in v1.0","Šie ekranai jau egzistuoja v1.0")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t(
                    "Do NOT rebuild these screens. Only add the specific elements listed below to each. Everything else on each screen stays exactly as built in v1.0.",
                    "NEKURKITE šių ekranų iš naujo. Tik pridėkite žemiau išvardytus elementus. Viskas kita lieka kaip v1.0."
                  )}
                </div>
              </div>
            </div>

            {screenTouches.map((screen, si) => (
              <Card key={si} title={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{screen.icon}</span>
                  <span>{t(screen.screen, screen.screenLT)}</span>
                  <span style={{ marginLeft: "auto", background: "#eff6ff", color: "#2563eb", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>EDIT</span>
                </div>
              }>
                <div style={{ display: "grid", gap: 10 }}>
                  {screen.changes.map((ch, ci) => (
                    <div key={ci} style={{ display: "flex", gap: 12, padding: "12px 14px", background: ch.type === "ADD" ? "#f0fdf4" : "#eff6ff", borderRadius: 10, border: `1px solid ${ch.type === "ADD" ? "#86efac" : "#bfdbfe"}`, alignItems: "flex-start" }}>
                      <span style={{ background: ch.type === "ADD" ? "#16a34a" : "#2563eb", color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{ch.type}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 3 }}>{ch.item}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{ch.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ══ DATABASE CHANGES ══════════════════════════════════════════ */}
        {activeSection === "db" && (
          <div>
            <SectionHeader icon="🗄️" title={t("Database Changes","Duomenų Bazės Pakeitimai")} />

            <div style={{ background: "#fdf4ff", border: "2px solid #d8b4fe", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>🗄️</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("4 new tables + 1 extended table","4 naujos lentelės + 1 išplėsta lentelė")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t(
                    "All existing v1.0 tables (users, exercises, schedules) remain unchanged. Only add the tables and columns listed below.",
                    "Visos esamos v1.0 lentelės (users, exercises, schedules) lieka nepakeistos. Tik pridėkite žemiau nurodytas lenteles ir stulpelius."
                  )}
                </div>
              </div>
            </div>

            <Card title={t("Schema Changes","Schemos Pakeitimai")}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#1e3a5f", color: "white" }}>
                      {["Status","Table","Fields / Columns","Notes"].map((h,i)=>(
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbNew.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white", verticalAlign: "top" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: row.status === "NEW" ? "#16a34a" : "#2563eb", color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{row.status}</span>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#9333ea", fontFamily: "monospace", whiteSpace: "nowrap" }}>{row.table}</td>
                        <td style={{ padding: "10px 12px", color: "#1e3a5f", fontFamily: "monospace", fontSize: 11 }}>{row.fields}</td>
                        <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 12 }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Relationships */}
            <Card title={t("Table Relationships","Lentelių Ryšiai")}>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { from:"workout_plans",   to:"users",            via:"user_id",     desc:"Each user has their own set of custom plan rows (one per exercise)" },
                  { from:"workout_sessions",to:"users",            via:"user_id",     desc:"Each session belongs to one user" },
                  { from:"session_sets",    to:"workout_sessions", via:"session_id",  desc:"Each set log belongs to one session" },
                  { from:"session_sets",    to:"exercises",        via:"exercise_id", desc:"Links logged set to the exercise definition" },
                  { from:"run_logs",        to:"workout_sessions", via:"session_id",  desc:"Each run log belongs to one session (max 1 per session)" },
                  { from:"personal_bests",  to:"workout_sessions", via:"session_id",  desc:"PB record links back to the session where it was achieved" },
                ].map((rel, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#9333ea", fontSize: 12 }}>{rel.from}</span>
                    <span style={{ color: "#cbd5e1" }}>→</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#2563eb", fontSize: 12 }}>{rel.to}</span>
                    <span style={{ background: "#e2e8f0", color: "#64748b", borderRadius: 5, padding: "1px 7px", fontSize: 11 }}>via {rel.via}</span>
                    <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>— {rel.desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Migration note */}
            <Card title={t("Migration Notes","Migracijos Pastabos")}>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "workout_sessions: add energy_rating (int, nullable), notes (text, nullable), total_duration_min (int, nullable) — all nullable so existing rows are unaffected",
                  "workout_plans: new table, no migration needed for existing users — on first login after update, auto-populate from age-group defaults with is_custom=false",
                  "personal_bests: new table, initially empty — first session save will populate",
                  "No existing tables dropped or columns removed",
                  "No existing foreign keys changed",
                ].map((note, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "#475569" }}>
                    <span style={{ color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>✓</span> {note}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 20px", background: "#1e3a5f", borderRadius: 14, color: "white", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🇱🇹 LAF Fit — Update Requirements v1.1</div>
            <div style={{ opacity: 0.7, marginTop: 2 }}>Delta only · Builds on v1.0 · June 2026</div>
          </div>
          <div style={{ opacity: 0.7, textAlign: "right" }}>
            <div>3 new screens · 4 screen edits</div>
            <div>4 DB tables · 1 DB extension</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Shared components ─────────────────────────────────────────────────────
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
      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function NewBadgeBanner({ title, desc, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `2px solid ${border}`, borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span style={{ background: color, color: "white", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>NEW</span>
      <div>
        <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#475569" }}>{desc}</div>
      </div>
    </div>
  );
}

function FlowStepper({ steps, color }) {
  return (
    <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "8px 0" }}>
      {steps.map((s, i, arr) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ textAlign: "center", minWidth: 100 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, margin: "0 auto 6px" }}>{s.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: color }}>Step {s.step}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, maxWidth: 90 }}>{s.detail}</div>
          </div>
          {i < arr.length - 1 && <div style={{ color: "#cbd5e1", fontSize: 20, margin: "0 2px", marginBottom: 28 }}>→</div>}
        </div>
      ))}
    </div>
  );
}
