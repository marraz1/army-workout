import { useState } from "react";

// ─── v2.0 DELTA ONLY ──────────────────────────────────────────────────────
// v1.0 built: Exercise Library, Schedule, Daily Routine, UI, Illustrations, Tech
// v1.1 built: Plan Customisation, Workout Logger, History & Progress
//
// v2.0 ADDS:
//   NEW  → Calisthenics Exercise Library  (separate section, 20 exercises)
//   NEW  → Calisthenics Training Planner  (add to plan: day, time, sets, results)
//   NEW  → Custom Exercise Builder        (user creates own exercise)
//   EDIT → History & Progress             (calisthenics results feed in)
//   EDIT → Home screen                    (calisthenics quick-access card)
//   EDIT → DB schema                      (3 new tables)
// ──────────────────────────────────────────────────────────────────────────

const sections = [
  { id: "delta",     icon: "🔄", title: "What Changed (Delta)",        titleLT: "Kas Pasikeitė" },
  { id: "library",   icon: "🤸", title: "Calisthenics Library",        titleLT: "Kalistenikų Biblioteka" },
  { id: "planner",   icon: "📋", title: "Training Planner",            titleLT: "Treniruočių Planuoklis" },
  { id: "custom",    icon: "🛠️", title: "Custom Exercise Builder",     titleLT: "Savo Pratimo Kūrėjas" },
  { id: "history",   icon: "📈", title: "History Changes",             titleLT: "Istorijos Pakeitimai" },
  { id: "touches",   icon: "🔧", title: "Existing Screen Changes",     titleLT: "Esami Ekranų Pakeitimai" },
  { id: "db",        icon: "🗄️", title: "Database Changes",           titleLT: "DB Pakeitimai" },
];

const deltaRows = [
  { type: "NEW",   area: "Screen",    item: "Calisthenics Library",        desc: "Separate section — 100 exercises, illustrated, filterable by level & muscle group", color: "#16a34a" },
  { type: "NEW",   area: "Screen",    item: "Training Planner",            desc: "Add any exercise to plan: pick day, time, sets, reps — saved to personal schedule", color: "#16a34a" },
  { type: "NEW",   area: "Feature",   item: "Logger extension",            desc: "Log calisthenics results (reps/hold time) same way as v1.1 logger — feeds history", color: "#16a34a" },
  { type: "NEW",   area: "Screen",    item: "Custom Exercise Builder",     desc: "User creates fully custom exercise: name, muscle group, sets, reps, illustration hint", color: "#16a34a" },
  { type: "EDIT",  area: "History",   item: "Calisthenics tab added",      desc: "New sub-tab in existing History screen — charts and PBs for calisthenics exercises", color: "#2563eb" },
  { type: "EDIT",  area: "Home",      item: "Calisthenics quick-card",     desc: "New card on home screen: today's planned calisthenics session (if any)", color: "#2563eb" },
  { type: "EDIT",  area: "Nav",       item: "New bottom nav entry",        desc: "Add 🤸 Calisthenics icon to bottom navigation bar", color: "#2563eb" },
  { type: "NEW",   area: "Database",  item: "calisthenics_exercises table",desc: "Master list of 20 exercises — seeded, not user-created", color: "#16a34a" },
  { type: "NEW",   area: "Database",  item: "calisthenics_plans table",    desc: "User's selected exercises with day, time, sets, reps, rest", color: "#16a34a" },
  { type: "NEW",   area: "Database",  item: "calisthenics_logs table",     desc: "Logged results per session per exercise — feeds history & PBs", color: "#16a34a" },
  { type: "NEW",   area: "Database",  item: "custom_exercises table",      desc: "User-created exercises — linked into planner same as library exercises", color: "#16a34a" },
  { type: "NO CHG",area: "v1.0 & v1.1","item":"Everything else",           desc: "LAF exercises, schedule, logger, history core — unchanged", color: "#94a3b8" },
];

// ─── Top 20 calisthenics exercises ────────────────────────────────────────
const B = { level:"Beginner",     levelColor:"#16a34a", levelBg:"#dcfce7" };
const I = { level:"Intermediate",  levelColor:"#2563eb", levelBg:"#dbeafe" };
const A = { level:"Advanced",      levelColor:"#9333ea", levelBg:"#f3e8ff" };

const calisthenicsExercises = [
  // ── BEGINNER — PUSH (1–8) ─────────────────────────────────────────────────
  { ...B, id:1,  name:"Push-Up",           icon:"💪", muscles:["Chest","Triceps","Shoulders","Core"],        desc:"Classic horizontal push. Hands shoulder-width, body straight, lower chest to floor.",                              sets:"3×10–20",  rest:"60s",  progressions:["Knee → Standard → Wide → Diamond → Archer"],             illustrationNotes:"Side view plank line. ❌ sagging hips." },
  { ...B, id:2,  name:"Wide Push-Up",      icon:"💪", muscles:["Chest","Shoulders","Core"],                  desc:"Hands wider than shoulder-width. Emphasises outer chest. Keep elbows at 45°.",                                  sets:"3×10–15",  rest:"60s",  progressions:["Standard PU → Wide → Wide pause → Wide archer"],         illustrationNotes:"Top view hand placement width indicator." },
  { ...B, id:3,  name:"Diamond Push-Up",   icon:"💎", muscles:["Triceps","Chest","Shoulders"],               desc:"Hands form a diamond under chest. Elbows track back. Intense tricep focus.",                                    sets:"3×8–12",   rest:"60s",  progressions:["Standard PU → Close-grip → Diamond → Tiger PU"],        illustrationNotes:"Top view hand diamond shape. ❌ flared elbows." },
  { ...B, id:4,  name:"Knee Push-Up",      icon:"🙏", muscles:["Chest","Triceps","Shoulders"],               desc:"Scaled push-up from knees. Same straight-body principle, reduced load.",                                        sets:"3×12–20",  rest:"45s",  progressions:["Knee → Incline → Standard"],                            illustrationNotes:"Side view showing knee-hip-shoulder angle." },
  { ...B, id:5,  name:"Incline Push-Up",   icon:"📐", muscles:["Chest","Triceps","Shoulders"],               desc:"Hands on elevated surface. Reduces bodyweight load. Good beginner entry point.",                                sets:"3×12–20",  rest:"45s",  progressions:["Incline → Standard → Decline"],                         illustrationNotes:"Side view angle of body vs surface. Height options." },
  { ...B, id:6,  name:"Decline Push-Up",   icon:"⬇️", muscles:["Upper Chest","Shoulders","Triceps"],         desc:"Feet elevated. Shifts load to upper chest and front delts.",                                                   sets:"3×8–15",   rest:"60s",  progressions:["Standard → Decline → Handstand PU"],                    illustrationNotes:"Side view foot height elevation. ❌ hip pike." },
  { ...B, id:7,  name:"Tricep Dip (Bench)",icon:"💺", muscles:["Triceps","Chest","Shoulders"],               desc:"Hands on bench, feet on floor. Lower until elbows at 90° then press up.",                                       sets:"3×10–15",  rest:"60s",  progressions:["Bench dip → Bar dip → Ring dip → Weighted dip"],        illustrationNotes:"Side view elbow angle indicator at 90°." },
  { ...B, id:8,  name:"Spiderman Push-Up", icon:"🕷️", muscles:["Chest","Core","Hip Flexors","Obliques"],    desc:"As you lower, bring one knee to same-side elbow. Alternate each rep. Great core rotation.", sets:"3×8/side", rest:"60s",  progressions:["Standard PU → Spiderman → Slow-tempo Spiderman"],       illustrationNotes:"Side view showing knee-to-elbow path arc." },

  // ── BEGINNER — PULL (9–12) ─────────────────────────────────────────────────
  { ...B, id:9,  name:"Dead Hang",         icon:"🙌", muscles:["Grip","Lats","Shoulders","Core"],             desc:"Hang from bar with full grip, shoulders active, body straight. Hold for time.",                                  sets:"3×20–45s", rest:"60s",  progressions:["Passive hang → Active hang → Scapular pulls → Bar PU"], illustrationNotes:"Front view. Active vs passive shoulder overlay." },
  { ...B, id:10, name:"Scapular Pull-Up",  icon:"🔼", muscles:["Lats","Lower Traps","Rhomboids"],             desc:"From dead hang, depress and retract shoulder blades without bending elbows.",                                  sets:"3×8–12",   rest:"60s",  progressions:["Dead hang → Scapular pull → Negative PU → Full PU"],   illustrationNotes:"Front view. Shoulder blade movement overlay animation." },
  { ...B, id:11, name:"Inverted Row",      icon:"↩️", muscles:["Upper Back","Biceps","Rear Delts","Core"],    desc:"Lie under bar, body straight, pull chest to bar. Adjust angle for difficulty.",                                 sets:"3×10–15",  rest:"60s",  progressions:["Feet down → Feet elevated → Feet on rings → Bar PU"],  illustrationNotes:"Side view body angle adjustment. ❌ hip sag." },
  { ...B, id:12, name:"Negative Pull-Up",  icon:"⬇️", muscles:["Lats","Biceps","Upper Back"],                desc:"Jump to top position, lower yourself as slowly as possible (3–5 sec). Builds pull strength.", sets:"3×3–5",   rest:"90s",  progressions:["Negative only → Banded PU → Full pull-up"],            illustrationNotes:"Side view descent timer overlay. Tempo markings." },

  // ── BEGINNER — LEGS (13–18) ───────────────────────────────────────────────
  { ...B, id:13, name:"Air Squat",         icon:"🦵", muscles:["Quads","Glutes","Hamstrings"],                desc:"Feet shoulder-width, toes slightly out. Sit back and down, chest tall, knees track toes.",                      sets:"3×15–20",  rest:"60s",  progressions:["Box squat → Air squat → Pause squat → Jump squat → Pistol"], illustrationNotes:"Front + side view. Knee-toe alignment overlay." },
  { ...B, id:14, name:"Lunge",             icon:"🚶", muscles:["Quads","Glutes","Hamstrings","Balance"],      desc:"Step forward, lower back knee toward floor. Front shin vertical. Drive back up.",                              sets:"3×10/leg", rest:"60s",  progressions:["Static → Walking → Reverse → Lateral → Bulgarian split squat"], illustrationNotes:"Side view step mechanics. ❌ knee caving." },
  { ...B, id:15, name:"Glute Bridge",      icon:"🌉", muscles:["Glutes","Hamstrings","Lower Back"],           desc:"Lie on back, feet flat, push hips to ceiling. Squeeze glutes at top, hold 1s.",                               sets:"3×15–20",  rest:"45s",  progressions:["Two-leg → Single-leg → Elevated → Hip thrust"],         illustrationNotes:"Side view hip arc. ❌ over-extended lower back." },
  { ...B, id:16, name:"Wall Sit",          icon:"🧱", muscles:["Quads","Glutes","Core"],                      desc:"Back flat on wall, thighs parallel to floor. Hold position. Knee-safe leg endurance.",                       sets:"3×30–60s", rest:"60s",  progressions:["Partial → Parallel → Single-leg wall sit"],             illustrationNotes:"Side view knee angle (90°). Timer overlay." },
  { ...B, id:17, name:"Step-Up",           icon:"⬆️", muscles:["Quads","Glutes","Hamstrings","Balance"],      desc:"Step onto box or bench, drive knee up, step back down. Alternate or same leg.",                               sets:"3×10/leg", rest:"60s",  progressions:["Low box → High box → Loaded step-up → Bulgarian"],      illustrationNotes:"Side view knee drive. Box height indicator." },
  { ...B, id:18, name:"Calf Raise",        icon:"🦶", muscles:["Calves","Ankle Stability"],                   desc:"Rise onto toes from flat-footed stance. Single or double leg. Slow tempo.",                                   sets:"3×15–25",  rest:"45s",  progressions:["Double → Single leg → Elevated single leg → Loaded"],   illustrationNotes:"Side view foot dorsiflexion range arc." },

  // ── BEGINNER — CORE (19–25) ──────────────────────────────────────────────
  { ...B, id:19, name:"Plank",             icon:"🧱", muscles:["Core","Shoulders","Glutes"],                  desc:"Forearms or hands, body rigid straight line. Hold for time. Full-body tension.",                               sets:"3×30–60s", rest:"45s",  progressions:["Knee → Standard → Elevated feet → RKC → Planche lean"], illustrationNotes:"Side view body line. ❌ raised hips." },
  { ...B, id:20, name:"Side Plank",        icon:"↔️", muscles:["Obliques","Core","Shoulders","Glutes"],       desc:"Lie on side, prop on forearm, body straight from head to feet. Hold.",                                        sets:"3×20–40s", rest:"45s",  progressions:["Knee side plank → Full → Hip dip → Star"],             illustrationNotes:"Front view body alignment. Hip sag indicator." },
  { ...B, id:21, name:"Mountain Climber",  icon:"⛰️", muscles:["Core","Shoulders","Hip Flexors","Cardio"],    desc:"Plank position, alternate driving knees to chest at pace. Keep hips level.",                                   sets:"3×20",     rest:"45s",  progressions:["Slow → Moderate → Fast → Cross-body → Spider"],         illustrationNotes:"Side view hip level line. ❌ hips rising." },
  { ...B, id:22, name:"Hollow Body Hold",  icon:"🍌", muscles:["Core","Hip Flexors","Quads"],                 desc:"Lie flat, press lower back to floor, arms overhead, raise legs 15–20 cm. Hold.",                             sets:"3×20–40s", rest:"45s",  progressions:["Tucked → Arms by sides → Arms overhead → Full"],        illustrationNotes:"Side view lower back press. Leg height 15 cm callout." },
  { ...B, id:23, name:"Flutter Kicks",     icon:"🌊", muscles:["Core","Hip Flexors","Quads"],                 desc:"Lie flat, legs slightly raised, alternate small kicks. Keep lower back pressed down.",                        sets:"3×20–30s", rest:"45s",  progressions:["Tucked → Straight legs → Flutter → Scissor kicks"],     illustrationNotes:"Side view leg height (15 cm). Lower back contact." },
  { ...B, id:24, name:"Superman Hold",     icon:"🦸", muscles:["Lower Back","Glutes","Upper Back"],           desc:"Lie face-down, simultaneously lift arms and legs off floor. Hold, then lower.",                               sets:"3×10–15",  rest:"45s",  progressions:["Short hold → Long hold → Swimmers → Back extension"],   illustrationNotes:"Side view body arc from ground. ❌ overextension." },
  { ...B, id:25, name:"Dead Bug",          icon:"🐞", muscles:["Core","Hip Flexors","Lower Back"],            desc:"Lie on back, arms up, knees at 90°. Extend opposite arm/leg while keeping lower back flat.",                  sets:"3×8/side", rest:"45s",  progressions:["Basic → Single limb → Double limb → With resistance"],  illustrationNotes:"Top view coordination pattern. Lower back contact overlay." },

  // ── BEGINNER — FULL BODY / CARDIO (26–30) ────────────────────────────────
  { ...B, id:26, name:"Burpee",            icon:"💥", muscles:["Full Body","Cardio","Core"],                  desc:"Squat down, kick feet back to plank, push-up, jump feet in, jump with arms overhead.",                        sets:"3×8–12",   rest:"60s",  progressions:["Step-back burpee → No push-up → Standard → 6-count → Chest-to-ground"], illustrationNotes:"Phase sequence diagram: 6 positions." },
  { ...B, id:27, name:"Jumping Jack",      icon:"⭐", muscles:["Cardio","Shoulders","Calves"],                desc:"Jump feet wide while raising arms overhead, return. Continuous rhythmic movement.",                           sets:"3×30s",    rest:"30s",  progressions:["Step-out → Jump → Cross-jack → Side-to-side"],          illustrationNotes:"Front view arm/leg sync positions." },
  { ...B, id:28, name:"High Knees",        icon:"🏃", muscles:["Hip Flexors","Core","Calves","Cardio"],       desc:"Run in place driving knees to hip height. Arms pump rhythmically.",                                          sets:"3×30s",    rest:"30s",  progressions:["March → Skip → High knees → Sprinting high knees"],     illustrationNotes:"Side view knee height indicator (hip level)." },
  { ...B, id:29, name:"Bear Crawl",        icon:"🐻", muscles:["Shoulders","Core","Quads","Cardio"],          desc:"Hands and feet, knees hovering just off floor. Move forward keeping hips low and level.",                    sets:"3×20m",    rest:"60s",  progressions:["Forward → Backward → Lateral → Loaded bear crawl"],     illustrationNotes:"Side view hip height (10 cm off floor). Spine neutral." },
  { ...B, id:30, name:"Inchworm",          icon:"🐛", muscles:["Hamstrings","Shoulders","Core","Mobility"],   desc:"Bend forward, walk hands out to plank, walk feet back to hands. Stretch + press.",                            sets:"3×8",      rest:"60s",  progressions:["Basic → With push-up → Extended → Spiderman crawl"],    illustrationNotes:"Side view 4-phase sequence diagram." },

  // ── INTERMEDIATE — PUSH (31–40) ──────────────────────────────────────────
  { ...I, id:31, name:"Dips",              icon:"💺", muscles:["Triceps","Chest","Shoulders"],                desc:"Parallel bars or bench. Lower until elbows 90°, press up. Slight forward lean for chest.", sets:"4×8–15",   rest:"90s",  progressions:["Bench → Bar → Ring dip → Weighted dip"],               illustrationNotes:"Side view elbow angle. Forward lean overlay." },
  { ...I, id:32, name:"Pike Push-Up",      icon:"🔺", muscles:["Shoulders","Triceps","Upper Back"],           desc:"Inverted V position, lower head toward floor between hands. Vertical push pattern.",        sets:"3×8–12",   rest:"75s",  progressions:["Pike PU → Elevated → Wall HSPU → Freestanding HSPU"], illustrationNotes:"Side view inverted V. ❌ flared elbows." },
  { ...I, id:33, name:"Archer Push-Up",    icon:"🏹", muscles:["Chest","Triceps","Shoulders","Core"],         desc:"Wide hands, shift weight to one arm while the other extends straight. Unilateral press.",     sets:"3×5–8/side",rest:"90s", progressions:["Wide PU → Archer → Pseudo planche → One-arm PU"],      illustrationNotes:"Top view weight shift angle indicator." },
  { ...I, id:34, name:"Pseudo Planche PU", icon:"📐", muscles:["Chest","Shoulders","Core","Wrists"],          desc:"Hands by hips, fingers backward, lean forward past hands. Intense shoulder/chest load.",      sets:"3×6–10",   rest:"90s",  progressions:["PU → Lean PU → Pseudo planche → Tuck planche"],        illustrationNotes:"Side view lean angle (20–30°). Wrist loading." },
  { ...I, id:35, name:"Hindu Push-Up",     icon:"🙏", muscles:["Chest","Shoulders","Triceps","Spine Mobility"],desc:"Flow from downward dog into low sweep and cobra. Continuous spinal wave motion.",            sets:"3×8–12",   rest:"75s",  progressions:["Slow → Fluid → Fast → Dive bomber variation"],          illustrationNotes:"Side view 4-phase wave motion sequence." },
  { ...I, id:36, name:"Typewriter Push-Up",icon:"⌨️", muscles:["Chest","Triceps","Shoulders","Core"],         desc:"Lower to one side, slide across bottom position to other side, press up.",                   sets:"3×5/side", rest:"90s",  progressions:["Wide PU → Typewriter → Archer → One-arm"],             illustrationNotes:"Top view lateral travel path." },
  { ...I, id:37, name:"Explosive Push-Up", icon:"💥", muscles:["Chest","Triceps","Shoulders","Fast Twitch"],  desc:"Lower controlled, then push explosively so hands leave the floor briefly.",                  sets:"3×6–10",   rest:"90s",  progressions:["Standard → Clap → Chest-tap → Superman PU"],           illustrationNotes:"Side view launch height indicator. Airtime callout." },
  { ...I, id:38, name:"Clap Push-Up",      icon:"👏", muscles:["Chest","Triceps","Shoulders","Power"],        desc:"Explosive push to gain air, clap hands, land with soft elbows.",                            sets:"3×5–8",    rest:"90s",  progressions:["Explosive PU → Clap → Double clap → Superman"],        illustrationNotes:"Side view flight arc. Clap timing callout." },
  { ...I, id:39, name:"Wall Handstand PU", icon:"🤸", muscles:["Shoulders","Triceps","Core"],                 desc:"Chest to wall handstand. Lower head to floor, press back up. Strict form.",               sets:"3×3–8",    rest:"120s", progressions:["Wall HS hold → Wall HSPU → Free HS → Free HSPU"],      illustrationNotes:"Side view head-to-floor range. Wall distance spec." },
  { ...I, id:40, name:"Ring Push-Up",      icon:"⭕", muscles:["Chest","Triceps","Shoulders","Stabilisers"],  desc:"Push-ups on gymnastic rings. Constant instability demands extra stabiliser activation.",    sets:"3×8–12",   rest:"75s",  progressions:["Fixed bar → Low ring → Standard ring → Ring dip"],     illustrationNotes:"Front view ring position width. Wrist turn callout." },

  // ── INTERMEDIATE — PULL (41–50) ──────────────────────────────────────────
  { ...I, id:41, name:"Pull-Up",           icon:"🏋️", muscles:["Lats","Biceps","Upper Back","Core"],          desc:"Overhand grip. Pull chin above bar. Full dead hang between reps. No kipping.",          sets:"4×5–10",   rest:"90s",  progressions:["Dead hang → Scapular → Negative → Banded → Full → Weighted"], illustrationNotes:"Grip width guide. Full ROM arc. ❌ kipping." },
  { ...I, id:42, name:"Chin-Up",           icon:"🔄", muscles:["Biceps","Lats","Chest"],                       desc:"Underhand grip, shoulder-width. Pull chin over bar. Full extension at bottom.",          sets:"4×5–10",   rest:"90s",  progressions:["Banded → Full → Close-grip → Weighted → One-arm assisted"], illustrationNotes:"Grip orientation vs pull-up comparison." },
  { ...I, id:43, name:"Wide Pull-Up",      icon:"↔️", muscles:["Lats","Upper Back","Rear Delts"],              desc:"Hands wider than shoulder-width. Emphasises lat width and upper back sweep.",           sets:"3×5–8",    rest:"90s",  progressions:["Standard PU → Wide → Extra-wide → Archer PU"],         illustrationNotes:"Front view hand-width guide. Lat activation callout." },
  { ...I, id:44, name:"Close-Grip PU",     icon:"🔼", muscles:["Biceps","Lats","Core"],                        desc:"Hands close together, overhand. Greater bicep and inner lat engagement.",               sets:"3×5–8",    rest:"90s",  progressions:["Standard → Close-grip → Chin-up → One-arm"],           illustrationNotes:"Front view close-hand position. Bicep peak." },
  { ...I, id:45, name:"Commando Pull-Up",  icon:"⚔️", muscles:["Lats","Biceps","Core","Obliques"],             desc:"Hands one in front of other. Alternate which side the head passes on each rep.",        sets:"3×4/side", rest:"90s",  progressions:["Standard → Neutral grip → Commando → Typewriter"],     illustrationNotes:"Front view head alternating side. Hand overlap." },
  { ...I, id:46, name:"L-Sit Pull-Up",     icon:"📐", muscles:["Core","Hip Flexors","Lats","Biceps"],          desc:"Maintain L-sit leg position throughout pull-up. Extreme core demand.",                   sets:"3×3–5",    rest:"120s", progressions:["Tuck L hang → L hang → L-sit PU → Strict L-sit PU"],   illustrationNotes:"Side view leg angle throughout ROM." },
  { ...I, id:47, name:"Toes-to-Bar",       icon:"🎯", muscles:["Core","Hip Flexors","Lats","Grip"],            desc:"Hang from bar, raise straight legs up to touch bar. Control the descent.",              sets:"3×5–10",   rest:"90s",  progressions:["Knee raise → Leg raise → Toes-to-bar → Strict"],       illustrationNotes:"Full ROM arc. ❌ swinging body." },
  { ...I, id:48, name:"Skin the Cat",      icon:"🐱", muscles:["Shoulders","Lats","Core","Flexibility"],       desc:"From hang, tuck and rotate legs up and over bar. Reverse to start. Shoulder mobility.", sets:"3×3–5",    rest:"120s", progressions:["Tuck german hang → Straddle → Full skin the cat"],     illustrationNotes:"Phase rotation arc (360° path)." },
  { ...I, id:49, name:"Archer Pull-Up",    icon:"🏹", muscles:["Lats","Biceps","Core"],                        desc:"Pull toward one hand while other arm extends straight. Unilateral pulling strength.",  sets:"3×3/side", rest:"120s", progressions:["Assisted → Wide PU → Archer → One-arm PU"],            illustrationNotes:"Top view pull-side vs extension-side." },
  { ...I, id:50, name:"Typewriter Pull-Up",icon:"⌨️", muscles:["Lats","Biceps","Core"],                        desc:"Pull to bar, traverse laterally across, lower on opposite side. Eccentric control.",   sets:"3×3/side", rest:"120s", progressions:["Wide PU → Typewriter → Archer → One-arm"],             illustrationNotes:"Top view lateral travel path at bar." },

  // ── INTERMEDIATE — LEGS (51–58) ──────────────────────────────────────────
  { ...I, id:51, name:"Bulgarian Split Squat",icon:"🏋️",muscles:["Quads","Glutes","Hamstrings","Balance"],   desc:"Rear foot elevated on bench. Lower front leg to ~90°. Great unilateral strength builder.", sets:"4×8/leg",  rest:"90s",  progressions:["Static lunge → Rear-elevated → Bulgarian → Weighted"], illustrationNotes:"Side view rear foot height. Front knee track." },
  { ...I, id:52, name:"Jump Squat",          icon:"⚡", muscles:["Quads","Glutes","Calves","Power"],          desc:"Squat down then explode upward. Land softly with knees bent.",                          sets:"3×10–15",  rest:"75s",  progressions:["Air squat → Pause → Jump → 180° → Tuck jump"],         illustrationNotes:"Side view jump arc. Soft landing absorption." },
  { ...I, id:53, name:"Lateral Lunge",       icon:"↔️", muscles:["Quads","Adductors","Glutes"],              desc:"Step wide sideways, bend that knee, other leg straight. Push back to start.",           sets:"3×10/side",rest:"75s",  progressions:["Bodyweight → Curtsy → Cossack squat"],                 illustrationNotes:"Front view stance width. Knee-track over foot." },
  { ...I, id:54, name:"Cossack Squat",       icon:"🕺", muscles:["Quads","Adductors","Hamstrings","Ankles"], desc:"Deep lateral squat — one leg fully extended, squat on other. Requires great mobility.",  sets:"3×8/side", rest:"90s",  progressions:["Lateral lunge → Cossack → Loaded → Pistol squat"],     illustrationNotes:"Front view deep stance. Foot dorsiflexion callout." },
  { ...I, id:55, name:"Single-Leg Deadlift", icon:"🦢", muscles:["Hamstrings","Glutes","Core","Balance"],    desc:"Stand on one leg, hinge at hip, lower torso parallel to floor. Balance + hinge.",        sets:"3×8/leg",  rest:"75s",  progressions:["Assisted → Bodyweight → Loaded → Slow-tempo"],         illustrationNotes:"Side view hip-hinge arc. ❌ rounded back." },
  { ...I, id:56, name:"Reverse Nordic Curl", icon:"🦵", muscles:["Quads","Core"],                             desc:"Kneeling, lean back keeping hips extended. Control descent with quads.",               sets:"3×5–10",   rest:"90s",  progressions:["Partial lean → Full lean → Slow → Full range"],        illustrationNotes:"Side view lean angle. Quad tension indicator." },
  { ...I, id:57, name:"Box Jump",            icon:"📦", muscles:["Quads","Glutes","Calves","Power"],          desc:"Explosive jump onto box from standing. Stick landing, step back down.",                 sets:"3×5–8",    rest:"90s",  progressions:["Step-up → Low box → High box → Depth jump"],           illustrationNotes:"Side view jump-land arc. Stick landing callout." },
  { ...I, id:58, name:"Hip Thrust",          icon:"🌉", muscles:["Glutes","Hamstrings","Core"],               desc:"Upper back on bench, barbell or bodyweight across hips. Drive hips to full extension.", sets:"3×12–15",  rest:"75s",  progressions:["Floor bridge → Hip thrust → Single-leg → Elevated"],   illustrationNotes:"Side view hip extension range. Full lockout." },

  // ── INTERMEDIATE — CORE (59–65) ──────────────────────────────────────────
  { ...I, id:59, name:"L-Sit",              icon:"🪑", muscles:["Core","Hip Flexors","Triceps","Shoulders"], desc:"Support on bars or floor. Legs parallel to ground fully extended. Hold for time.",      sets:"3×5–15s",  rest:"90s",  progressions:["Tuck → One-leg → Full → V-sit"],                       illustrationNotes:"Side view leg angle (90°). Arm lockout." },
  { ...I, id:60, name:"Dragon Flag",        icon:"🐉", muscles:["Core","Lats","Hip Flexors","Shoulders"],    desc:"Grip bench overhead, lift body to vertical then lower slowly straight as a plank.",     sets:"3×3–6",    rest:"90s",  progressions:["Tucked → Straddle → Single-leg → Full dragon flag"],   illustrationNotes:"Side view body angle descent. ❌ bent hips." },
  { ...I, id:61, name:"Ab Wheel Rollout",   icon:"⚙️", muscles:["Core","Lats","Shoulders"],                  desc:"From knees, roll wheel forward to full extension then pull back. Keep core braced.",    sets:"3×8–12",   rest:"75s",  progressions:["Partial → Full → Standing rollout"],                   illustrationNotes:"Side view rollout arc. Lower back neutral." },
  { ...I, id:62, name:"V-Up",              icon:"✌️", muscles:["Core","Hip Flexors","Quads"],               desc:"Lie flat, simultaneously lift straight legs and torso to form V-shape. Touch toes.",    sets:"3×10–15",  rest:"75s",  progressions:["Crunches → Sit-up → V-up → Weighted V-up"],            illustrationNotes:"Side view V-shape peak position." },
  { ...I, id:63, name:"Windshield Wiper",   icon:"🌀", muscles:["Obliques","Core","Hip Flexors"],            desc:"Hang from bar, legs straight. Rotate legs side to side like a windshield wiper.",        sets:"3×5/side", rest:"90s",  progressions:["Knee → Straight leg → Slow → Full ROM"],               illustrationNotes:"Front view rotation arc from centre." },
  { ...I, id:64, name:"Hollow Body Rock",   icon:"🪨", muscles:["Core","Hip Flexors","Lats"],                desc:"Hollow body position, rock back and forth like a rocking chair. Maintain tension.",     sets:"3×20–30s", rest:"60s",  progressions:["Hold → Short rock → Full rock → Weighted"],            illustrationNotes:"Side view rocking arc. Lower back contact." },
  { ...I, id:65, name:"Russian Twist",      icon:"🔄", muscles:["Obliques","Core"],                          desc:"Sit, lean back slightly, feet raised, rotate torso side to side. Hands together.",     sets:"3×15/side",rest:"60s",  progressions:["Feet down → Feet raised → Weighted → Slow"],           illustrationNotes:"Top view rotation angle. Trunk angle indicator." },

  // ── ADVANCED — PUSH (66–73) ──────────────────────────────────────────────
  { ...A, id:66, name:"Handstand Push-Up",  icon:"🤸", muscles:["Shoulders","Triceps","Core"],               desc:"Wall or freestanding. Lower head to floor from handstand, press back up.",             sets:"3×3–8",    rest:"120s", progressions:["Wall HSPU → Negative → Full → Free HSPU"],             illustrationNotes:"Side view head-floor range. Wall distance." },
  { ...A, id:67, name:"One-Arm Push-Up",    icon:"✊", muscles:["Chest","Triceps","Core","Stability"],        desc:"Full push-up on single arm. Body square, free hand behind back or at side.",          sets:"3×3–6/arm",rest:"120s", progressions:["Archer → Loaded archer → One-arm eccentric → Full"],   illustrationNotes:"Front view balance point. ❌ hip rotation." },
  { ...A, id:68, name:"Planche Push-Up",    icon:"⚖️", muscles:["Shoulders","Chest","Core","Wrists"],         desc:"Push-up in full planche position — body horizontal, legs off ground. Elite skill.",     sets:"3×2–5",    rest:"180s", progressions:["Tuck planche PU → Advanced tuck → Straddle → Full"], illustrationNotes:"Side view body horizontal line. Lean angle." },
  { ...A, id:69, name:"90-Degree PU",       icon:"🔢", muscles:["Shoulders","Core","Chest","Wrists"],         desc:"Hands on floor, lift body so it's horizontal, bent at 90°. Gymnastic pushing skill.",   sets:"3×3–5",    rest:"180s", progressions:["L-sit → 90° hold → 90° PU → Planche"],               illustrationNotes:"Side view 90° body angle from floor." },
  { ...A, id:70, name:"Superman Push-Up",   icon:"🦸", muscles:["Chest","Triceps","Core","Power"],            desc:"Explosive clap push-up where hands travel forward then return before landing.",        sets:"3×3–5",    rest:"120s", progressions:["Clap PU → Superman → One-arm clap"],                   illustrationNotes:"Side view hand travel arc forward." },
  { ...A, id:71, name:"Ring Dip",           icon:"⭕", muscles:["Triceps","Chest","Shoulders","Stabilisers"], desc:"Dips on gymnastic rings. Rings turned out at top. Maximum stabiliser demand.",          sets:"3×5–10",   rest:"120s", progressions:["Bar dip → Low ring → Ring dip → Weighted ring"],       illustrationNotes:"Front view RTO (rings turned out) position." },
  { ...A, id:72, name:"Tuck Planche Hold",  icon:"🤲", muscles:["Shoulders","Core","Wrists","Chest"],         desc:"Support on hands, tuck knees to chest, lift entire body parallel to floor.",           sets:"3×3–10s",  rest:"180s", progressions:["Planche lean → Tuck → Advanced tuck → Straddle → Full"], illustrationNotes:"Side view. Horizontal tuck body position." },
  { ...A, id:73, name:"Back Lever Hold",    icon:"🔄", muscles:["Lats","Shoulders","Core","Biceps"],          desc:"From hang, rotate body backward to horizontal face-down position. Static hold.",        sets:"3×3–8s",   rest:"180s", progressions:["Skin cat → German hang → Tuck → Straddle → Full"],   illustrationNotes:"Side view horizontal face-down position." },

  // ── ADVANCED — PULL (74–81) ──────────────────────────────────────────────
  { ...A, id:74, name:"Muscle-Up",          icon:"🏆", muscles:["Lats","Chest","Triceps","Shoulders","Core"], desc:"Explosive pull-up transitioning above the bar into a dip lockout. Full body power.",   sets:"3×3–6",    rest:"120s", progressions:["Pull-up + Dip → Chest-to-bar → Kipping MU → Strict"], illustrationNotes:"Phase diagram: pull → transition → push." },
  { ...A, id:75, name:"Strict Muscle-Up",   icon:"💪", muscles:["Lats","Chest","Triceps","Shoulders"],        desc:"Muscle-up with zero momentum. Pure strength transition above bar.",                    sets:"3×2–4",    rest:"180s", progressions:["Kipping MU → Assisted strict → Full strict"],          illustrationNotes:"Phase diagram. Zero swing indicator." },
  { ...A, id:76, name:"One-Arm Pull-Up",    icon:"✊", muscles:["Lats","Biceps","Core","Grip"],               desc:"Full pull-up on a single arm. Supreme lat and grip strength requirement.",            sets:"3×1–3/arm",rest:"180s", progressions:["Archer → Assisted OA → Weighted PU → One-arm"],        illustrationNotes:"Front view free arm position options." },
  { ...A, id:77, name:"Front Lever Hold",   icon:"📐", muscles:["Lats","Core","Shoulders","Biceps"],          desc:"Hang from bar, body horizontal facing upward. Pure lat and core tension.",            sets:"3×3–10s",  rest:"180s", progressions:["Tuck → Adv. tuck → One-leg → Straddle → Full"],       illustrationNotes:"Horizontal body line from bar. Tuck comparison." },
  { ...A, id:78, name:"Front Lever Row",    icon:"🏹", muscles:["Lats","Biceps","Core","Rear Delts"],         desc:"Pull from front lever position into row. Most demanding pulling movement.",           sets:"3×2–5",    rest:"180s", progressions:["FL hold → Tucked FL row → Straddle → Full FL row"],   illustrationNotes:"Side view ROM arc from horizontal." },
  { ...A, id:79, name:"Weighted Pull-Up",   icon:"⚖️", muscles:["Lats","Biceps","Upper Back"],                desc:"Pull-up with additional weight via belt, vest, or dumbbells between knees.",           sets:"4×3–6",    rest:"120s", progressions:["Bodyweight → +5kg → +10kg → +20kg → +30kg"],           illustrationNotes:"Front view. Belt/vest weight notation." },
  { ...A, id:80, name:"Ring Muscle-Up",     icon:"⭕", muscles:["Lats","Chest","Triceps","Stabilisers"],      desc:"Muscle-up on gymnastic rings. More demanding than bar — free rotation throughout.",   sets:"3×2–4",    rest:"180s", progressions:["Bar MU → Low ring MU → Ring MU → Strict ring MU"],     illustrationNotes:"Phase diagram. Ring rotation callout." },
  { ...A, id:81, name:"Maltese Cross Hold", icon:"✝️", muscles:["Shoulders","Lats","Core","Chest"],           desc:"Arms extended 45° below horizontal in support. Elite static ring hold.",              sets:"3×2–5s",   rest:"180s", progressions:["Support hold → Cross → Low cross → Maltese"],          illustrationNotes:"Front view arm angle (45° below horizontal)." },

  // ── ADVANCED — LEGS (82–87) ──────────────────────────────────────────────
  { ...A, id:82, name:"Pistol Squat",       icon:"🔫", muscles:["Quads","Glutes","Balance","Ankle Mobility"], desc:"Single-leg squat to full depth, other leg extended. Strength + mobility combined.",   sets:"3×3–6/leg",rest:"120s", progressions:["Assisted → Box → Full → Weighted → Dragon squat"],     illustrationNotes:"Front + side view. Balance line. ❌ heel rise." },
  { ...A, id:83, name:"Nordic Curl",        icon:"🦵", muscles:["Hamstrings","Glutes","Core"],                desc:"Kneel, feet anchored. Lower body forward under hamstring control. Pull back up.",     sets:"3×3–8",    rest:"120s", progressions:["Eccentric only → Partial → Full → Weighted"],          illustrationNotes:"Side view descent arc. ❌ hip hinge." },
  { ...A, id:84, name:"Shrimp Squat",       icon:"🦐", muscles:["Quads","Glutes","Balance","Knee Strength"],  desc:"Single leg squat where back leg bends behind — knee nearly touches floor.",           sets:"3×3–6/leg",rest:"120s", progressions:["Pistol → Assisted shrimp → Full shrimp → Weighted"],   illustrationNotes:"Side view back knee descent path." },
  { ...A, id:85, name:"Dragon Squat",       icon:"🐲", muscles:["Quads","Hip Flexors","Glutes","Mobility"],   desc:"Pistol squat variant with rear leg crossed behind, ankle tucked under hip.",           sets:"3×3–5/leg",rest:"120s", progressions:["Pistol → Shrimp → Dragon squat"],                       illustrationNotes:"Side view crossed-leg rear position." },
  { ...A, id:86, name:"Broad Jump",         icon:"🦘", muscles:["Quads","Glutes","Calves","Power"],           desc:"Two-foot explosive jump for maximum forward distance. Land softly with bent knees.",   sets:"3×5",      rest:"90s",  progressions:["Jump squat → Box jump → Broad jump → Triple broad jump"], illustrationNotes:"Side view takeoff/landing arc distance." },
  { ...A, id:87, name:"Tuck Jump",          icon:"🐸", muscles:["Quads","Glutes","Core","Power"],             desc:"Jump and tuck both knees to chest at peak height. Maximum vertical power output.",    sets:"3×5–8",    rest:"90s",  progressions:["Jump squat → Tuck jump → Weighted tuck jump"],         illustrationNotes:"Side view tuck peak position. Knee-chest height." },

  // ── ADVANCED — CORE / SKILL (88–94) ──────────────────────────────────────
  { ...A, id:88, name:"Handstand Hold",     icon:"🤸", muscles:["Shoulders","Core","Wrists","Stability"],    desc:"Kick or press to inverted balance. Hands shoulder-width, body stacked.",            sets:"3×10–30s",  rest:"120s", progressions:["Wall HS → Kick-up → Chest-to-wall → Free → HSPU"],   illustrationNotes:"Vertical alignment axis. Finger pressure." },
  { ...A, id:89, name:"Planche Lean",       icon:"↗️", muscles:["Shoulders","Chest","Core","Wrists"],         desc:"Straight-arm plank leaning far past hands. Foundation skill for full planche.",       sets:"3×10–20s", rest:"120s", progressions:["Lean → Tuck planche → Adv. tuck → Straddle → Full"], illustrationNotes:"Side view lean angle (0–30°). CoG overlay." },
  { ...A, id:90, name:"Manna Hold",         icon:"🏛️", muscles:["Core","Shoulders","Hip Flexors","Wrists"],  desc:"Seated support hold with legs elevated above shoulder height. Elite skill.",           sets:"3×2–5s",   rest:"180s", progressions:["V-sit → Tuck manna → Straddle → Full manna"],         illustrationNotes:"Side view leg angle above 90°." },
  { ...A, id:91, name:"Human Flag",         icon:"🚩", muscles:["Shoulders","Core","Lats","Obliques"],        desc:"Grip vertical pole, hold body horizontal like a flag. Extreme full-body tension.",    sets:"3×2–5s",   rest:"180s", progressions:["Tuck → Straddle → Half-lay → Full flag"],             illustrationNotes:"Front view horizontal body line from pole." },
  { ...A, id:92, name:"Press to Handstand", icon:"🌟", muscles:["Shoulders","Core","Hip Flexors","Balance"],  desc:"Press from L-sit or pike to freestanding handstand without kick. Skill + strength.",  sets:"3×2–4",    rest:"180s", progressions:["Straddle press → Tuck press → Pike press → Full"],    illustrationNotes:"Side view phase sequence: floor → inverted." },
  { ...A, id:93, name:"Back Walkover",      icon:"🌈", muscles:["Spine","Shoulders","Hip Flexors","Glutes"],  desc:"Bridge position, kick to handstand, land on one foot at a time. Gymnastics skill.",   sets:"3×2–4",    rest:"120s", progressions:["Bridge → Bridge with leg raise → Back walkover"],      illustrationNotes:"Side view arc phase. ❌ collapsed shoulders." },
  { ...A, id:94, name:"Handstand Walk",     icon:"🚶", muscles:["Shoulders","Core","Wrists","Full Body"],     desc:"Walk on hands in handstand position. Balance shifts with each hand movement.",         sets:"3×5–10m",  rest:"120s", progressions:["Wall HS → Timed HS → Kick-out → HS walk 1m → 10m"],   illustrationNotes:"Side view weight transfer sequence L/R." },

  // ── ADVANCED — FULL BODY / SKILL (95–100) ────────────────────────────────
  { ...A, id:95,  name:"360 Muscle-Up",     icon:"🌀", muscles:["Lats","Chest","Triceps","Power","Coordination"], desc:"Muscle-up with full 360° spin at top before re-gripping bar. Freestyle skill.",  sets:"3×1–3",    rest:"180s", progressions:["Muscle-up → Kipping 360 → Strict 360"],                illustrationNotes:"Side view rotation arc. Re-grip timing callout." },
  { ...A, id:96,  name:"Iron Cross Hold",   icon:"✝️", muscles:["Shoulders","Lats","Chest","Core"],            desc:"Rings, arms extended perfectly horizontal at shoulder height. Sustained hold.",      sets:"3×2–5s",   rest:"180s", progressions:["Support hold → Low cross → Iron cross"],              illustrationNotes:"Front view arm angle (90° from body)." },
  { ...A, id:97,  name:"Victorians Hold",   icon:"👑", muscles:["Shoulders","Core","Lats","Wrists"],           desc:"Arms by sides, body inverted in support. Rings or bar. Elite shoulder strength.",   sets:"3×2–5s",   rest:"180s", progressions:["Support hold → L-sit → Victoria progression"],        illustrationNotes:"Side view inverted body angle from arms." },
  { ...A, id:98,  name:"One-Arm Hang",      icon:"☝️", muscles:["Grip","Lats","Shoulder","Core"],              desc:"Single-arm dead hang. Equal shoulder and lat loading on one side. Builds OA PU base.", sets:"3×10–20s",rest:"120s", progressions:["Two-arm hang → OA assisted → Full OA hang"],           illustrationNotes:"Front view. Shoulder pack vs drop overlay." },
  { ...A, id:99,  name:"Plyo Pull-Up",      icon:"🚀", muscles:["Lats","Biceps","Shoulders","Power"],          desc:"Explosive pull-up to release bar at top, catch again on way down. Pure power.",       sets:"3×3–5",    rest:"120s", progressions:["Explosive PU → Release → Plyo catch → Double bar"],   illustrationNotes:"Side view bar-release height callout." },
  { ...A, id:100, name:"Full Planche Hold", icon:"⭐", muscles:["Shoulders","Chest","Core","Wrists","Full Body"], desc:"Body perfectly horizontal, arms straight, entire body off ground. Ultimate skill.", sets:"3×2–5s",   rest:"180s", progressions:["Tuck → Adv tuck → Straddle → Half-lay → Full planche"], illustrationNotes:"Side view. Horizontal body line. CoG overlay." },
];

// ─── Training Planner flow ────────────────────────────────────────────────
const plannerFlow = [
  { step:"1", icon:"🤸", label:"Browse Library",    detail:"Open Calisthenics section. Filter by level or muscle group." },
  { step:"2", icon:"➕", label:"Add to Plan",       detail:"Tap '+ Add to Plan' on any exercise card." },
  { step:"3", icon:"📅", label:"Pick Day & Time",   detail:"Select day of week + time slot (e.g. Tuesday 07:00)." },
  { step:"4", icon:"🔢", label:"Set Reps & Sets",   detail:"Choose sets (1–8), reps or hold time per set." },
  { step:"5", icon:"⏱", label:"Set Rest Time",     detail:"Rest between sets: 30s / 45s / 60s / 90s / 120s / custom." },
  { step:"6", icon:"💾", label:"Save to Schedule",  detail:"Exercise appears on that day's plan. Appears in app schedule." },
  { step:"7", icon:"📝", label:"Log Results",       detail:"After workout: log actual reps per set → saved in history." },
];

const plannerFields = [
  { field:"Day of Week",   icon:"📅", type:"select",  example:"Monday / Wednesday / Friday",     rule:"Multi-select allowed — add same exercise to multiple days" },
  { field:"Time",          icon:"⏰", type:"time",    example:"07:00, 18:30",                    rule:"15-min intervals. Shows in daily schedule timeline." },
  { field:"Sets",          icon:"🔢", type:"number",  example:"3 sets",                          rule:"Min 1, Max 10" },
  { field:"Reps or Time",  icon:"🔁", type:"toggle",  example:"10 reps  OR  30s hold",           rule:"Toggle between reps and timed hold per exercise type" },
  { field:"Rest (seconds)",icon:"⏱", type:"select",  example:"60s",                             rule:"30 / 45 / 60 / 90 / 120 / custom (15–300s)" },
  { field:"Target Goal",   icon:"🎯", type:"text",    example:"≥15 reps / 30s hold",             rule:"Optional personal target — shown during logger for reference" },
];

// ─── Custom Exercise Builder ───────────────────────────────────────────────
const customBuilderFields = [
  { field:"Exercise Name",      icon:"✏️", type:"text",     example:"One-Arm Push-Up",           rule:"Max 50 chars. Must be unique per user." },
  { field:"Muscle Groups",      icon:"💪", type:"multi-tag",example:"Chest, Core, Triceps",      rule:"Select 1–4 from predefined muscle tag list" },
  { field:"Difficulty Level",   icon:"📊", type:"select",   example:"Beginner / Int. / Advanced",rule:"Sets badge colour on card" },
  { field:"Default Sets",       icon:"🔢", type:"number",   example:"3 sets",                   rule:"Pre-fills planner when exercise is added to plan" },
  { field:"Default Reps/Time",  icon:"🔁", type:"toggle",   example:"8 reps or 20s",             rule:"Reps or timed hold — user chooses mode" },
  { field:"Default Rest",       icon:"⏱", type:"select",   example:"90s",                      rule:"30 / 45 / 60 / 90 / 120 / custom" },
  { field:"Description",        icon:"📝", type:"textarea", example:"Lower slowly, one arm...",  rule:"Max 200 chars. Shown on exercise card." },
  { field:"Illustration Hint",  icon:"🖼️", type:"select",   example:"Push / Pull / Hold / Squat",rule:"Selects generic base SVG template for the exercise card" },
  { field:"Notes / Cues",       icon:"💡", type:"textarea", example:"Keep elbow close, exhale on push", rule:"Max 200 chars. Optional coaching notes shown during logger." },
];

const customBuilderFlow = [
  { step:"1", icon:"🛠️", label:"Open Builder",    detail:"Tap '+ Create Exercise' at bottom of Calisthenics Library" },
  { step:"2", icon:"✏️", label:"Name It",          detail:"Type a unique exercise name" },
  { step:"3", icon:"💪", label:"Tag Muscles",      detail:"Pick 1–4 muscle groups from predefined tag list" },
  { step:"4", icon:"📊", label:"Set Difficulty",   detail:"Beginner / Intermediate / Advanced — sets badge colour" },
  { step:"5", icon:"🔢", label:"Configure Defaults",detail:"Sets, reps or hold time, rest interval" },
  { step:"6", icon:"🖼️", label:"Pick Illustration",detail:"Choose a base SVG template (push / pull / squat / hold)" },
  { step:"7", icon:"💾", label:"Save",             detail:"Exercise appears in 'My Exercises' tab within library" },
  { step:"8", icon:"➕", label:"Add to Plan",      detail:"Tap '+ Add to Plan' to schedule it — same flow as library exercises" },
];

// ─── History tab extension ────────────────────────────────────────────────
const historyNewViews = [
  { view:"Calisthenics Tab",     icon:"🤸", color:"#9333ea", desc:"New tab in existing History screen alongside LAF tab. Shows all calisthenics session data.", detail:"Toggle: LAF Training ↔ Calisthenics" },
  { view:"Exercise PB Chart",    icon:"📊", color:"#2563eb", desc:"Per-exercise line chart: reps or hold time over time. Tap exercise name to switch.", detail:"Zoom: week / month / all time" },
  { view:"Muscle Group Heatmap", icon:"🦾", color:"#ef4444", desc:"Body silhouette showing which muscles were trained most in last 7 / 30 days — colour intensity.", detail:"Tap muscle → filter sessions" },
  { view:"Custom Exercise Logs", icon:"🛠️", color:"#f97316", desc:"User-created exercises tracked separately. Full history log with same drill-down as library exercises.", detail:"Marked with 🛠️ Custom badge in list" },
];

// ─── Existing screen touches ───────────────────────────────────────────────
const screenTouches = [
  {
    screen: "Home / Today Screen", icon: "🏠", color: "#16a34a",
    changes: [
      { type:"ADD", item:"Calisthenics session card", desc:"If user has a calisthenics exercise planned today, shows a card below the LAF card with exercise name, sets, and a ▶ Start button." },
      { type:"ADD", item:"'My Exercises' count badge", desc:"Small badge on Calisthenics nav icon showing how many custom exercises the user has created." },
    ],
  },
  {
    screen: "Bottom Navigation Bar", icon: "📱", color: "#2563eb",
    changes: [
      { type:"ADD", item:"🤸 Calisthenics tab", desc:"New 5th tab in bottom nav. Tapping opens the Calisthenics Library. Active state uses purple (#9333ea) to distinguish from LAF green." },
    ],
  },
  {
    screen: "History & Progress (v1.1 screen)", icon: "📈", color: "#9333ea",
    changes: [
      { type:"ADD", item:"Calisthenics tab toggle", desc:"Tab bar at top of History: 'LAF Training' | 'Calisthenics'. Default is LAF to preserve v1.1 behaviour." },
      { type:"ADD", item:"Muscle group heatmap view", desc:"New sub-view under Calisthenics tab. Body silhouette with colour intensity by muscle train frequency." },
      { type:"ADD", item:"Custom exercise drill-down", desc:"Custom-created exercises appear in session lists with 🛠️ badge. Same tap-to-detail behaviour as library exercises." },
    ],
  },
  {
    screen: "Schedule / Day Card (v1.1 screen)", icon: "📅", color: "#f97316",
    changes: [
      { type:"ADD", item:"Calisthenics exercises in day view", desc:"If user added calisthenics exercises on this day, they appear as a second group below the LAF exercises, with a purple left border to distinguish." },
      { type:"ADD", item:"Mixed session support", desc:"Day can have both LAF exercises and calisthenics exercises. Logger handles them in sequence or separately — user chooses order." },
    ],
  },
];

// ─── DB changes ────────────────────────────────────────────────────────────
const dbChanges = [
  { table:"calisthenics_exercises", status:"NEW",  fields:"exercise_id, name, level, muscles[], description, default_sets, default_reps, default_rest_sec, is_timed, illustration_key, progressions[]", note:"Seeded master list of 20 exercises. Read-only for users — admin managed." },
  { table:"custom_exercises",       status:"NEW",  fields:"exercise_id, user_id, name, muscles[], level, default_sets, default_reps_or_secs, is_timed, rest_sec, description, notes, illustration_template, created_at", note:"User-created exercises. is_timed toggles reps vs hold-time tracking." },
  { table:"calisthenics_plans",     status:"NEW",  fields:"plan_id, user_id, exercise_id, source ('library'|'custom'), day_of_week, time_of_day, sets, reps_or_secs, rest_sec, goal_target, is_active", note:"User's personal calisthenics schedule. source column distinguishes library vs custom." },
  { table:"calisthenics_logs",      status:"NEW",  fields:"log_id, user_id, plan_id, exercise_id, session_date, set_number, planned_reps, actual_reps, completed (bool), notes", note:"One row per set per session. Same structure as session_sets (v1.1) for consistency." },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("delta");
  const [levelFilter, setLevelFilter] = useState("All");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [expandedEx, setExpandedEx] = useState(null);
  const [lang, setLang] = useState("EN");
  const t = (en, lt) => (lang === "LT" ? lt : en);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const muscles = ["All", "Chest", "Back", "Shoulders", "Core", "Legs", "Full Body"];

  const muscleMap = {
    "Chest":["Chest"], "Back":["Lats","Upper Back","Lats","Back"],
    "Shoulders":["Shoulders"], "Core":["Core","Hip Flexors"],
    "Legs":["Quads","Glutes","Hamstrings","Calves","Balance","Ankle Mobility"],
    "Full Body":["Full Body Stability","Cardio"],
  };

  const filtered = calisthenicsExercises.filter(ex => {
    const levelOk = levelFilter === "All" || ex.level === levelFilter;
    const muscleOk = muscleFilter === "All" || (muscleMap[muscleFilter] || []).some(m => ex.muscles.includes(m)) || ex.muscles.includes(muscleFilter);
    return levelOk && muscleOk;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #7c3aed 100%)", color: "white", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 980, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Update Requirements</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>🇱🇹 LAF Workout App — v2.0 Delta</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Calisthenics Module · Custom Builder · Built on v1.0 + v1.1</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>
              v1.1 ✓ Built &nbsp;→&nbsp; v2.0 🤸 Delta
            </div>
            <button onClick={() => setLang(lang === "EN" ? "LT" : "EN")}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              {lang === "EN" ? "🇱🇹 LT" : "🇬🇧 EN"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px" }}>

        {/* Nav pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeSection === s.id ? "#7c3aed" : "#e2e8f0",
                color: activeSection === s.id ? "white" : "#475569",
                transition: "all 0.2s",
              }}>
              {s.icon} {t(s.title, s.titleLT)}
            </button>
          ))}
        </div>

        {/* ══ DELTA ═════════════════════════════════════════════════════ */}
        {activeSection === "delta" && (
          <div>
            <SectionHeader icon="🔄" title={t("What Changed — v1.1 → v2.0","Kas Pasikeitė — v1.1 → v2.0")} accent="#7c3aed" />

            <div style={{ background: "#f5f3ff", border: "2px solid #c4b5fd", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>📌</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("Scope of this document","Šio dokumento apimtis")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t(
                    "v1.0 and v1.1 are already built. This document covers ONLY v2.0 additions: a full Calisthenics Exercise Library (100 exercises, illustrated), a Training Planner for scheduling them, a Workout Logger extension, a Custom Exercise Builder where users create their own exercises, and the database tables that support all of this. Nothing from v1.0 or v1.1 needs to be rebuilt.",
                    "v1.0 ir v1.1 jau sukurta. Šis dokumentas apima TIK v2.0 papildymus: kalistenikų pratimų biblioteką (20 pratimų), treniruočių planuoklį, žurnalo plėtinį, savo pratimo kūrėją ir DB lenteles."
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { type: "NEW",    color: "#16a34a", bg: "#f0fdf4", desc: "Brand new — build from scratch" },
                { type: "EDIT",   color: "#2563eb", bg: "#eff6ff", desc: "Existing screen — add elements" },
                { type: "NO CHG", color: "#94a3b8", bg: "#f8fafc", desc: "Already built — leave as-is" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: l.bg, border: `1px solid ${l.color}33`, borderRadius: 8, padding: "6px 12px" }}>
                  <span style={{ background: l.color, color: "white", borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 800 }}>{l.type}</span>
                  <span style={{ fontSize: 12, color: "#475569" }}>{l.desc}</span>
                </div>
              ))}
            </div>

            <Card title={t("Full Change Log","Pilnas Pakeitimų Žurnalas")}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#1e3a5f", color: "white" }}>
                      {["Type","Area","Item","Description"].map((h,i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deltaRows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white" }}>
                        <td style={{ padding: "9px 12px" }}>
                          <span style={{ background: row.color, color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{row.type}</span>
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

            {/* Flow */}
            <Card title={t("New User Flow — v2.0","Naujas Vartotojo Srautas — v2.0")}>
              <div style={{ overflowX: "auto", padding: "8px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 820 }}>
                  {[
                    { icon:"🤸", label:"Calisthenics Library",  sub:"NEW screen",      color:"#7c3aed" },
                    { arrow: true },
                    { icon:"➕", label:"Add to Plan",           sub:"Training Planner", color:"#7c3aed" },
                    { arrow: true },
                    { icon:"📅", label:"Schedule / Day View",   sub:"EDIT existing",   color:"#2563eb" },
                    { arrow: true },
                    { icon:"📝", label:"Logger (v1.1)",         sub:"EDIT — extended", color:"#2563eb" },
                    { arrow: true },
                    { icon:"📈", label:"History — Calisthenics tab", sub:"EDIT existing", color:"#2563eb" },
                  ].map((item, i) =>
                    item.arrow ? (
                      <div key={i} style={{ color: "#cbd5e1", fontSize: 22, margin: "0 6px", flexShrink: 0 }}>→</div>
                    ) : (
                      <div key={i} style={{ textAlign: "center", minWidth: 120, flexShrink: 0 }}>
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

        {/* ══ CALISTHENICS LIBRARY ═══════════════════════════════════════ */}
        {activeSection === "library" && (
          <div>
            <SectionHeader icon="🤸" title={t("Calisthenics Exercise Library — New Screen","Kalistenikų Pratimų Biblioteka — Naujas Ekranas")} accent="#7c3aed" />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "Completely separate from the LAF exercise library. Contains 20 curated calisthenics exercises seeded by the system, filterable by difficulty level and muscle group. Users can also see their own custom exercises here in a 'My Exercises' tab.",
                "Atskira nuo LAF pratimų bibliotekos. Sudaro 20 atrinkti kalistenikų pratimai, filtruojami pagal sunkumo lygį ir raumenų grupę."
              )}
              color="#7c3aed" bg="#f5f3ff" border="#c4b5fd"
            />

            {/* Filter bar — interactive demo */}
            <Card title={t("Filter Bar — UI Spec (interactive demo below)","Filtro Juosta — UI Spec")}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {levels.map(l => (
                      <button key={l} onClick={() => setLevelFilter(l)}
                        style={{ padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                          background: levelFilter === l ? "#7c3aed" : "#e2e8f0",
                          color: levelFilter === l ? "white" : "#475569" }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Muscle Group</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {muscles.map(m => (
                      <button key={m} onClick={() => setMuscleFilter(m)}
                        style={{ padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                          background: muscleFilter === m ? "#1e3a5f" : "#e2e8f0",
                          color: muscleFilter === m ? "white" : "#475569" }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Showing {filtered.length} of {calisthenicsExercises.length} exercises &nbsp;·&nbsp;
                <span style={{ color: "#16a34a", fontWeight: 600 }}>● Beginner</span> &nbsp;
                <span style={{ color: "#2563eb", fontWeight: 600 }}>● Intermediate</span> &nbsp;
                <span style={{ color: "#9333ea", fontWeight: 600 }}>● Advanced</span>
              </div>
            </Card>

            {/* Exercise cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filtered.map((ex) => (
                <div key={ex.id} style={{ background: "white", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${ex.levelColor}`, overflow: "hidden" }}>
                  {/* Card header */}
                  <div style={{ padding: "14px 16px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: ex.levelBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{ex.icon}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>{ex.name}</div>
                          <span style={{ background: ex.levelBg, color: ex.levelColor, borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{ex.level}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ background: ex.levelColor, color: "white", borderRadius: 8, padding: "3px 10px", fontWeight: 700, fontSize: 12 }}>{ex.sets}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Rest: {ex.rest}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{ex.desc}</div>
                    {/* Muscles */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                      {ex.muscles.map((m, i) => (
                        <span key={i} style={{ background: "#f1f5f9", color: "#475569", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable detail */}
                  <div
                    onClick={() => setExpandedEx(expandedEx === ex.id ? null : ex.id)}
                    style={{ padding: "8px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                      {expandedEx === ex.id ? "▲ Hide details" : "▼ Show progressions + illustration spec"}
                    </span>
                    <button style={{ background: ex.levelColor, color: "white", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      + Add to Plan
                    </button>
                  </div>

                  {expandedEx === ex.id && (
                    <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>📈 Progressions:</div>
                        {ex.progressions.map((p, i) => (
                          <div key={i} style={{ fontSize: 11, color: "#475569" }}>→ {p}</div>
                        ))}
                      </div>
                      <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#16a34a" }}>
                        🖼️ {ex.illustrationNotes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TRAINING PLANNER ══════════════════════════════════════════ */}
        {activeSection === "planner" && (
          <div>
            <SectionHeader icon="📋" title={t("Training Planner — New Screen","Treniruočių Planuoklis — Naujas Ekranas")} accent="#7c3aed" />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "Allows users to schedule any calisthenics exercise (from the library or their own custom exercises) to specific days and times in their weekly plan. Results are logged via the existing v1.1 Workout Logger and flow into History.",
                "Leidžia vartotojams suplanuoti bet kurį kalistenikų pratimą konkrečioms dienoms ir laikams savaitiniame plane."
              )}
              color="#7c3aed" bg="#f5f3ff" border="#c4b5fd"
            />

            <Card title={t("Planning Flow — 7 Steps","Planavimo Eiga — 7 Žingsniai")}>
              <FlowStepper steps={plannerFlow} color="#7c3aed" />
            </Card>

            <Card title={t("Plan Entry Fields","Plano Įvesties Laukai")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {plannerFields.map((f, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13 }}>{f.field}</div>
                      <span style={{ marginLeft: "auto", background: "#e2e8f0", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{f.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, marginBottom: 4 }}>e.g. {f.example}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{f.rule}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Logging results spec */}
            <Card title={t("Logging Results — How it works","Rezultatų Įrašymas — Kaip veikia")}>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { icon:"✅", label:"Same logger as v1.1",        desc:"After a planned calisthenics session, user opens the v1.1 Workout Logger. Calisthenics exercises appear after LAF exercises, or in a separate session." },
                  { icon:"🔢", label:"Reps-based logging",          desc:"For exercises with reps: user logs actual reps per set using the ✓/✗ toggle + number input. Identical to v1.1 set logging card." },
                  { icon:"⏱", label:"Hold-time logging",           desc:"For timed exercises (plank, L-sit, dead hang): user taps a built-in stopwatch to record actual hold time per set." },
                  { icon:"💾", label:"Saved to calisthenics_logs",  desc:"Each set result is stored in the new calisthenics_logs table. Auto-updates personal bests for that exercise." },
                  { icon:"📈", label:"Feeds History",               desc:"All calisthenics logs appear in the Calisthenics tab in History & Progress. Line chart updates after save." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f5f3ff", borderRadius: 10, border: "1px solid #c4b5fd", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ CUSTOM EXERCISE BUILDER ════════════════════════════════════ */}
        {activeSection === "custom" && (
          <div>
            <SectionHeader icon="🛠️" title={t("Custom Exercise Builder — New Screen","Savo Pratimo Kūrėjas — Naujas Ekranas")} accent="#7c3aed" />

            <NewBadgeBanner
              title={t("New screen — build from scratch","Naujas ekranas — kuriamas iš naujo")}
              desc={t(
                "Users can define their own bodyweight exercises not in the library. Custom exercises behave identically to library exercises: they can be added to the plan, logged, and tracked in history. They are marked with a 🛠️ Custom badge throughout the app.",
                "Vartotojai gali apibrėžti savo kūno svorio pratimus, kurių nėra bibliotekoje. Savo pratimai veikia taip pat kaip bibliotekos pratimai."
              )}
              color="#7c3aed" bg="#f5f3ff" border="#c4b5fd"
            />

            <Card title={t("Builder Flow — 8 Steps","Kūrimo Eiga — 8 Žingsniai")}>
              <FlowStepper steps={customBuilderFlow} color="#7c3aed" />
            </Card>

            <Card title={t("Builder Fields","Kūrimo Laukai")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {customBuilderFields.map((f, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{f.icon}</span>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13 }}>{f.field}</div>
                      <span style={{ marginLeft: "auto", background: "#e2e8f0", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>{f.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, marginBottom: 4 }}>e.g. {f.example}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{f.rule}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Custom exercise card preview */}
            <Card title={t("Custom Exercise Card — Preview (how it looks in library)","Savo Pratimo Kortelė — Peržiūra")}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ background: "white", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", borderLeft: "4px solid #2563eb", width: 320, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💪</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b" }}>One-Arm Push-Up</div>
                          <div style={{ display: "flex", gap: 4, marginTop: 3 }}>
                            <span style={{ background: "#dbeafe", color: "#2563eb", borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>Intermediate</span>
                            <span style={{ background: "#fef9c3", color: "#854d0e", borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>🛠️ Custom</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "#2563eb", color: "white", borderRadius: 8, padding: "3px 10px", fontWeight: 700, fontSize: 12 }}>3×5/arm</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>Lower slowly on one arm, keep elbow close to body. Press back up controlled.</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {["Chest","Core","Triceps","Stability"].map((m, i) => (
                        <span key={i} style={{ background: "#f1f5f9", color: "#475569", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "8px 16px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>✏️ Edit &nbsp; 🗑️ Delete</span>
                    <button style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>+ Add to Plan</button>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 10 }}>{t("Rules for custom exercises:","Savo pratimų taisyklės:")}</div>
                  {[
                    "🛠️ Custom badge always shown — distinguishes from library",
                    "User can edit any field after creation",
                    "Delete requires confirmation: 'This will remove all history for this exercise'",
                    "Custom exercises are private — not shared with other users",
                    "Max 50 custom exercises per user",
                    "Can be reordered in 'My Exercises' tab via drag handle",
                    "If exercise is in an active plan, deleting shows a warning",
                  ].map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, color: "#475569" }}>
                      <span style={{ color: "#7c3aed", fontWeight: 700, flexShrink: 0 }}>→</span> {note}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* My Exercises tab spec */}
            <Card title={t("'My Exercises' Tab — inside Calisthenics Library","'Mano Pratimai' Kortelė — kalistenikų bibliotekoje")}>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { icon:"📚", label:"Tab position",      desc:"Second tab inside Calisthenics Library screen, after the main 'Library' tab." },
                  { icon:"🛠️", label:"Content",           desc:"Shows all user-created exercises in creation order. Each card has Edit and Delete actions." },
                  { icon:"➕", label:"Create button",      desc:"Prominent '+ Create Exercise' button at top and bottom of the list — always accessible." },
                  { icon:"🔍", label:"Search",             desc:"Simple text search by exercise name. Filters list in real time." },
                  { icon:"📊", label:"Sort options",       desc:"Sort by: Date created / Name A–Z / Difficulty / Most used." },
                  { icon:"📤", label:"Empty state",        desc:"First visit: illustration of a person building something + CTA: 'Create your first exercise'." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#f8fafc", borderRadius: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ HISTORY CHANGES ════════════════════════════════════════════ */}
        {activeSection === "history" && (
          <div>
            <SectionHeader icon="📈" title={t("History & Progress — Changes","Istorija ir Pažanga — Pakeitimai")} accent="#7c3aed" />

            <div style={{ background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>🔧</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("Editing the v1.1 History screen — do NOT rebuild","Redaguojamas v1.1 Istorijos ekranas — NEKURTI IŠ NAUJO")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t(
                    "The existing History & Progress screen from v1.1 stays intact. Only add the new Calisthenics tab and its sub-views. The LAF training tab remains the default.",
                    "Esamas v1.1 Istorijos ekranas lieka nepakeistas. Tik pridėkite naują Kalistenikų kortelę."
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {historyNewViews.map((v, i) => (
                <div key={i} style={{ background: "white", borderRadius: 14, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${v.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{v.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 14 }}>{v.view}</div>
                      <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>EDIT / ADD</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{v.desc}</div>
                  <div style={{ fontSize: 11, color: v.color, fontWeight: 600, background: v.color + "11", borderRadius: 6, padding: "4px 8px", display: "inline-block" }}>→ {v.detail}</div>
                </div>
              ))}
            </div>

            {/* Muscle heatmap spec */}
            <Card title={t("Muscle Group Heatmap — Visual Spec","Raumenų Grupių Žemėlapis — Vizualinė Spec")}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  {[
                    { muscle:"Shoulders", freq:9,  color:"#ef4444" },
                    { muscle:"Chest",     freq:7,  color:"#f97316" },
                    { muscle:"Core",      freq:6,  color:"#eab308" },
                    { muscle:"Lats/Back", freq:4,  color:"#22c55e" },
                    { muscle:"Quads",     freq:3,  color:"#22c55e" },
                    { muscle:"Hamstrings",freq:1,  color:"#d1fae5" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ minWidth: 90, fontSize: 12, fontWeight: 600, color: "#475569" }}>{row.muscle}</div>
                      <div style={{ flex: 1, height: 10, background: "#e2e8f0", borderRadius: 5, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${row.freq * 10}%`, background: row.color, borderRadius: 5 }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", minWidth: 30 }}>{row.freq}×</div>
                    </div>
                  ))}
                </div>
                <div style={{ minWidth: 220, flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 8, fontSize: 13 }}>{t("Heatmap colour legend:","Žemėlapio spalvų legenda:")}</div>
                  {[
                    { color:"#ef4444", label:"Red — trained 8+ times this period" },
                    { color:"#f97316", label:"Orange — trained 5–7 times" },
                    { color:"#eab308", label:"Yellow — trained 3–4 times" },
                    { color:"#22c55e", label:"Green — trained 1–2 times" },
                    { color:"#e2e8f0", label:"Grey — not trained this period" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#475569" }}>{c.label}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>Period toggle: Last 7 days / Last 30 days / All time</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ══ EXISTING SCREEN TOUCHES ════════════════════════════════════ */}
        {activeSection === "touches" && (
          <div>
            <SectionHeader icon="🔧" title={t("Existing Screen Changes","Esami Ekranų Pakeitimai")} accent="#7c3aed" />

            <div style={{ background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>🔧</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("Do NOT rebuild these screens","NEKURKITE šių ekranų iš naujo")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t("Only add the specific elements listed. Everything else stays exactly as built in v1.0 and v1.1.","Tik pridėkite žemiau nurodytus elementus. Viskas kita lieka kaip v1.0 ir v1.1.")}
                </div>
              </div>
            </div>

            {screenTouches.map((screen, si) => (
              <Card key={si} title={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{screen.icon}</span>
                  <span>{screen.screen}</span>
                  <span style={{ marginLeft: "auto", background: "#eff6ff", color: "#2563eb", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>EDIT</span>
                </div>
              }>
                <div style={{ display: "grid", gap: 10 }}>
                  {screen.changes.map((ch, ci) => (
                    <div key={ci} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac", alignItems: "flex-start" }}>
                      <span style={{ background: "#16a34a", color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>ADD</span>
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

        {/* ══ DATABASE ═══════════════════════════════════════════════════ */}
        {activeSection === "db" && (
          <div>
            <SectionHeader icon="🗄️" title={t("Database Changes","Duomenų Bazės Pakeitimai")} accent="#7c3aed" />

            <div style={{ background: "#fdf4ff", border: "2px solid #d8b4fe", borderRadius: 14, padding: 18, marginBottom: 24, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 32 }}>🗄️</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15, marginBottom: 6 }}>
                  {t("4 new tables — nothing changed in existing v1.0 / v1.1 tables","4 naujos lentelės — v1.0 / v1.1 lentelės nepakeistos")}
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
                  {t("All v1.0 and v1.1 tables remain untouched. Add only the tables below.","Visos v1.0 ir v1.1 lentelės lieka nepakeistos. Pridėkite tik žemiau nurodytas lenteles.")}
                </div>
              </div>
            </div>

            <Card title={t("New Tables","Naujos Lentelės")}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#1e3a5f", color: "white" }}>
                      {["Status","Table","Fields / Columns","Notes"].map((h,i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbChanges.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "white", verticalAlign: "top" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: "#16a34a", color: "white", borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{row.status}</span>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#7c3aed", fontFamily: "monospace", whiteSpace: "nowrap" }}>{row.table}</td>
                        <td style={{ padding: "10px 12px", color: "#1e3a5f", fontFamily: "monospace", fontSize: 11 }}>{row.fields}</td>
                        <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 12 }}>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title={t("Table Relationships","Lentelių Ryšiai")}>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { from:"calisthenics_plans",   to:"users",                    via:"user_id",     desc:"Each plan entry belongs to one user" },
                  { from:"calisthenics_plans",   to:"calisthenics_exercises",   via:"exercise_id", desc:"Links plan to a library exercise (source='library')" },
                  { from:"calisthenics_plans",   to:"custom_exercises",         via:"exercise_id", desc:"Links plan to a custom exercise (source='custom')" },
                  { from:"calisthenics_logs",    to:"calisthenics_plans",       via:"plan_id",     desc:"Each log entry belongs to a planned session" },
                  { from:"calisthenics_logs",    to:"users",                    via:"user_id",     desc:"Direct user link for fast history queries" },
                  { from:"custom_exercises",     to:"users",                    via:"user_id",     desc:"Custom exercises are private per user" },
                ].map((rel, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", borderRadius: 10, padding: "10px 14px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#7c3aed", fontSize: 12 }}>{rel.from}</span>
                    <span style={{ color: "#cbd5e1" }}>→</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#2563eb", fontSize: 12 }}>{rel.to}</span>
                    <span style={{ background: "#e2e8f0", color: "#64748b", borderRadius: 5, padding: "1px 7px", fontSize: 11 }}>via {rel.via}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>— {rel.desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={t("Seed Data — calisthenics_exercises","Pradiniai Duomenys — calisthenics_exercises")}>
              <div style={{ fontSize: 13, color: "#475569", marginBottom: 12 }}>
                {t("The 100 exercises below must be seeded into calisthenics_exercises on first deploy. They are system records — users cannot edit or delete them.","Žemiau esantys 100 pratimų turi būti įkelti į calisthenics_exercises pirmojo diegimo metu.")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {calisthenicsExercises.map((ex, i) => (
                  <div key={i} style={{ background: ex.levelBg, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: ex.levelColor }}>
                    {i + 1}. {ex.name}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, padding: "16px 20px", background: "linear-gradient(135deg, #1e3a5f 0%, #7c3aed 100%)", borderRadius: 14, color: "white", fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🇱🇹 LAF Fit — Update Requirements v2.0</div>
            <div style={{ opacity: 0.7, marginTop: 2 }}>Calisthenics Module · Delta only · Builds on v1.0 + v1.1 · June 2026</div>
          </div>
          <div style={{ opacity: 0.7, textAlign: "right" }}>
            <div>3 new screens · 4 screen edits</div>
            <div>4 new DB tables · 100 seeded exercises</div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Shared components ─────────────────────────────────────────────────────
function SectionHeader({ icon, title, accent = "#1e3a5f" }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e3a5f", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>{icon}</span> {title}
      </h2>
      <div style={{ height: 3, background: `linear-gradient(90deg, #1e3a5f, ${accent}, transparent)`, borderRadius: 2, marginTop: 8 }} />
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
