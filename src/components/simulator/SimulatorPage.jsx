"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Volume2, X, Target, Users, GraduationCap, Pause, RotateCcw,Download,Maximize2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import i18n from "../../i18n"
import {
  getLabel,
  STREAMS,
  COURSES,
  COLLEGES,
  SCHOLARSHIPS,
  SAMPLE_SCENARIOS,
  COLLEGE_TYPES,
  SKILLS,
  UPSKILLS,
  currency,
  PERKS,
  generateNarrative,
} from "../../utils/careerStream";
import FlowChart from "./flowchart"


import exportSummary from "./exportSummary"

/* -----------------------
   MAIN COMPONENT
   ----------------------- */
export default function SimulatorPage() {
  const { t } = useTranslation()

  const [scenarios, setScenarios] = useState(SAMPLE_SCENARIOS)
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0)
  const active = scenarios[activeScenarioIndex] || SAMPLE_SCENARIOS[0]

  // local UI state (keeps in sync with active scenario)
  const [stream, setStream] = useState(active.stream)
  const [course, setCourse] = useState(active.course)
  const [collegeType, setCollegeType] = useState(active.collegeType)
  const [college, setCollege] = useState(active.college)
  const [skills, setSkills] = useState(active.skills || [])
  const [upskill, setUpskill] = useState(active.upskill || [])
  const [scholarship, setScholarship] = useState(active.scholarship || "")
  const [playgroundMode, setPlaygroundMode] = useState(false)
  const [govtFirst, setGovtFirst] = useState(true)
  const [showFullChart, setShowFullChart] = useState(false);

  // voice
  const [voiceConsent, setVoiceConsent] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcripts, setTranscripts] = useState([])
  const [dockExpanded, setDockExpanded] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(typeof window !== "undefined" && window.speechSynthesis ? window.speechSynthesis : null)

  /* NEW: State for TTS pause/resume control */
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // derived
  const totalPoints = useMemo(
    () => scenarios.reduce((acc, s) => acc + Math.round((s.npv || 0) / 100000), 0),
    [scenarios],
  )
  const badges = useMemo(() => {
    const out = []
    if (totalPoints >= 50) out.push("Career Pro")
    if (totalPoints >= 30) out.push("Explorer")
    if (totalPoints >= 10) out.push("Beginner")
    return out
  }, [totalPoints])

  /* Keep local UI state synced when active scenario changes */
  useEffect(() => {
    setStream(active?.stream || "")
    setCourse(active?.course || "")
    setCollegeType(active?.collegeType || "")
    setCollege(active?.college || "")
    setSkills(active?.skills || [])
    setUpskill(active?.upskill || [])
    setScholarship(active?.scholarship || "")
  }, [activeScenarioIndex, scenarios])

  /* When stream changes update course to a sensible default */
  useEffect(() => {
    const list = COURSES[stream] || []
    if (list.length > 0 && !list.find((c) => c.id === course)) {
      setCourse(list[0].id)
    } else if (list.length === 0) {
      setCourse("")
    }
  }, [stream])

  /* When collegeType changes pick first college */
  useEffect(() => {
    const list = COLLEGES[collegeType] || []
    if (list.length > 0 && !list.find((c) => c.id === college)) {
      setCollege(list[0].id)
    } else if (list.length === 0) {
      setCollege("")
    }
  }, [collegeType])

  /* Voice: setup / teardown SpeechRecognition */
  useEffect(() => {
    if (!voiceConsent) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null
          recognitionRef.current.onend = null
          recognitionRef.current.onerror = null
          recognitionRef.current = null
        } catch {}
      }
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not available in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    switch (i18n.language) {
      case "en":
        recognition.lang = "Google Canada English"
        break
      case "ur":
        recognition.lang = "ur-PK"
        break
      default:
        recognition.lang = "hi-IN"
    }
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
      setTranscripts((prev) => [...prev, transcript])
    }

    recognition.onerror = (err) => {
      console.warn("Speech recognition error:", err)
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.onresult = null
        recognition.onend = null
        recognition.onerror = null
        recognitionRef.current = null
      } catch {}
    }
  }, [voiceConsent, i18n.language])

  const toggleListening = () => {
    if (!voiceConsent) {
      alert(t("consentMic"))
      return
    }
    const rec = recognitionRef.current
    if (!rec) {
      alert("Speech recognition is not available in this browser.")
      return
    }
    if (listening) {
      try {
        rec.stop()
      } catch {}
      setListening(false)
    } else {
      try {
        rec.start()
        setListening(true)
      } catch (err) {
        console.warn("Failed to start recognition", err)
        setListening(false)
      }
    }
  }

  /* NEW: Handle pause/resume and restart for TTS */
  const handlePauseTts = () => {
    if (synthRef.current) {
      if (isPaused) {
        synthRef.current.resume()
        setIsPaused(false)
      } else {
        synthRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const handleRestartTts = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }

  /* TTS */
  const playTts = (text) => {
    if (!text || typeof text !== "string") return
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Your browser doesn't support text-to-speech.")
      return
    }
    try {
      if (synthRef.current && synthRef.current.speaking) synthRef.current.cancel()
      const u = new SpeechSynthesisUtterance(text)
      switch (i18n.language) {
        case "en":
          u.lang = "Google Canada English"
          break
        case "ur":
          u.lang = "ur-PK"
          break
        default:
          u.lang = "hi-IN"
      }
      u.rate = 1
      u.pitch = 1

      /* NEW: Update speaking state */
      u.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }
      u.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      synthRef.current.speak(u)
    } catch (err) {
      console.warn("TTS failed:", err)
    }
  }

  /* Export summary (unchanged, but robust) */
//   const exportSummary = () => {
//   try {
//     const doc = new jsPDF({
//       orientation: "portrait",
//       unit: "pt",
//       format: "A4",
//     });

//     const colHeaders = [
//       "Scenario",
//       "Name",
//       "Stream",
//       "Course",
//       "College Type",
//       "College",
//       "Skills",
//       "Upskill",
//       "Scholarship",
//       "NPV",
//       "ROI",
//       "Employment Prob.",
//       "Starting Salary",
//       "Time to Job",
//       "Scholarship Odds",
//     ];

//     const rows = scenarios.map((s, i) => [
//       `${i + 1}`,
//       s.name || `${t("scenario")} ${i + 1}`,
//       getLabel(STREAMS.find((st) => st.id === s.stream), i18n.language) || "",
//       getLabel(
//         (COURSES[s.stream] || []).find((c) => c.id === s.course),
//         i18n.language
//       ) || "",
//       getLabel(
//         COLLEGE_TYPES.find((ct) => ct.id === s.collegeType),
//         i18n.language
//       ) || "",
//       getLabel(
//         (COLLEGES[s.collegeType] || []).find((cl) => cl.id === s.college),
//         i18n.language
//       ) || "",
//       (s.skills || [])
//         .map((sk) =>
//           getLabel(SKILLS.find((skl) => skl.id === sk), i18n.language)
//         )
//         .join(", "),
//       (s.upskill || [])
//         .map((u) =>
//           getLabel(UPSKILLS.find((up) => up.id === u), i18n.language)
//         )
//         .join(", "),
//       getLabel(
//         SCHOLARSHIPS.find((sch) => sch.id === s.scholarship),
//         i18n.language
//       ) || "",
//       s.npv ? currency(s.npv) : "-",
//       s.roi ?? "-",
//       s.employmentProb ? `${(s.employmentProb * 100).toFixed(1)}%` : "-",
//       s.startingSalary ? currency(s.startingSalary) : "-",
//       s.timeToJob ? `${s.timeToJob} ${t("months")}` : "-",
//       s.scholarshipOdds ? `${(s.scholarshipOdds * 100).toFixed(1)}%` : "-",
//     ]);

//     // Add title
//     doc.setFontSize(18);
//     doc.text("Career Analysis Report", 40, 40);

//     // Line break
//     doc.setFontSize(12);
//     doc.text(
//       `Generated on: ${new Date().toLocaleDateString()}`,
//       40,
//       60
//     );

//     autoTable(doc, {
//   head: [colHeaders],
//   body: rows,
//   startY: 80,
//   margin: { left: 40, right: 40 },
//   styles: {
//     fontSize: 8,
//     cellPadding: 4,
//   },
//   headStyles: {
//     fillColor: [56, 90, 190],
//     textColor: 255,
//   },
//   alternateRowStyles: {
//     fillColor: [240, 240, 240],
//   },
// });


//     doc.save("career_summary.pdf");

//   } catch (err) {
//     console.warn("Export failed:", err);
//   }
// };

// Dynamic perks for military.
  const dynamicPerks = useMemo(() => {
    const base = { ...PERKS };
    if (stream === "public_service") {
      base.jobSecurity.score = 10;
      base.pension.coverage = "100%";
      base.competition.ratio = "1:200"; // High entry, low turnover.
      base.postings.variety = "Global Deployments";
    }
    return base;
  }, [stream]);
  /* Small helpers */
  const toggleSkill = (id) => setSkills((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleUpskill = (id) => setUpskill((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  /* Playground auto-experiment - same behavior but with small UI tweak */
  const autoExperiment = () => {
    setScenarios((prevScenarios) => {
      if (prevScenarios.length === 0) return prevScenarios
      const newScenarios = [...prevScenarios]
      const activeScenario = { ...newScenarios[activeScenarioIndex] }
      const newStream = STREAMS[Math.floor(Math.random() * STREAMS.length)].id
      activeScenario.stream = newStream
      const coursesForStream = COURSES[newStream] || []
      activeScenario.course =
        coursesForStream.length > 0 ? coursesForStream[Math.floor(Math.random() * coursesForStream.length)].id : ""
      const newCollegeType = COLLEGE_TYPES[Math.floor(Math.random() * COLLEGE_TYPES.length)].id
      activeScenario.collegeType = newCollegeType
      const collegesForType = COLLEGES[newCollegeType] || []
      activeScenario.college =
        collegesForType.length > 0 ? collegesForType[Math.floor(Math.random() * collegesForType.length)].id : ""
      const skillCount = Math.floor(Math.random() * 2) + 1
      activeScenario.skills = SKILLS.sort(() => 0.5 - Math.random())
        .slice(0, skillCount)
        .map((s) => s.id)
      const upskillCount = Math.floor(Math.random() * 2)
      activeScenario.upskill = UPSKILLS.sort(() => 0.5 - Math.random())
        .slice(0, upskillCount)
        .map((u) => u.id)
      activeScenario.scholarship =
        Math.random() > 0.5 ? SCHOLARSHIPS[Math.floor(Math.random() * SCHOLARSHIPS.length)].id : ""
      const perturb = (v, pct = 0.12) => Math.round(v * (1 + (Math.random() * 2 - 1) * pct))
      activeScenario.npv = perturb(activeScenario.npv || 800000)
      activeScenario.roi = +((activeScenario.roi || 1.2) * (1 + (Math.random() * 2 - 1) * 0.05)).toFixed(2)
      activeScenario.employmentProb = Math.min(
        1,
        Math.max(0, (activeScenario.employmentProb || 0.6) + (Math.random() * 2 - 1) * 0.05),
      )
      activeScenario.startingSalary = perturb(activeScenario.startingSalary || 300000)
      activeScenario.timeToJob = Math.max(
        1,
        Math.round((activeScenario.timeToJob || 6) * (1 + (Math.random() * 2 - 1) * 0.15)),
      )
      activeScenario.scholarshipOdds = Math.min(
        1,
        Math.max(0, (activeScenario.scholarshipOdds || 0.4) + (Math.random() * 2 - 1) * 0.05),
      )
      newScenarios[activeScenarioIndex] = activeScenario
      return newScenarios
    })
    setPlaygroundMode(true)
    setTimeout(() => setPlaygroundMode(false), 2200)
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ur", name: "اردو" },
    { code: "dogri", name: "डोगरी" },
    { code: "gojri", name: "गोजरी" },
    { code: "pahari", name: "पहाड़ी" },
  ]

  /* Apply local edits back to scenarios (Save changes to active scenario) */
  const saveActiveChanges = () => {
    setScenarios((prev) => {
      const copy = [...prev]
      const s = { ...(copy[activeScenarioIndex] || {}) }
      s.stream = stream
      s.course = course
      s.collegeType = collegeType
      s.college = college
      s.skills = skills
      s.upskill = upskill
      s.scholarship = scholarship
      copy[activeScenarioIndex] = s
      return copy
    })
  }
  {showFullChart && (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
    
    {/* Top Bar */}
    <div className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shadow-lg">
      <h2 className="text-lg font-semibold">
        Full Screen Career Flowchart
      </h2>

      <button
        onClick={() => setShowFullChart(false)}
        className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition flex items-center gap-2"
      >
        <span>Close</span>
      </button>
    </div>

    {/* Full Screen Chart Container */}
    <div className="flex-1 relative overflow-hidden">
      <FlowChart
        active={active}
        getLabel={getLabel}
        lang={i18n.language}
        t={t}
        dynamicPerks={dynamicPerks}
        fullscreen
      />
    </div>
  </div>
)}


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-900 font-sans selection:bg-indigo-300 selection:text-white">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-base md:text-lg opacity-95">{t("subtitle")}</p>

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-white/10 text-white border border-white/20 focus:outline-none"
                aria-label="Select language"
              >
                {languages.map(({ code, name }) => (
                  <option key={code} value={code} className="text-black">
                    {name}
                  </option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={govtFirst}
                  onChange={() => setGovtFirst(!govtFirst)}
                  className="h-5 w-5 rounded border-transparent focus:ring-2 focus:ring-offset-1 focus:ring-white cursor-pointer"
                />
                <span className="text-white font-semibold">{t("governmentFirst")}</span>
              </label>

              <button
                onClick={autoExperiment}
                className="ml-2 inline-flex items-center gap-2 bg-white text-indigo-700 px-3 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md"
                title="Auto experiment"
              >
                <Target className="w-4 h-4" />
                {t("autoExperiment")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm opacity-80">{t("totalScenarios")}</div>
              <div className="text-2xl md:text-3xl font-extrabold">{scenarios.length}</div>
            </div>

            <motion.div
              initial={{ scale: 0.98 }}
              animate={playgroundMode ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 1.2 }}
              className="bg-white bg-opacity-20 rounded-xl px-5 py-3 flex items-center gap-4"
            >
              <Target className="w-7 h-7 text-white" />
              <div>
                <div className="text-xs opacity-80">{t("engagement")}</div>
                <div className="font-semibold">{t("high")}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 pb-40 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT: Controls */}
        <aside className="md:col-span-3 bg-white rounded-3xl p-6 shadow-xl sticky top-24 border border-indigo-100">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">
            {t("stream")} & {t("course")}
          </h3>

          <div className="space-y-4">
            <Select label={t("stream")} value={stream} options={STREAMS} lang={i18n.language} onChange={setStream} />
            <Select
              label={t("course")}
              value={course}
              options={COURSES[stream] || []}
              lang={i18n.language}
              onChange={setCourse}
              disabled={!stream}
            />
            <Select
              label={t("collegeType")}
              value={collegeType}
              options={COLLEGE_TYPES}
              lang={i18n.language}
              onChange={setCollegeType}
            />
            <Select
              label={t("college")}
              value={college}
              options={COLLEGES[collegeType] || []}
              lang={i18n.language}
              onChange={setCollege}
              disabled={!collegeType}
            />
          </div>

          <hr className="my-5 border-indigo-100" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-indigo-700">{t("skills")}</h4>
              <button onClick={() => setSkills([])} className="text-sm text-indigo-500 hover:underline">
                {t("clear")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <Chip key={s.id} active={skills.includes(s.id)} onClick={() => toggleSkill(s.id)}>
                  {getLabel(s, i18n.language)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-indigo-700">{t("upskill")}</h4>
              <button onClick={() => setUpskill([])} className="text-sm text-indigo-500 hover:underline">
                {t("clear")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {UPSKILLS.map((u) => (
                <Chip key={u.id} active={upskill.includes(u.id)} onClick={() => toggleUpskill(u.id)}>
                  {getLabel(u, i18n.language)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-semibold text-indigo-700">{t("scholarships")}</label>
            <select
              value={scholarship}
              onChange={(e) => setScholarship(e.target.value)}
              className="w-full rounded-lg p-3 border border-indigo-100 focus:outline-none"
            >
              <option value="">{`-- ${t("select")} --`}</option>
              {SCHOLARSHIPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {getLabel(s, i18n.language)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                const copy = [...scenarios]
                copy.push({
                  ...copy[activeScenarioIndex],
                  id: `sc${Date.now()}`,
                  name: `${t("scenario")} ${copy.length + 1}`,
                })
                setScenarios(copy)
                setActiveScenarioIndex(copy.length - 1)
              }}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-3 font-semibold shadow"
            >
              + {t("addScenario")}
            </button>
            <button
              onClick={() => {
                setStream("")
                setCourse("")
                setCollegeType("")
                setCollege("")
                setSkills([])
                setUpskill([])
                setScholarship("")
              }}
              className="px-4 py-3 border border-indigo-100 rounded-2xl text-indigo-700"
            >
              {t("reset")}
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={saveActiveChanges}
              className="flex-1 bg-white border border-indigo-100 rounded-full py-2 text-indigo-700"
            >
              Save
            </button>
            <button onClick={() =>
    exportSummary({
      scenarios,
      STREAMS,
      COURSES,
      COLLEGE_TYPES,
      COLLEGES,
      SKILLS,
      UPSKILLS,
      SCHOLARSHIPS,
      t,
      i18n,
      currency,
      getLabel,
    })
  } className="px-4 py-2 bg-indigo-50 rounded-full">
              Export
            </button>
          </div>
        </aside>

        {/* CENTER: Visualizer */}
       <main className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {active?.name || `Scenario ${activeScenarioIndex + 1}`}
                </h2>
                <p className="text-gray-500 text-sm">Interactive Career Path Visualization</p>
              </div>

              {/* Top Stats Row */}
              <div className="flex gap-4 mb-8">
                <StatPill
                  icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
                  label="ROI"
                  value={`${active?.roi?.toFixed(2) || "-"}x`}
                />
                <StatPill
                  icon={<Users className="w-5 h-5 text-blue-400" />}
                  label="Employment %"
                  value={`${((active?.employmentProb || 0) * 100).toFixed(0)}%`}
                />
              </div>
{showFullChart && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] animate-fadeIn">
    {/* Overlay with subtle gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-blue-900/20"></div>
    
    <div className="relative bg-white/95 backdrop-blur-lg w-[98vw] h-[98vh] max-w-[2000px] max-h-[98vh] rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-slideUp">
      
      {/* Enhanced Top Bar: Glassmorphism + Icons + Search */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-800">Career Flowchart Explorer</h2>
            <p className="text-sm text-gray-600">Navigate your future paths interactively</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Optional Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search careers..."
              className="pl-10 pr-4 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-64"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Tools */}
          <button className="p-2 text-gray-600 hover:text-indigo-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
          
          {/* Fullscreen Toggle (if nested) */}
          <button className="p-2 text-gray-600 hover:text-indigo-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          {/* Close Button */}
          <button
            onClick={() => setShowFullChart(false)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Content Area: Full bleed with subtle padding */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        {/* Optional Sidebar for Filters/Legend (Collapsible) */}
        <div className="absolute left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 transform translate-x-0 transition-transform duration-300 md:translate-x-0 z-20">
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Stream Filters</h3>
            <div className="space-y-2">
              {['Science', 'Commerce', 'Arts', 'Vocational', 'New-Age'].map((stream) => (
                <label key={stream} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">{stream}</span>
                </label>
              ))}
            </div>
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Apply Filters
            </button>
          </div>
        </div>

        {/* FlowChart with Zero Padding in Fullscreen */}
        <div className="absolute inset-0 md:left-64"> {/* Offset for sidebar */}
          <FlowChart
            isFullScreen={true}
            onCloseFullScreen={() => setShowFullChart(false)}
            active={active}
            getLabel={getLabel}
            lang={i18n.language}
            t={t}
            dynamicPerks={dynamicPerks}
          />
        </div>
      </div>

      {/* Bottom Bar: Legend/Key + Export */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Science</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Commerce</span>
          </div>
          {/* Add more legend items as needed */}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm">
            Export PNG
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition text-sm">
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
)}


              {/* Flowchart Visualization Area - LARGE SPACE */}
              <div className="relative bg-gradient-to-br from-slate-50/70 via-white/90 to-indigo-50/30 rounded-xl p-6 lg:p-8 border border-indigo-100/40 shadow-inner lg:shadow-md min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] flex items-center justify-center overflow-hidden">
            <FlowChart
              active={active}
              getLabel={getLabel}
              lang={i18n.language}
              t={t}
              dynamicPerks={dynamicPerks}
            />
            <button
              onClick={() => setShowFullChart(true)}
              className="absolute top-4 right-4 z-10 p-3 lg:p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              title="Expand to Full Screen"
            >
              <Maximize2 className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

              {/* Key Metrics Cards */}
              <div className="space-y-3 mb-8 mt-4">
                <div className="rounded-xl p-4 border border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 font-semibold">Starting Salary</div>
                      <div className="text-2xl font-bold text-gray-900">{currency(active?.startingSalary || 0)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-semibold">Time to Job</div>
                      <div className="text-xl font-bold text-gray-900">{active?.timeToJob} months</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-gray-700">Scholarship Odds</div>
                    <div className="font-bold text-blue-600">{Math.round((active?.scholarshipOdds || 0) * 100)}%</div>
                  </div>
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.round((active?.scholarshipOdds || 0) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sensitivity Lens Slider
              <div className="mb-8">
                <label className="block mb-3 font-semibold text-gray-700">Sensitivity Lens</label>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number.parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg accent-blue-600"
                  aria-label="Sensitivity Lens"
                />
              </div> */}

              {/* Narration Control Section */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                  <button
                    onClick={() => playTts(generateNarrative(active, i18n.language))}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    {/* p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:scale-105 transition */}
                    <Volume2 className="w-4 h-4" />
                    Play Narration
                  </button>
                  <button
                    onClick={handlePauseTts}
                    disabled={!isSpeaking}
                    className="px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                    title={isPaused ? "Resume" : "Pause"}
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRestartTts}
                    disabled={!isSpeaking}
                    className="px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Export Section */}
                <button
                  onClick={() =>
    exportSummary({
      scenarios,
      STREAMS,
      COURSES,
      COLLEGE_TYPES,
      COLLEGES,
      SKILLS,
      UPSKILLS,
      SCHOLARSHIPS,
      t,
      i18n,
      currency,
      getLabel,
    })
  }
                  className="w-full border-2 border-blue-600 text-purple-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Summary
                </button>
              </div>
            </div>
          </main>

        {/* RIGHT: Summary rail */}
        <aside className="md:col-span-3">
          <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-24 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-indigo-700">{t("summary")}</h4>
              <div className="text-indigo-600 font-semibold">
                {t("points")}: {totalPoints}
              </div>
            </div>

            <div className="space-y-4">
              <SummaryCard title={t("npv")} value={currency(active?.npv || 0)} hint={t("netPresentValue")} />
              <SummaryCard title={t("roi")} value={(active?.roi || 0).toFixed(2)} hint={t("returnOnInvestment")} />
              <SummaryCard
                title={t("employ")}
                value={`${((active?.employmentProb || 0) * 100).toFixed(1)}%`}
                hint={t("employmentProbability")}
              />
              <SummaryCard
                title={t("startingSalary").split(" ")[0]}
                value={currency(active?.startingSalary || 0)}
                hint={t("averageStartingSalary")}
              />
              <SummaryCard
                title={t("timeToJob")}
                value={`${active?.timeToJob} ${t("months")}`}
                hint={t("typicalTimeToEmployment")}
              />
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-indigo-700">{t("badges_1")}</h5>
              <div className="flex flex-wrap gap-2">
                {badges.length === 0 ? (
                  <div className="text-indigo-400 italic">{t("noBadgesYet")}</div>
                ) : (
                  badges.map((b) => <Badge key={b}>{b}</Badge>)
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => alert("Share to parents (mock)")}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl"
              >
                {" "}
                {t("share")}
              </button>
              <button
                onClick={() => alert("Save scenario (mock)")}
                className="flex-1 border border-indigo-100 py-2 rounded-xl text-indigo-700"
              >
                {" "}
                {t("save")}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-6">{t("scenarios") || "Scenarios"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, idx) => {
            const streamLabel = getLabel(
              STREAMS.find((s) => s.id === scenario.stream),
              i18n.language,
            )
            const courseLabel = getLabel(
              (COURSES[scenario.stream] || []).find((c) => c.id === scenario.course),
              i18n.language,
            )
            const collegeLabel = getLabel(
              (COLLEGES[scenario.collegeType] || []).find((cl) => cl.id === scenario.college),
              i18n.language,
            )
            const skillLabels = (scenario.skills || [])
              .map((sk) =>
                getLabel(
                  SKILLS.find((skl) => skl.id === sk),
                  i18n.language,
                ),
              )
              .join(", ")
            const scholarshipLabel = getLabel(
              SCHOLARSHIPS.find((sch) => sch.id === scenario.scholarship),
              i18n.language,
            )

            return (
              <motion.div
                key={scenario.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition"
              >
                {/* Header with name and buttons */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-indigo-700">
                      {scenario.name || `${t("scenario")} ${idx + 1}`}
                    </h3>
                    <p className="text-xs text-indigo-400 mt-1">{t("pathDetails") || "Path Details"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playTts(generateNarrative(scenario, i18n.language))}
                      className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:scale-105 transition"
                      title={t("listen") || "Listen"}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const narrativeText = generateNarrative(scenario, i18n.language)
                        const blob = new Blob([narrativeText], { type: "text/plain;charset=utf-8" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `scenario_${idx + 1}_narrative.txt`
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                        URL.revokeObjectURL(url)
                      }}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
                      title={t("export") || "Export"}
                    >
                      <X className="w-4 h-4" style={{ transform: "rotate(45deg)" }} />
                    </button>
                  </div>
                </div>

                {/* Selection Details */}
                <div className="mb-4 pb-4 border-b border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-600 mb-3 uppercase">
                    {t("selected") || "Selected"}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-indigo-500 font-semibold">{t("stream")}:</span>{" "}
                      <span className="text-gray-700">{streamLabel}</span>
                    </div>
                    <div>
                      <span className="text-indigo-500 font-semibold">{t("course")}:</span>{" "}
                      <span className="text-gray-700">{courseLabel}</span>
                    </div>
                    <div>
                      <span className="text-indigo-500 font-semibold">{t("college")}:</span>{" "}
                      <span className="text-gray-700">{collegeLabel}</span>
                    </div>
                    {skillLabels && (
                      <div>
                        <span className="text-indigo-500 font-semibold">{t("skills")}:</span>{" "}
                        <span className="text-gray-700">{skillLabels}</span>
                      </div>
                    )}
                    {scholarshipLabel && (
                      <div>
                        <span className="text-indigo-500 font-semibold">{t("scholarships")}:</span>{" "}
                        <span className="text-gray-700">{scholarshipLabel}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics Results */}
                <div>
                  <div className="text-xs font-semibold text-indigo-600 mb-3 uppercase">
                    {t("results") || "Results & Statistics"}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("roi")}:</span>
                      <span className="font-bold text-indigo-700">{(scenario.roi || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("employ")} %:</span>
                      <span className="font-bold text-indigo-700">
                        {((scenario.employmentProb || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("startingSalary")}:</span>
                      <span className="font-bold text-indigo-700">{currency(scenario.startingSalary || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("timeToJob")}:</span>
                      <span className="font-bold text-indigo-700">
                        {scenario.timeToJob} {t("months")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("scholarshipOdds")}:</span>
                      <span className="font-bold text-indigo-700">
                        {Math.round((scenario.scholarshipOdds || 0) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                      <span className="text-sm text-indigo-700 font-semibold">{t("npv")}:</span>
                      <span className="font-bold text-indigo-700">{currency(scenario.npv || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Narration controls at bottom */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        handleRestartTts()
                      } else {
                        playTts(generateNarrative(scenario, i18n.language))
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:scale-[1.01] transition text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    {isSpeaking ? t("restart") || "Restart" : t("listen") || "Listen"}
                  </button>
                  <button
                    onClick={handlePauseTts}
                    disabled={!isSpeaking}
                    className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title={isPaused ? t("resume") || "Resume" : t("pause") || "Pause"}
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* VOICE DOCK */}
      <VoiceDock
        lang={i18n.language}
        setLang={i18n.changeLanguage}
        voiceConsent={voiceConsent}
        setVoiceConsent={setVoiceConsent}
        listening={listening}
        toggleListening={toggleListening}
        transcripts={transcripts}
        playTts={playTts}
        expanded={dockExpanded}
        setExpanded={setDockExpanded}
        t={t}
        clearTranscripts={() => setTranscripts([])}
      />
    </div>
  )
}

/* PRESENTATIONAL SMALL COMPONENTS */

function Select({ label, value, onChange, options = [], disabled = false, lang = "en" }) {
  return (
    <label className="block">
      <div className="text-sm text-indigo-700 mb-2 font-semibold">{label}</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl p-3 border border-indigo-100 shadow-sm focus:outline-none"
        aria-label={label}
      >
        <option value="">{`-- ${label} --`}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {getLabel(opt, lang)}
          </option>
        ))}
      </select>
    </label>
  )
}

function Chip({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${active ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : "bg-white border-indigo-100 text-indigo-700"}`}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

function StatPill({ icon, label, value }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl px-3 py-2 shadow-sm flex items-center gap-3 min-w-[92px]">
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">{icon}</div>
      <div className="text-right">
        <div className="text-xs text-indigo-500 font-semibold">{label}</div>
        <div className="font-bold text-indigo-700 text-lg">{value}</div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, hint }) {
  return (
    <div className="border border-indigo-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-indigo-700">{title}</div>
        <div className="text-xs text-indigo-400 italic">{hint}</div>
      </div>
      <div className="mt-3 text-xl font-extrabold text-indigo-900">{value}</div>
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
      {children}
    </span>
  )
}

/* VOICE DOCK */
function VoiceDock({
  lang,
  setLang,
  voiceConsent,
  setVoiceConsent,
  listening,
  toggleListening,
  transcripts,
  playTts,
  expanded,
  setExpanded,
  t,
  clearTranscripts,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setExpanded(false)
    }
    if (expanded) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded, setExpanded])

  const panelWidthClass = "w-full max-w-md md:max-w-sm lg:max-w-md"

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50 flex items-end justify-end">
        <button
          aria-expanded={expanded}
          aria-label={expanded ? t("close") : t("voiceAssistant")}
          onClick={() => setExpanded((v) => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          title={t("voiceAssistant")}
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <>
            <div
              onClick={() => setExpanded(false)}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.16 }}
              className={`fixed z-50 inset-0 flex items-end md:items-center justify-center md:justify-end p-4`}
            >
              <div
                className={`${panelWidthClass} bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden`}
              >
                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-full text-white">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-700">{t("voiceAssistant")}</div>
                      <div className="text-xs text-neutral-500">{t("tryCommands")}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const currentIndex = languagesList.findIndex((l) => l.code === lang)
                        const nextIndex = (currentIndex + 1) % languagesList.length
                        setLang(languagesList[nextIndex].code)
                      }}
                      className="text-xs px-3 py-1 border rounded-lg text-indigo-700"
                    >
                      {lang === "en" ? "हिंदी" : "EN"}
                    </button>

                    <button
                      onClick={() => setExpanded(false)}
                      className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
                      aria-label={t("close")}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
                  {!voiceConsent ? (
                    <div className="p-4 bg-indigo-50 rounded-lg text-center">
                      <p className="text-sm text-indigo-700 mb-3">{t("consentMic")}</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setVoiceConsent(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                        >
                          {t("consentAccept")}
                        </button>
                        <button onClick={() => setVoiceConsent(false)} className="px-4 py-2 border rounded-lg">
                          {t("consentDecline")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <MicButton active={listening} onClick={toggleListening} />
                        <div className="flex-1">
                          <div className="text-xs text-neutral-500 mb-2 font-mono">
                            {t("listening")}:{" "}
                            <span className={listening ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                              {listening ? t("on") : t("off")}
                            </span>
                          </div>
                          <div className="h-36 overflow-auto bg-neutral-50 rounded-lg p-3 text-xs font-mono text-neutral-800">
                            {transcripts.length === 0 ? (
                              <div className="text-neutral-400 italic">{t("noTranscriptsYet")}</div>
                            ) : (
                              transcripts.map((tr, i) => (
                                <div key={i} className="mb-1 break-words">
                                  {tr}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => playTts(transcripts.join(" "))}
                            className="p-2 bg-indigo-50 rounded-md"
                          >
                            <Volume2 className="w-5 h-5 text-indigo-600" />
                          </button>
                          <button
                            onClick={() => clearTranscripts()}
                            className="p-2 bg-neutral-50 rounded-md"
                            title="Clear transcripts"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-neutral-600">
                        <div className="font-semibold mb-1">{t("suggestedCommands")}</div>
                        <div className="flex gap-2 flex-wrap">
                          <CommandChip
                            onClick={() => {
                              alert("Compare (mock)")
                              setExpanded(false)
                            }}
                          >
                            {t("compare")}
                          </CommandChip>
                          <CommandChip
                            onClick={() => {
                              alert("Explain ROI (mock)")
                              setExpanded(false)
                            }}
                          >
                            {t("roi")} {lang === "hi" ? "समझाएं" : "Explain"}
                          </CommandChip>
                          <CommandChip
                            onClick={() => {
                              alert("Show scholarships (mock)")
                              setExpanded(false)
                            }}
                          >
                            {t("scholarships")}
                          </CommandChip>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-neutral-500">{t("voiceAssistant")}</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigator.clipboard?.writeText(transcripts.join("\n"))}
                      className="text-sm px-3 py-2 border rounded-lg"
                    >
                      {t("copy")}
                    </button>
                    <button
                      onClick={() => setExpanded(false)}
                      className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white"
                    >
                      {t("done")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* small helpers & local lists used in VoiceDock */
const languagesList = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "ur", name: "اردو" },
  { code: "dogri", name: "डोगरी" },
  { code: "gojri", name: "गोजरी" },
  { code: "pahari", name: "पहाड़ी" },
]

function MicButton({ active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-14 h-14 rounded-full flex items-center justify-center ${active ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl scale-105" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"} focus:outline-none`}
      aria-label="Toggle microphone"
    >
      <Mic className="w-6 h-6" />
    </button>
  )
}

function CommandChip({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs font-semibold border rounded-full bg-neutral-100 hover:bg-neutral-200"
    >
      {children}
    </button>
  )
}
