import type { CalisthenicsExerciseData } from "@/types/calisthenics";
import type { Lang } from "@/types";

/** Lithuanian text for one library exercise. */
export interface CalisthenicsExerciseLT {
  name: string;
  description: string;
  progressions: string[];
}

/**
 * Lithuanian content for the built-in calisthenics library, keyed by the
 * library exercise id. Kept beside the English data rather than inside it:
 * the library rows are seeded into the database, so they stay single-language.
 * Ids here must track `calisthenicsExercises`.
 */
export const calisthenicsExercisesLT: Record<number, CalisthenicsExerciseLT> = {
  // 1: Push-Up
  1: {
    name: "Atsispaudimai",
    description:
      "Klasikinis horizontalus stūmimas. Rankos pečių plotyje, kūnas tiesus, krūtinę leiskite iki grindų.",
    progressions: ["Nuo kelių", "Standartiniai", "Platūs", "Deimantiniai", "Lankininko"],
  },
  // 2: Wide Push-Up
  2: {
    name: "Platūs atsispaudimai",
    description: "Rankos plačiau nei pečiai. Akcentuoja išorinę krūtinę. Alkūnės 45° kampu.",
    progressions: ["Standartiniai ats.", "Platūs", "Platūs su pauze", "Platūs lankininko"],
  },
  // 3: Diamond Push-Up
  3: {
    name: "Deimantiniai atsispaudimai",
    description:
      "Rankos sudaro deimantą po krūtine. Alkūnės krypsta atgal. Intensyvus tricepsų krūvis.",
    progressions: ["Standartiniai ats.", "Siauru griebimu", "Deimantiniai", "Tigro ats."],
  },
  // 4: Knee Push-Up
  4: {
    name: "Atsispaudimai nuo kelių",
    description:
      "Lengvesni atsispaudimai nuo kelių. Tas pats tiesaus kūno principas, mažesnis krūvis.",
    progressions: ["Nuo kelių", "Nuožulnūs", "Standartiniai"],
  },
  // 5: Incline Push-Up
  5: {
    name: "Nuožulnūs atsispaudimai",
    description:
      "Rankos ant paaukštinimo. Sumažina kūno svorio krūvį. Geras startas pradedantiesiems.",
    progressions: ["Nuožulnūs", "Standartiniai", "Su pakeltomis kojomis"],
  },
  // 6: Decline Push-Up
  6: {
    name: "Atsispaudimai su pakeltomis kojomis",
    description: "Kojos pakeltos. Krūvis perkeliamas į viršutinę krūtinę ir priekinius deltinius.",
    progressions: ["Standartiniai", "Su pakeltomis kojomis", "Ant rankų"],
  },
  // 7: Tricep Dip (Bench)
  7: {
    name: "Tricepsų atsispaudimai (nuo suoliuko)",
    description:
      "Rankos ant suoliuko, kojos ant grindų. Leiskitės iki 90° alkūnėse, tada stumkitės aukštyn.",
    progressions: ["Nuo suoliuko", "Ant lygiagrečių", "Ant žiedų", "Su svoriu"],
  },
  // 8: Spiderman Push-Up
  8: {
    name: "Žmogaus-voro atsispaudimai",
    description:
      "Leisdamiesi traukite kelį prie tos pačios pusės alkūnės. Kaitaliokite kas kartojimą. Puikus liemens sukimas.",
    progressions: ["Standartiniai ats.", "Žmogaus-voro", "Lėto tempo žmogaus-voro"],
  },
  // 9: Dead Hang
  9: {
    name: "Kabėjimas ant skersinio",
    description:
      "Kabėkite ant skersinio pilnu griebimu, pečiai aktyvūs, kūnas tiesus. Laikykite tam tikrą laiką.",
    progressions: ["Pasyvus kabėjimas", "Aktyvus kabėjimas", "Menčių traukimai", "Prisitraukimai"],
  },
  // 10: Scapular Pull-Up
  10: {
    name: "Menčių prisitraukimai",
    description: "Iš kabėjimo nuleiskite ir suglauskite mentes nelenkdami alkūnių.",
    progressions: ["Kabėjimas", "Menčių traukimas", "Neigiami prisitr.", "Pilni prisitr."],
  },
  // 11: Inverted Row
  11: {
    name: "Irklavimas gulint",
    description:
      "Gulėkite po skersiniu, kūnas tiesus, traukite krūtinę prie skersinio. Kampą keiskite pagal sunkumą.",
    progressions: ["Kojos ant grindų", "Kojos pakeltos", "Kojos ant žiedų", "Prisitraukimai"],
  },
  // 12: Negative Pull-Up
  12: {
    name: "Neigiami prisitraukimai",
    description: "Šuoliu į viršutinę padėtį, leiskitės kuo lėčiau (3–5 sek.). Ugdo traukimo jėgą.",
    progressions: ["Tik neigiami", "Su guma", "Pilni prisitraukimai"],
  },
  // 13: Air Squat
  13: {
    name: "Pritūpimai",
    description:
      "Pėdos pečių plotyje, pirštai kiek į išorę. Sėskitės atgal ir žemyn, krūtinė aukštai, keliai pirštų kryptimi.",
    progressions: ["Iki dėžės", "Pritūpimai", "Su pauze", "Su šuoliu", "Ant vienos kojos"],
  },
  // 14: Lunge
  14: {
    name: "Išpuoliai",
    description:
      "Ženkite pirmyn, užpakalinį kelį leiskite prie grindų. Priekinė blauzda vertikaliai. Stumkitės atgal.",
    progressions: ["Vietoje", "Einant", "Atbuli", "Šoniniai", "Bulgariški"],
  },
  // 15: Glute Bridge
  15: {
    name: "Sėdmenų tiltelis",
    description:
      "Gulėdami ant nugaros, pėdos ant grindų, kelkite klubus aukštyn. Suspauskite sėdmenis, laikykite 1 s.",
    progressions: ["Ant dviejų kojų", "Ant vienos kojos", "Pakeltas", "Klubų stūmimas"],
  },
  // 16: Wall Sit
  16: {
    name: "Sėdėjimas prie sienos",
    description:
      "Nugara prigludusi prie sienos, šlaunys lygiagrečiai grindims. Laikykite. Keliams saugi kojų ištvermė.",
    progressions: ["Dalinis", "Iki 90°", "Ant vienos kojos"],
  },
  // 17: Step-Up
  17: {
    name: "Užlipimai ant dėžės",
    description:
      "Užlipkite ant dėžės ar suoliuko, kelį kelkite aukštyn, grįžkite žemyn. Kaitaliokite arba ta pačia koja.",
    progressions: ["Žema dėžė", "Aukšta dėžė", "Su svoriu", "Bulgariški"],
  },
  // 18: Calf Raise
  18: {
    name: "Blauzdų kilnojimas",
    description: "Kilkite ant pirštų galų iš pilnos pėdos. Viena arba abiem kojomis. Lėtas tempas.",
    progressions: ["Abiem kojomis", "Viena koja", "Viena koja ant paaukštinimo", "Su svoriu"],
  },
  // 19: Plank
  19: {
    name: "Lenta",
    description: "Ant dilbių ar delnų, kūnas standžia tiesia linija. Laikykite. Viso kūno įtampa.",
    progressions: ["Nuo kelių", "Standartinė", "Pakeltos kojos", "RKC", "Planšo palinkimas"],
  },
  // 20: Side Plank
  20: {
    name: "Šoninė lenta",
    description: "Gulėdami ant šono remkitės dilbiu, kūnas tiesus nuo galvos iki pėdų. Laikykite.",
    progressions: ["Nuo kelio", "Pilna", "Su klubo nuleidimu", "Žvaigždė"],
  },
  // 21: Mountain Climber
  21: {
    name: "Alpinistas",
    description: "Lentos padėtis, pakaitomis traukite kelius prie krūtinės tempu. Klubai lygiai.",
    progressions: ["Lėtai", "Vidutiniškai", "Greitai", "Įstrižai", "Voro"],
  },
  // 22: Hollow Body Hold
  22: {
    name: "Įdubusio kūno laikymas",
    description:
      "Gulėkite tiesiai, juosmenį prispauskite prie grindų, rankos už galvos, kojos 15–20 cm virš grindų. Laikykite.",
    progressions: ["Sulenktomis kojomis", "Rankos prie šonų", "Rankos už galvos", "Pilnas"],
  },
  // 23: Flutter Kicks
  23: {
    name: "Kojų plakimai",
    description:
      "Gulėkite tiesiai, kojos šiek tiek pakeltos, atlikite mažus pakaitinius mostus. Juosmuo prispaustas.",
    progressions: ["Sulenktomis kojomis", "Tiesiomis kojomis", "Plakimai", "Žirklės"],
  },
  // 24: Superman Hold
  24: {
    name: "Supermeno laikymas",
    description:
      "Gulėdami ant pilvo vienu metu kelkite rankas ir kojas nuo grindų. Laikykite, tada nuleiskite.",
    progressions: ["Trumpas laikymas", "Ilgas laikymas", "Plaukikas", "Nugaros tiesimas"],
  },
  // 25: Dead Bug
  25: {
    name: "Vabalo pratimas",
    description:
      "Gulėkite ant nugaros, rankos aukštyn, keliai 90°. Tieskite priešingą ranką ir koją laikydami juosmenį prispaustą.",
    progressions: ["Bazinis", "Viena galūne", "Dviem galūnėmis", "Su pasipriešinimu"],
  },
  // 26: Burpee
  26: {
    name: "Burpės",
    description:
      "Pritūpkite, kojas atmeskite į lentą, atsispauskite, kojas traukite atgal, iššokite iškėlę rankas.",
    progressions: [
      "Su žingsniu atgal",
      "Be atsispaudimo",
      "Standartinės",
      "6 dalių",
      "Krūtine iki grindų",
    ],
  },
  // 27: Jumping Jack
  27: {
    name: "Šuoliukai su rankų mostais",
    description:
      "Šuoliu praskėskite kojas keldami rankas aukštyn, grįžkite. Nepertraukiamas ritmingas judesys.",
    progressions: ["Su žingsniu", "Su šuoliu", "Kryžminiai", "Į šonus"],
  },
  // 28: High Knees
  28: {
    name: "Aukšti keliai",
    description: "Bėgimas vietoje keliant kelius iki klubų aukščio. Rankos dirba ritmingai.",
    progressions: ["Žingsniavimas", "Pašokimai", "Aukšti keliai", "Sprinto tempu"],
  },
  // 29: Bear Crawl
  29: {
    name: "Meškos ėjimas",
    description:
      "Rankos ir pėdos, keliai vos virš grindų. Judėkite pirmyn laikydami klubus žemai ir lygiai.",
    progressions: ["Pirmyn", "Atbulomis", "Į šonus", "Su svoriu"],
  },
  // 30: Inchworm
  30: {
    name: "Vikšro pratimas",
    description:
      "Palinkite pirmyn, rankomis nueikite į lentą, kojomis grįžkite prie rankų. Tempimas ir stūmimas.",
    progressions: ["Bazinis", "Su atsispaudimu", "Ilgesnis", "Su voro žingsniu"],
  },
  // 31: Dips
  31: {
    name: "Atsispaudimai ant lygiagrečių",
    description:
      "Lygiagretės arba suoliukas. Leiskitės iki 90° alkūnėse, stumkitės aukštyn. Nedidelis palinkimas krūtinei.",
    progressions: ["Nuo suoliuko", "Ant lygiagrečių", "Ant žiedų", "Su svoriu"],
  },
  // 32: Pike Push-Up
  32: {
    name: "Atsispaudimai palinkus",
    description: "Apversta V padėtis, galvą leiskite tarp rankų. Vertikalaus stūmimo modelis.",
    progressions: ["Palinkus", "Ant paaukštinimo", "Prie sienos ant rankų", "Laisvai ant rankų"],
  },
  // 33: Archer Push-Up
  33: {
    name: "Lankininko atsispaudimai",
    description:
      "Rankos plačiai, svorį perkelkite ant vienos rankos, kita tiesiasi. Vienpusis stūmimas.",
    progressions: ["Platūs ats.", "Lankininko", "Pseudo planšo", "Vienos rankos"],
  },
  // 34: Pseudo Planche PU
  34: {
    name: "Pseudo planšo atsispaudimai",
    description:
      "Rankos prie klubų, pirštai atgal, palinkite pirmyn už rankų. Didelis pečių ir krūtinės krūvis.",
    progressions: ["Atsispaudimai", "Su palinkimu", "Pseudo planšo", "Sulenktas planšo"],
  },
  // 35: Hindu Push-Up
  35: {
    name: "Indiški atsispaudimai",
    description:
      "Tekantis judesys iš šuns pozos į žemą mostą ir kobrą. Nepertraukiama stuburo banga.",
    progressions: ["Lėtai", "Sklandžiai", "Greitai", "Bombonešio variantas"],
  },
  // 36: Typewriter Push-Up
  36: {
    name: "Spausdinimo mašinėlės atsispaudimai",
    description: "Leiskitės į vieną pusę, apačioje persislinkite į kitą, stumkitės aukštyn.",
    progressions: ["Platūs ats.", "Spausdinimo mašinėlės", "Lankininko", "Vienos rankos"],
  },
  // 37: Explosive Push-Up
  37: {
    name: "Sprogstamieji atsispaudimai",
    description:
      "Leiskitės kontroliuodami, tada stumkitės sprogstamai, kad rankos trumpam atsiplėštų nuo grindų.",
    progressions: ["Standartiniai", "Su plojimu", "Palietus krūtinę", "Supermeno"],
  },
  // 38: Clap Push-Up
  38: {
    name: "Atsispaudimai su plojimu",
    description:
      "Sprogstamas stūmimas į orą, plojimas, minkštas nusileidimas sulenktomis alkūnėmis.",
    progressions: ["Sprogstamieji", "Su plojimu", "Su dvigubu plojimu", "Supermeno"],
  },
  // 39: Wall Handstand PU
  39: {
    name: "Atsispaudimai ant rankų prie sienos",
    description:
      "Krūtine prie sienos stovint ant rankų. Galvą leiskite iki grindų, stumkitės atgal. Griežta forma.",
    progressions: [
      "Stovėjimas prie sienos",
      "Prie sienos",
      "Laisvai ant rankų",
      "Laisvi ats. ant rankų",
    ],
  },
  // 40: Ring Push-Up
  40: {
    name: "Atsispaudimai ant žiedų",
    description:
      "Atsispaudimai ant gimnastikos žiedų. Nuolatinis nestabilumas reikalauja papildomo stabilizavimo.",
    progressions: ["Ant skersinio", "Žemi žiedai", "Standartiniai žiedai", "Ant žiedų"],
  },
  // 41: Pull-Up
  41: {
    name: "Prisitraukimai",
    description:
      "Viršutinis griebimas. Smakrą kelkite virš skersinio. Pilnas kabėjimas tarp kartojimų. Be įsibėgėjimo.",
    progressions: ["Kabėjimas", "Menčių", "Neigiami", "Su guma", "Pilni", "Su svoriu"],
  },
  // 42: Chin-Up
  42: {
    name: "Prisitraukimai atvirkštiniu griebimu",
    description:
      "Apatinis griebimas pečių plotyje. Smakrą kelkite virš skersinio. Apačioje pilnas ištiesimas.",
    progressions: ["Su guma", "Pilni", "Siauru griebimu", "Su svoriu", "Vienos rankos su pagalba"],
  },
  // 43: Wide Pull-Up
  43: {
    name: "Platūs prisitraukimai",
    description: "Rankos plačiau nei pečiai. Akcentuoja nugaros plotį ir viršutinę nugarą.",
    progressions: ["Standartiniai prisitr.", "Platūs", "Labai platūs", "Lankininko"],
  },
  // 44: Close-Grip PU
  44: {
    name: "Prisitraukimai siauru griebimu",
    description:
      "Rankos arti viena kitos, viršutinis griebimas. Daugiau bicepsų ir vidinės nugaros.",
    progressions: ["Standartiniai", "Siauru griebimu", "Atvirkštiniu griebimu", "Vienos rankos"],
  },
  // 45: Commando Pull-Up
  45: {
    name: "Komandiniai prisitraukimai",
    description: "Rankos viena prieš kitą. Kaitaliokite, kurioje pusėje galva pralenda.",
    progressions: ["Standartiniai", "Neutraliu griebimu", "Komandiniai", "Spausdinimo mašinėlės"],
  },
  // 46: L-Sit Pull-Up
  46: {
    name: "Prisitraukimai su L padėtimi",
    description:
      "Viso prisitraukimo metu išlaikykite L formos kojų padėtį. Didžiulis liemens krūvis.",
    progressions: [
      "Sulenktos kojos kabant",
      "L kabėjimas",
      "Su L padėtimi",
      "Griežti su L padėtimi",
    ],
  },
  // 47: Toes-to-Bar
  47: {
    name: "Pirštais iki skersinio",
    description: "Kabėdami kelkite tiesias kojas iki skersinio. Kontroliuokite nusileidimą.",
    progressions: ["Kelių kėlimas", "Kojų kėlimas", "Pirštais iki skersinio", "Griežtai"],
  },
  // 48: Skin the Cat
  48: {
    name: "Persisukimas ant skersinio",
    description:
      "Iš kabėjimo susilenkite ir persukite kojas per skersinį. Grįžkite atgal. Pečių mobilumas.",
    progressions: ["Sulenktas vokiškas kabėjimas", "Praskėstomis kojomis", "Pilnas persisukimas"],
  },
  // 49: Archer Pull-Up
  49: {
    name: "Lankininko prisitraukimai",
    description: "Traukitės prie vienos rankos, kita ranka tiesiasi. Vienpusė traukimo jėga.",
    progressions: ["Su pagalba", "Platūs prisitr.", "Lankininko", "Vienos rankos"],
  },
  // 50: Typewriter Pull-Up
  50: {
    name: "Spausdinimo mašinėlės prisitraukimai",
    description:
      "Prisitraukite prie skersinio, persislinkite į šoną, leiskitės kitoje pusėje. Ekscentrinė kontrolė.",
    progressions: ["Platūs prisitr.", "Spausdinimo mašinėlės", "Lankininko", "Vienos rankos"],
  },
  // 51: Bulgarian Split Squat
  51: {
    name: "Bulgariški pritūpimai",
    description:
      "Užpakalinė pėda ant suoliuko. Priekinę koją lenkite iki ~90°. Puikus vienpusės jėgos pratimas.",
    progressions: ["Išpuoliai vietoje", "Su pakelta koja", "Bulgariški", "Su svoriu"],
  },
  // 52: Jump Squat
  52: {
    name: "Pritūpimai su šuoliu",
    description: "Pritūpkite ir sprogstamai iššokite. Nusileiskite minkštai sulenktais keliais.",
    progressions: ["Pritūpimai", "Su pauze", "Su šuoliu", "180°", "Su kelių traukimu"],
  },
  // 53: Lateral Lunge
  53: {
    name: "Šoniniai išpuoliai",
    description:
      "Ženkite plačiai į šoną, lenkite tą kelį, kita koja tiesi. Stumkitės atgal į pradinę padėtį.",
    progressions: ["Su kūno svoriu", "Reveransas", "Kazokiški pritūpimai"],
  },
  // 54: Cossack Squat
  54: {
    name: "Kazokiški pritūpimai",
    description:
      "Gilus šoninis pritūpimas — viena koja visiškai ištiesta, tupiama ant kitos. Reikia gero mobilumo.",
    progressions: ["Šoniniai išpuoliai", "Kazokiški", "Su svoriu", "Ant vienos kojos"],
  },
  // 55: Single-Leg Deadlift
  55: {
    name: "Mirties trauka ant vienos kojos",
    description:
      "Stovėdami ant vienos kojos lenkitės per klubą, liemenį leiskite lygiagrečiai grindims. Balansas ir lenkimas.",
    progressions: ["Su pagalba", "Su kūno svoriu", "Su svoriu", "Lėto tempo"],
  },
  // 56: Reverse Nordic Curl
  56: {
    name: "Atvirkštinis nordinis lenkimas",
    description:
      "Klūpėdami atsilošite laikydami klubus ištiestus. Nusileidimą kontroliuokite keturgalviais.",
    progressions: ["Dalinis palinkimas", "Pilnas palinkimas", "Lėtai", "Pilna amplitudė"],
  },
  // 57: Box Jump
  57: {
    name: "Šuoliai ant dėžės",
    description:
      "Sprogstamas šuolis ant dėžės iš stovimos padėties. Fiksuokite nusileidimą, nulipkite žemyn.",
    progressions: ["Užlipimai", "Žema dėžė", "Aukšta dėžė", "Šuolis nuo aukščio"],
  },
  // 58: Hip Thrust
  58: {
    name: "Klubų stūmimas",
    description:
      "Viršutinė nugara ant suoliuko, štanga ar kūno svoris ant klubų. Stumkite klubus iki pilno ištiesimo.",
    progressions: ["Tiltelis nuo grindų", "Klubų stūmimas", "Ant vienos kojos", "Pakeltas"],
  },
  // 59: L-Sit
  59: {
    name: "L sėdėjimas",
    description:
      "Rėmimasis ant lygiagrečių ar grindų. Kojos lygiagrečiai grindims, visiškai ištiestos. Laikykite.",
    progressions: ["Sulenktomis kojomis", "Viena koja", "Pilnas", "V sėdėjimas"],
  },
  // 60: Dragon Flag
  60: {
    name: "Drakono vėliava",
    description:
      "Suimkite suoliuką už galvos, kelkite kūną vertikaliai, tada lėtai leiskite jį tiesų kaip lentą.",
    progressions: [
      "Sulenktomis kojomis",
      "Praskėstomis kojomis",
      "Viena koja",
      "Pilna drakono vėliava",
    ],
  },
  // 61: Ab Wheel Rollout
  61: {
    name: "Ritinėlio ridenimas",
    description:
      "Nuo kelių ridenkite ratuką pirmyn iki pilno ištiesimo, tada traukite atgal. Liemuo įtemptas.",
    progressions: ["Dalinis", "Pilnas", "Stovint"],
  },
  // 62: V-Up
  62: {
    name: "V kėlimai",
    description:
      "Gulėdami tiesiai vienu metu kelkite tiesias kojas ir liemenį sudarydami V formą. Palieskite kojų pirštus.",
    progressions: ["Lenkimai", "Pilvo presas", "V kėlimai", "Su svoriu"],
  },
  // 63: Windshield Wiper
  63: {
    name: "Valytuvai",
    description:
      "Kabėdami ant skersinio tiesiomis kojomis sukite jas iš šono į šoną kaip valytuvą.",
    progressions: ["Sulenktomis kojomis", "Tiesiomis kojomis", "Lėtai", "Pilna amplitudė"],
  },
  // 64: Hollow Body Rock
  64: {
    name: "Supimasis įdubusiu kūnu",
    description:
      "Įdubusio kūno padėtis, supkitės pirmyn ir atgal kaip supamoji kėdė. Išlaikykite įtampą.",
    progressions: ["Laikymas", "Trumpas supimasis", "Pilnas supimasis", "Su svoriu"],
  },
  // 65: Russian Twist
  65: {
    name: "Rusiški sukimai",
    description:
      "Sėdėdami šiek tiek atsilošite, kojos pakeltos, sukite liemenį į šonus. Rankos suglaustos.",
    progressions: ["Kojos ant grindų", "Kojos pakeltos", "Su svoriu", "Lėtai"],
  },
  // 66: Handstand Push-Up
  66: {
    name: "Atsispaudimai ant rankų",
    description:
      "Prie sienos arba laisvai. Iš stovėjimo ant rankų leiskite galvą iki grindų ir stumkitės atgal.",
    progressions: ["Prie sienos", "Neigiami", "Pilni", "Laisvai"],
  },
  // 67: One-Arm Push-Up
  67: {
    name: "Vienos rankos atsispaudimai",
    description:
      "Pilnas atsispaudimas viena ranka. Kūnas lygiai, laisva ranka už nugaros ar prie šono.",
    progressions: ["Lankininko", "Lankininko su svoriu", "Vienos rankos neigiami", "Pilni"],
  },
  // 68: Planche Push-Up
  68: {
    name: "Planšo atsispaudimai",
    description:
      "Atsispaudimas pilnoje planšo padėtyje — kūnas horizontaliai, kojos nuo žemės. Aukščiausio lygio įgūdis.",
    progressions: ["Sulenkto planšo ats.", "Pažengęs sulenktas", "Praskėstomis kojomis", "Pilnas"],
  },
  // 69: 90-Degree PU
  69: {
    name: "90 laipsnių atsispaudimai",
    description:
      "Rankos ant grindų, kūną kelkite horizontaliai, sulenktą 90° kampu. Gimnastinis stūmimo įgūdis.",
    progressions: ["L sėdėjimas", "90° laikymas", "90° ats.", "Planšo"],
  },
  // 70: Superman Push-Up
  70: {
    name: "Supermeno atsispaudimai",
    description:
      "Sprogstamas atsispaudimas su plojimu, kai rankos iškeliamos pirmyn ir grąžinamos prieš nusileidžiant.",
    progressions: ["Ats. su plojimu", "Supermeno", "Su plojimu viena ranka"],
  },
  // 71: Ring Dip
  71: {
    name: "Atsispaudimai ant žiedų (gilūs)",
    description:
      "Atsispaudimai ant gimnastikos žiedų. Viršuje žiedai išsukami. Didžiausias stabilizatorių krūvis.",
    progressions: ["Ant lygiagrečių", "Žemi žiedai", "Ant žiedų", "Su svoriu"],
  },
  // 72: Tuck Planche Hold
  72: {
    name: "Sulenkto planšo laikymas",
    description:
      "Remdamiesi rankomis traukite kelius prie krūtinės ir kelkite visą kūną lygiagrečiai grindims.",
    progressions: [
      "Planšo palinkimas",
      "Sulenktas",
      "Pažengęs sulenktas",
      "Praskėstomis kojomis",
      "Pilnas",
    ],
  },
  // 73: Back Lever Hold
  73: {
    name: "Atgalinės svirties laikymas",
    description:
      "Iš kabėjimo sukite kūną atgal į horizontalią padėtį veidu žemyn. Statinis laikymas.",
    progressions: [
      "Persisukimas",
      "Vokiškas kabėjimas",
      "Sulenktas",
      "Praskėstomis kojomis",
      "Pilnas",
    ],
  },
  // 74: Muscle-Up
  74: {
    name: "Išsikėlimas ant skersinio",
    description:
      "Sprogstamas prisitraukimas pereinant virš skersinio į ištiestų rankų padėtį. Viso kūno galia.",
    progressions: ["Prisitraukimas ir ats.", "Krūtine iki skersinio", "Su įsibėgėjimu", "Griežtas"],
  },
  // 75: Strict Muscle-Up
  75: {
    name: "Griežtas išsikėlimas",
    description: "Išsikėlimas be jokio įsibėgėjimo. Grynos jėgos perėjimas virš skersinio.",
    progressions: ["Su įsibėgėjimu", "Griežtas su pagalba", "Pilnas griežtas"],
  },
  // 76: One-Arm Pull-Up
  76: {
    name: "Vienos rankos prisitraukimas",
    description: "Pilnas prisitraukimas viena ranka. Reikia išskirtinės nugaros ir griebimo jėgos.",
    progressions: ["Lankininko", "Vienos rankos su pagalba", "Su svoriu", "Viena ranka"],
  },
  // 77: Front Lever Hold
  77: {
    name: "Priekinės svirties laikymas",
    description:
      "Kabėdami ant skersinio laikykite kūną horizontaliai veidu aukštyn. Gryna nugaros ir liemens įtampa.",
    progressions: [
      "Sulenktas",
      "Pažengęs sulenktas",
      "Viena koja",
      "Praskėstomis kojomis",
      "Pilnas",
    ],
  },
  // 78: Front Lever Row
  78: {
    name: "Irklavimas priekinėje svirtyje",
    description:
      "Traukimas iš priekinės svirties padėties į irklavimą. Sunkiausias traukimo judesys.",
    progressions: [
      "Svirties laikymas",
      "Sulenktas irklavimas",
      "Praskėstomis kojomis",
      "Pilnas irklavimas",
    ],
  },
  // 79: Weighted Pull-Up
  79: {
    name: "Prisitraukimai su svoriu",
    description: "Prisitraukimas su papildomu svoriu ant diržo, liemenės arba tarp kelių.",
    progressions: ["Kūno svoriu", "+ 5 kg", "+ 10 kg", "+ 20 kg", "+ 30 kg"],
  },
  // 80: Ring Muscle-Up
  80: {
    name: "Išsikėlimas ant žiedų",
    description:
      "Išsikėlimas ant gimnastikos žiedų. Sunkiau nei ant skersinio — laisvas sukimasis visą judesį.",
    progressions: ["Ant skersinio", "Ant žemų žiedų", "Ant žiedų", "Griežtas ant žiedų"],
  },
  // 81: Maltese Cross Hold
  81: {
    name: "Maltos kryžiaus laikymas",
    description:
      "Rankos ištiestos 45° žemiau horizontalės rėmimosi padėtyje. Aukščiausio lygio statinis laikymas ant žiedų.",
    progressions: ["Rėmimasis", "Kryžius", "Žemas kryžius", "Maltos kryžius"],
  },
  // 82: Pistol Squat
  82: {
    name: "Pritūpimas ant vienos kojos",
    description:
      "Pilno gylio pritūpimas ant vienos kojos, kita ištiesta. Jėgos ir mobilumo derinys.",
    progressions: ["Su pagalba", "Iki dėžės", "Pilnas", "Su svoriu", "Drakono"],
  },
  // 83: Nordic Curl
  83: {
    name: "Nordinis lenkimas",
    description:
      "Klūpėkite, pėdos pritvirtintos. Leiskitės pirmyn kontroliuodami užpakaliniais šlaunų raumenimis. Traukitės atgal.",
    progressions: ["Tik ekscentrinis", "Dalinis", "Pilnas", "Su svoriu"],
  },
  // 84: Shrimp Squat
  84: {
    name: "Krevetės pritūpimas",
    description:
      "Pritūpimas ant vienos kojos, kai užpakalinė koja sulenkta už nugaros — kelias beveik liečia grindis.",
    progressions: ["Ant vienos kojos", "Krevetės su pagalba", "Pilnas krevetės", "Su svoriu"],
  },
  // 85: Dragon Squat
  85: {
    name: "Drakono pritūpimas",
    description:
      "Pritūpimo ant vienos kojos variantas su užpakaline koja sukryžiuota už nugaros, kulkšnis po klubu.",
    progressions: ["Ant vienos kojos", "Krevetės", "Drakono"],
  },
  // 86: Broad Jump
  86: {
    name: "Šuolis į tolį",
    description:
      "Sprogstamas šuolis nuo abiejų kojų maksimaliam nuotoliui. Nusileiskite minkštai sulenktais keliais.",
    progressions: [
      "Pritūpimai su šuoliu",
      "Šuolis ant dėžės",
      "Šuolis į tolį",
      "Trigubas šuolis į tolį",
    ],
  },
  // 87: Tuck Jump
  87: {
    name: "Šuolis su kelių traukimu",
    description:
      "Iššokite ir aukščiausiame taške traukite abu kelius prie krūtinės. Maksimali vertikali galia.",
    progressions: ["Pritūpimai su šuoliu", "Su kelių traukimu", "Su svoriu"],
  },
  // 88: Handstand Hold
  88: {
    name: "Stovėjimas ant rankų",
    description:
      "Įsispirkite arba išsikelkite į apverstą balansą. Rankos pečių plotyje, kūnas viena linija.",
    progressions: ["Prie sienos", "Įsispyrimas", "Krūtine į sieną", "Laisvai", "Ats. ant rankų"],
  },
  // 89: Planche Lean
  89: {
    name: "Planšo palinkimas",
    description: "Tiesiomis rankomis lenta palinkus toli už rankų. Pamatinis įgūdis pilnam planšo.",
    progressions: [
      "Palinkimas",
      "Sulenktas planšo",
      "Pažengęs sulenktas",
      "Praskėstomis kojomis",
      "Pilnas",
    ],
  },
  // 90: Manna Hold
  90: {
    name: "Manos laikymas",
    description:
      "Sėdimas rėmimosi laikymas su kojomis virš pečių aukščio. Aukščiausio lygio įgūdis.",
    progressions: ["V sėdėjimas", "Sulenkta mana", "Praskėstomis kojomis", "Pilna mana"],
  },
  // 91: Human Flag
  91: {
    name: "Žmogaus vėliava",
    description:
      "Suimkite vertikalų stulpą ir laikykite kūną horizontaliai kaip vėliavą. Ypatinga viso kūno įtampa.",
    progressions: ["Sulenktas", "Praskėstomis kojomis", "Pusiau ištiestas", "Pilna vėliava"],
  },
  // 92: Press to Handstand
  92: {
    name: "Išsikėlimas į stovėjimą ant rankų",
    description:
      "Iš L sėdėjimo ar palinkimo išsikelkite į laisvą stovėjimą ant rankų be įsispyrimo. Įgūdis ir jėga.",
    progressions: ["Praskėstomis kojomis", "Sulenktomis kojomis", "Palinkus", "Pilnas"],
  },
  // 93: Back Walkover
  93: {
    name: "Atgalinis persivertimas",
    description:
      "Iš tiltelio įsispirkite į stovėjimą ant rankų, nusileiskite po vieną koją. Gimnastikos įgūdis.",
    progressions: ["Tiltelis", "Tiltelis su kojos kėlimu", "Atgalinis persivertimas"],
  },
  // 94: Handstand Walk
  94: {
    name: "Ėjimas ant rankų",
    description:
      "Ėjimas rankomis stovint ant rankų. Balansas keičiasi su kiekvienu rankos judesiu.",
    progressions: ["Prie sienos", "Laikymas su laiku", "Atsispyrimas", "1 m ėjimas", "10 m"],
  },
  // 95: 360 Muscle-Up
  95: {
    name: "360° išsikėlimas",
    description:
      "Išsikėlimas su pilnu 360° apsisukimu viršuje prieš vėl suimant skersinį. Laisvojo stiliaus įgūdis.",
    progressions: ["Išsikėlimas", "360° su įsibėgėjimu", "Griežtas 360°"],
  },
  // 96: Iron Cross Hold
  96: {
    name: "Geležinio kryžiaus laikymas",
    description:
      "Ant žiedų rankos ištiestos tiksliai horizontaliai pečių aukštyje. Ilgas laikymas.",
    progressions: ["Rėmimasis", "Žemas kryžius", "Geležinis kryžius"],
  },
  // 97: Victorians Hold
  97: {
    name: "Viktorijos laikymas",
    description:
      "Rankos prie šonų, kūnas apverstas rėmimosi padėtyje. Žiedai arba skersinis. Aukščiausio lygio pečių jėga.",
    progressions: ["Rėmimasis", "L sėdėjimas", "Viktorijos progresija"],
  },
  // 98: One-Arm Hang
  98: {
    name: "Kabėjimas viena ranka",
    description:
      "Kabėjimas ant vienos rankos. Vienodas pečių ir nugaros krūvis vienoje pusėje. Ruošia vienos rankos prisitraukimui.",
    progressions: ["Dviem rankomis", "Viena ranka su pagalba", "Pilnas viena ranka"],
  },
  // 99: Plyo Pull-Up
  99: {
    name: "Pliometriniai prisitraukimai",
    description:
      "Sprogstamas prisitraukimas paleidžiant skersinį viršuje ir vėl pagaunant leidžiantis. Gryna galia.",
    progressions: ["Sprogstamieji", "Su paleidimu", "Su pagavimu", "Ant dviejų skersinių"],
  },
  // 100: Full Planche Hold
  100: {
    name: "Pilnas planšo laikymas",
    description:
      "Kūnas tobulai horizontaliai, rankos tiesios, visas kūnas nuo žemės. Aukščiausias įgūdis.",
    progressions: [
      "Sulenktas",
      "Pažengęs sulenktas",
      "Praskėstomis kojomis",
      "Pusiau ištiestas",
      "Pilnas planšo",
    ],
  },
};

/**
 * Overlay the Lithuanian name/description/progressions onto a library
 * exercise. Returns the exercise unchanged for English, for custom exercises
 * (negative or unseeded ids), and for any id without a translation.
 */
export function localizeCalisthenicsExercise<T extends CalisthenicsExerciseData>(
  exercise: T,
  lang: Lang,
): T {
  if (lang !== "LT") return exercise;
  const lt = calisthenicsExercisesLT[exercise.id];
  if (!lt) return exercise;
  return { ...exercise, name: lt.name, description: lt.description, progressions: lt.progressions };
}

/**
 * Lithuanian name for a library exercise, given the row the API resolved (or
 * undefined for a custom exercise). Falls back to `fallback` for English, for
 * custom exercises, and for ids without a translation.
 */
export function localizedCalisthenicsName(
  exercise: { id: number; name: string } | undefined | null,
  lang: Lang,
  fallback: string,
): string {
  if (!exercise) return fallback;
  if (lang !== "LT") return exercise.name;
  return calisthenicsExercisesLT[exercise.id]?.name ?? exercise.name;
}
