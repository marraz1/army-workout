import { useState } from "react";

// ─── Color tokens ─────────────────────────────────────────────────────────
const C = {
  body:    "#b0bec5",  // base grey muscle tone
  outline: "#78909c",  // dark outline
  bone:    "#cfd8dc",  // lighter inner definition
  primary: "#e53935",  // red — primary muscle highlighted
  secondary:"#fb8c00", // orange — secondary muscle highlighted
  bg:      "#f8fafc",
};

// ─────────────────────────────────────────────────────────────────────────
// FRONT TORSO icon — chest / shoulders / abs / obliques / traps
// ─────────────────────────────────────────────────────────────────────────
function FrontTorso({ highlight = [] }) {
  const h = (id) => highlight.includes(id);
  const col = (id, fallback = C.body) => h(id) ? (highlight[0] === id ? C.primary : C.secondary) : fallback;
  // primary = first item, secondary = rest
  const isPrimary = (id) => highlight[0] === id;
  const fill = (id) => h(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body;

  return (
    <svg viewBox="0 0 80 90" width="80" height="90" style={{ display: "block" }}>
      {/* Neck */}
      <rect x="33" y="2" width="14" height="12" rx="4" fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Traps */}
      <path d="M 33,8 C 28,10 18,14 16,22 C 20,20 28,18 33,14 Z" fill={fill("traps")} stroke={C.outline} strokeWidth="1" />
      <path d="M 47,8 C 52,10 62,14 64,22 C 60,20 52,18 47,14 Z" fill={fill("traps")} stroke={C.outline} strokeWidth="1" />

      {/* Shoulders */}
      <ellipse cx="13" cy="28" rx="9" ry="10" fill={fill("shoulders")} stroke={C.outline} strokeWidth="1.2" />
      <ellipse cx="67" cy="28" rx="9" ry="10" fill={fill("shoulders")} stroke={C.outline} strokeWidth="1.2" />

      {/* Chest left */}
      <path d="M 22,20 C 16,22 14,30 16,38 C 20,42 32,42 36,38 C 38,32 36,22 30,20 Z"
        fill={fill("chest")} stroke={C.outline} strokeWidth="1.2" />
      {/* Chest right */}
      <path d="M 58,20 C 64,22 66,30 64,38 C 60,42 48,42 44,38 C 42,32 44,22 50,20 Z"
        fill={fill("chest")} stroke={C.outline} strokeWidth="1.2" />
      {/* Chest centre line */}
      <line x1="40" y1="20" x2="40" y2="42" stroke={C.outline} strokeWidth="1" />

      {/* Abs — 3 rows x 2 cols */}
      {[0,1,2].map(row => [0,1].map(col2 => (
        <rect key={`${row}-${col2}`}
          x={30 + col2 * 11} y={44 + row * 13} width={9} height={11} rx={3}
          fill={fill("abs")} stroke={C.outline} strokeWidth="1" />
      )))}

      {/* Obliques */}
      <path d="M 22,44 C 16,50 14,60 16,72 C 20,76 28,74 30,68 C 32,58 28,48 22,44 Z"
        fill={fill("obliques")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,44 C 64,50 66,60 64,72 C 60,76 52,74 50,68 C 48,58 52,48 58,44 Z"
        fill={fill("obliques")} stroke={C.outline} strokeWidth="1.2" />

      {/* Lower torso / hip */}
      <path d="M 30,82 C 26,84 22,88 22,90 L 58,90 C 58,88 54,84 50,82 C 46,80 34,80 30,82 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BACK TORSO icon — traps / lats / rear delts / lower back
// ─────────────────────────────────────────────────────────────────────────
function BackTorso({ highlight = [] }) {
  const isPrimary = (id) => highlight[0] === id;
  const fill = (id) => highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body;

  return (
    <svg viewBox="0 0 80 90" width="80" height="90" style={{ display: "block" }}>
      {/* Neck */}
      <rect x="33" y="2" width="14" height="12" rx="4" fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Traps upper */}
      <path d="M 33,8 C 24,12 16,18 16,26 C 22,22 32,18 40,18 C 48,18 58,22 64,26 C 64,18 56,12 47,8 Z"
        fill={fill("traps")} stroke={C.outline} strokeWidth="1.2" />

      {/* Rear delts */}
      <ellipse cx="12" cy="30" rx="9" ry="10" fill={fill("rear_delt")} stroke={C.outline} strokeWidth="1.2" />
      <ellipse cx="68" cy="30" rx="9" ry="10" fill={fill("rear_delt")} stroke={C.outline} strokeWidth="1.2" />

      {/* Lats */}
      <path d="M 21,28 C 16,34 14,50 16,62 C 20,70 30,74 36,70 C 40,62 40,44 38,30 Z"
        fill={fill("lats")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 59,28 C 64,34 66,50 64,62 C 60,70 50,74 44,70 C 40,62 40,44 42,30 Z"
        fill={fill("lats")} stroke={C.outline} strokeWidth="1.2" />

      {/* Rhomboids / mid back */}
      <path d="M 38,28 C 35,34 34,50 36,60 L 44,60 C 46,50 45,34 42,28 Z"
        fill={fill("lower_back")} stroke={C.outline} strokeWidth="1" />

      {/* Lower back / lumbar */}
      <path d="M 30,68 C 26,72 24,80 24,90 L 56,90 C 56,80 54,72 50,68 C 46,64 34,64 30,68 Z"
        fill={fill("lower_back")} stroke={C.outline} strokeWidth="1.2" />

      {/* Spine line */}
      <line x1="40" y1="20" x2="40" y2="72" stroke={C.outline} strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FRONT LEGS icon — quads / hip flexors / adductors / calves
// ─────────────────────────────────────────────────────────────────────────
function FrontLegs({ highlight = [] }) {
  const isPrimary = (id) => highlight[0] === id;
  const fill = (id) => highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body;

  return (
    <svg viewBox="0 0 80 110" width="70" height="110" style={{ display: "block" }}>
      {/* Hip / pelvis */}
      <path d="M 14,4 C 10,8 8,16 10,22 L 40,26 L 70,22 C 72,16 70,8 66,4 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Hip flexors */}
      <path d="M 18,20 C 14,24 12,30 14,36 C 18,38 26,36 28,30 C 30,24 26,20 18,20 Z"
        fill={fill("hip_flexors")} stroke={C.outline} strokeWidth="1" />
      <path d="M 62,20 C 66,24 68,30 66,36 C 62,38 54,36 52,30 C 50,24 54,20 62,20 Z"
        fill={fill("hip_flexors")} stroke={C.outline} strokeWidth="1" />

      {/* Quads left */}
      <path d="M 14,34 C 10,40 9,58 11,72 C 14,78 22,80 26,76 C 32,68 32,48 30,36 C 26,32 18,32 14,34 Z"
        fill={fill("quads")} stroke={C.outline} strokeWidth="1.2" />
      {/* Quad definition left */}
      <path d="M 20,38 C 16,46 16,62 20,70" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Quads right */}
      <path d="M 66,34 C 70,40 71,58 69,72 C 66,78 58,80 54,76 C 48,68 48,48 50,36 C 54,32 62,32 66,34 Z"
        fill={fill("quads")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 60,38 C 64,46 64,62 60,70" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Adductors / inner thigh */}
      <path d="M 30,36 C 32,44 34,60 36,74 L 40,76 L 44,74 C 46,60 48,44 50,36 C 46,30 34,30 30,36 Z"
        fill={fill("adductors")} stroke={C.outline} strokeWidth="1" />

      {/* Knee caps */}
      <ellipse cx="22" cy="78" rx="8" ry="5" fill={C.bone} stroke={C.outline} strokeWidth="1" />
      <ellipse cx="58" cy="78" rx="8" ry="5" fill={C.bone} stroke={C.outline} strokeWidth="1" />

      {/* Calves front (tibialis) */}
      <path d="M 15,84 C 11,90 11,102 15,108 C 19,112 25,110 27,104 C 29,96 27,86 23,82 Z"
        fill={fill("calves")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 65,84 C 69,90 69,102 65,108 C 61,112 55,110 53,104 C 51,96 53,86 57,82 Z"
        fill={fill("calves")} stroke={C.outline} strokeWidth="1.2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BACK LEGS icon — glutes / hamstrings / calves
// ─────────────────────────────────────────────────────────────────────────
function BackLegs({ highlight = [] }) {
  const isPrimary = (id) => highlight[0] === id;
  const fill = (id) => highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body;

  return (
    <svg viewBox="0 0 80 110" width="70" height="110" style={{ display: "block" }}>
      {/* Hip / pelvis */}
      <path d="M 14,4 C 10,8 8,16 10,22 L 40,24 L 70,22 C 72,16 70,8 66,4 Z"
        fill={C.bone} stroke={C.outline} strokeWidth="1.2" />

      {/* Glutes */}
      <path d="M 12,18 C 8,24 8,38 14,46 C 20,52 34,52 38,44 C 40,36 38,22 32,16 C 26,12 16,14 12,18 Z"
        fill={fill("glutes")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 68,18 C 72,24 72,38 66,46 C 60,52 46,52 42,44 C 40,36 42,22 48,16 C 54,12 64,14 68,18 Z"
        fill={fill("glutes")} stroke={C.outline} strokeWidth="1.2" />
      {/* Glute crease */}
      <path d="M 18,42 C 24,48 36,48 38,44" stroke={C.outline} strokeWidth="0.8" fill="none" />
      <path d="M 62,42 C 56,48 44,48 42,44" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Hamstrings */}
      <path d="M 14,50 C 10,58 10,72 14,82 C 18,88 28,88 32,82 C 36,72 34,56 30,48 C 24,44 16,46 14,50 Z"
        fill={fill("hamstrings")} stroke={C.outline} strokeWidth="1.2" />
      {/* Hamstring biceps femoris line */}
      <path d="M 22,52 C 20,62 20,74 22,82" stroke={C.outline} strokeWidth="0.8" fill="none" />

      <path d="M 66,50 C 70,58 70,72 66,82 C 62,88 52,88 48,82 C 44,72 46,56 50,48 C 56,44 64,46 66,50 Z"
        fill={fill("hamstrings")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,52 C 60,62 60,74 58,82" stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Back of calves (gastrocnemius) */}
      <path d="M 14,86 C 10,94 10,106 15,110 C 20,114 28,110 30,102 C 32,92 28,84 22,82 Z"
        fill={fill("calves")} stroke={C.outline} strokeWidth="1.2" />
      {/* Calf split line */}
      <path d="M 22,86 C 20,92 19,102 20,108" stroke={C.outline} strokeWidth="0.8" fill="none" />

      <path d="M 66,86 C 70,94 70,106 65,110 C 60,114 52,110 50,102 C 48,92 52,84 58,82 Z"
        fill={fill("calves")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 58,86 C 60,92 61,102 60,108" stroke={C.outline} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ARM icon — biceps / triceps / forearms
// ─────────────────────────────────────────────────────────────────────────
function ArmIcon({ highlight = [], side = "front" }) {
  const isPrimary = (id) => highlight[0] === id;
  const fill = (id) => highlight.includes(id) ? (isPrimary(id) ? C.primary : C.secondary) : C.body;

  return (
    <svg viewBox="0 0 44 100" width="44" height="100" style={{ display: "block" }}>
      {/* Shoulder cap */}
      <ellipse cx="22" cy="10" rx="14" ry="12" fill={fill("shoulders")} stroke={C.outline} strokeWidth="1.2" />

      {/* Upper arm */}
      <path d={side === "front"
        ? "M 10,18 C 6,26 6,48 10,58 C 14,64 22,64 28,60 C 34,54 36,34 34,20 C 30,14 14,14 10,18 Z"
        : "M 10,18 C 6,26 6,48 10,58 C 14,64 22,64 28,60 C 34,54 36,34 34,20 C 30,14 14,14 10,18 Z"}
        fill={fill(side === "front" ? "biceps" : "triceps")} stroke={C.outline} strokeWidth="1.2" />
      {/* Muscle definition line */}
      <path d={side === "front"
        ? "M 18,20 C 14,30 14,48 18,58"
        : "M 22,20 C 26,30 26,48 22,58"}
        stroke={C.outline} strokeWidth="0.8" fill="none" />

      {/* Elbow */}
      <ellipse cx="22" cy="62" rx="10" ry="6" fill={C.bone} stroke={C.outline} strokeWidth="1" />

      {/* Forearm */}
      <path d="M 12,66 C 9,74 9,88 13,96 C 17,100 27,100 31,96 C 35,88 35,74 32,66 Z"
        fill={fill("forearms")} stroke={C.outline} strokeWidth="1.2" />
      <path d="M 18,68 C 16,78 16,90 18,96" stroke={C.outline} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Exercise → muscle icon mapping
// ─────────────────────────────────────────────────────────────────────────
const exercises = [
  {
    name: "Push-Up",
    category: "LAF",
    icons: [
      { component: FrontTorso, highlight: ["chest", "shoulders", "traps"] },
      { component: ArmIcon,    highlight: ["triceps"], props: { side: "back" } },
    ],
    tag: "Chest · Triceps · Shoulders",
  },
  {
    name: "Pull-Up",
    category: "LAF",
    icons: [
      { component: BackTorso,  highlight: ["lats", "traps"] },
      { component: ArmIcon,    highlight: ["biceps"], props: { side: "front" } },
    ],
    tag: "Lats · Biceps · Traps",
  },
  {
    name: "Dips",
    category: "LAF",
    icons: [
      { component: FrontTorso, highlight: ["chest", "shoulders"] },
      { component: ArmIcon,    highlight: ["triceps", "forearms"], props: { side: "back" } },
    ],
    tag: "Triceps · Chest · Shoulders",
  },
  {
    name: "Squat",
    category: "LAF",
    icons: [
      { component: FrontLegs,  highlight: ["quads", "hip_flexors"] },
      { component: BackLegs,   highlight: ["glutes", "hamstrings"] },
    ],
    tag: "Quads · Glutes · Hamstrings",
  },
  {
    name: "Plank",
    category: "LAF",
    icons: [
      { component: FrontTorso, highlight: ["abs", "obliques"] },
      { component: BackTorso,  highlight: ["lower_back"] },
    ],
    tag: "Abs · Core · Lower Back",
  },
  {
    name: "Lunge",
    category: "LAF",
    icons: [
      { component: FrontLegs,  highlight: ["quads", "hip_flexors"] },
      { component: BackLegs,   highlight: ["glutes", "hamstrings"] },
    ],
    tag: "Quads · Glutes · Hamstrings",
  },
  {
    name: "Burpee",
    category: "LAF",
    icons: [
      { component: FrontTorso, highlight: ["chest", "abs"] },
      { component: FrontLegs,  highlight: ["quads", "calves"] },
    ],
    tag: "Full Body",
  },
  {
    name: "Muscle-Up",
    category: "Calisthenics",
    icons: [
      { component: BackTorso,  highlight: ["lats", "traps"] },
      { component: FrontTorso, highlight: ["chest", "shoulders"] },
    ],
    tag: "Lats · Chest · Triceps",
  },
  {
    name: "Pistol Squat",
    category: "Calisthenics",
    icons: [
      { component: FrontLegs,  highlight: ["quads", "hip_flexors"] },
      { component: BackLegs,   highlight: ["glutes"] },
    ],
    tag: "Quads · Glutes · Balance",
  },
  {
    name: "L-Sit",
    category: "Calisthenics",
    icons: [
      { component: FrontTorso, highlight: ["abs", "obliques"] },
      { component: FrontLegs,  highlight: ["hip_flexors", "quads"] },
    ],
    tag: "Abs · Hip Flexors · Triceps",
  },
  {
    name: "Handstand",
    category: "Calisthenics",
    icons: [
      { component: FrontTorso, highlight: ["shoulders", "traps"] },
      { component: ArmIcon,    highlight: ["triceps", "forearms"], props: { side: "back" } },
    ],
    tag: "Shoulders · Core · Triceps",
  },
  {
    name: "Nordic Curl",
    category: "Calisthenics",
    icons: [
      { component: BackLegs,   highlight: ["hamstrings", "glutes"] },
    ],
    tag: "Hamstrings · Glutes",
  },
  {
    name: "Front Lever",
    category: "Calisthenics",
    icons: [
      { component: BackTorso,  highlight: ["lats", "lower_back"] },
      { component: FrontTorso, highlight: ["abs"] },
    ],
    tag: "Lats · Core · Rear Delts",
  },
  {
    name: "Human Flag",
    category: "Calisthenics",
    icons: [
      { component: BackTorso,  highlight: ["lats"] },
      { component: FrontTorso, highlight: ["obliques", "abs"] },
    ],
    tag: "Lats · Obliques · Shoulders",
  },
  {
    name: "Pike Push-Up",
    category: "Calisthenics",
    icons: [
      { component: FrontTorso, highlight: ["shoulders", "traps"] },
      { component: ArmIcon,    highlight: ["triceps"], props: { side: "back" } },
    ],
    tag: "Shoulders · Triceps · Upper Back",
  },
  {
    name: "Dragon Flag",
    category: "Calisthenics",
    icons: [
      { component: FrontTorso, highlight: ["abs", "obliques"] },
      { component: BackTorso,  highlight: ["lower_back", "lats"] },
    ],
    tag: "Abs · Lats · Core",
  },
];

const categoryColor = { LAF: "#1e3a5f", Calisthenics: "#7c3aed" };
const categoryBg    = { LAF: "#dbeafe",  Calisthenics: "#f5f3ff" };

// ─────────────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]   = useState("All");

  const filtered = filter === "All" ? exercises : exercises.filter(e => e.category === filter);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1e3a5f,#7c3aed)", color: "white", padding: "20px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>LAF Workout App — v2.0</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🦾 Muscle Group Icons</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            Flat icon template · Each exercise card shows which muscles will be trained
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["All", "LAF", "Calisthenics"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                background: filter === f ? "#1e3a5f" : "#e2e8f0",
                color:      filter === f ? "white"   : "#475569" }}>
              {f === "LAF" ? "🎖 LAF" : f === "Calisthenics" ? "🤸 Calisthenics" : "All"}
            </button>
          ))}
        </div>

        {/* Exercise cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {filtered.map((ex) => (
            <div key={ex.name}
              onClick={() => setSelected(selected === ex.name ? null : ex.name)}
              style={{ background: "white", borderRadius: 16, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                border: `2px solid ${selected === ex.name ? categoryColor[ex.category] : "#f1f5f9"}`,
                cursor: "pointer", transition: "all 0.2s" }}>

              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}>{ex.name}</div>
                <span style={{ background: categoryBg[ex.category], color: categoryColor[ex.category], borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                  {ex.category}
                </span>
              </div>

              {/* Muscle icons */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "flex-end", marginBottom: 12, minHeight: 90 }}>
                {ex.icons.map((ic, i) => {
                  const Comp = ic.component;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <Comp highlight={ic.highlight} {...(ic.props || {})} />
                    </div>
                  );
                })}
              </div>

              {/* Muscle tag */}
              <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                💪 {ex.tag}
              </div>
            </div>
          ))}
        </div>

        {/* ── Icon reference sheet ────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1e3a5f", marginBottom: 4 }}>Icon Reference Sheet</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>
            Every body-part icon at a glance — red = primary muscle, orange = secondary
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>

            {/* Front torso — chest highlighted */}
            <IconRef label="Chest" comp={<FrontTorso highlight={["chest"]} />} />
            <IconRef label="Abs / Core" comp={<FrontTorso highlight={["abs"]} />} />
            <IconRef label="Obliques" comp={<FrontTorso highlight={["obliques"]} />} />
            <IconRef label="Shoulders" comp={<FrontTorso highlight={["shoulders"]} />} />
            <IconRef label="Traps (Front)" comp={<FrontTorso highlight={["traps"]} />} />

            {/* Back torso */}
            <IconRef label="Lats" comp={<BackTorso highlight={["lats"]} />} />
            <IconRef label="Traps (Back)" comp={<BackTorso highlight={["traps"]} />} />
            <IconRef label="Rear Delts" comp={<BackTorso highlight={["rear_delt"]} />} />
            <IconRef label="Lower Back" comp={<BackTorso highlight={["lower_back"]} />} />

            {/* Front legs */}
            <IconRef label="Quads" comp={<FrontLegs highlight={["quads"]} />} />
            <IconRef label="Hip Flexors" comp={<FrontLegs highlight={["hip_flexors"]} />} />
            <IconRef label="Adductors" comp={<FrontLegs highlight={["adductors"]} />} />

            {/* Back legs */}
            <IconRef label="Glutes" comp={<BackLegs highlight={["glutes"]} />} />
            <IconRef label="Hamstrings" comp={<BackLegs highlight={["hamstrings"]} />} />
            <IconRef label="Calves" comp={<BackLegs highlight={["calves"]} />} />

            {/* Arms */}
            <IconRef label="Biceps" comp={<ArmIcon highlight={["biceps"]} side="front" />} />
            <IconRef label="Triceps" comp={<ArmIcon highlight={["triceps"]} side="back" />} />
            <IconRef label="Forearms" comp={<ArmIcon highlight={["forearms"]} side="front" />} />
          </div>
        </div>

        {/* ── Colour legend ───────────────────────────────────────────── */}
        <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 12 }}>Colour System</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { color: C.primary,   label: "Primary muscle",   desc: "Main muscle group trained" },
              { color: C.secondary, label: "Secondary muscle",  desc: "Supporting / stabilising" },
              { color: C.body,      label: "Not activated",     desc: "Unworked muscle group" },
              { color: C.bone,      label: "Joint / bone",      desc: "Structural reference" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: row.color, border: `1.5px solid ${C.outline}` }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#1e293b" }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{row.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Helper: icon reference cell ─────────────────────────────────────────
function IconRef({ label, comp }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px", border: "1px solid #e2e8f0" }}>
        {comp}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", textAlign: "center" }}>{label}</div>
    </div>
  );
}
