// src/SimulatorPage.js
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Volume2, X, Target, Users, GraduationCap } from "lucide-react"
import { useTranslation } from "react-i18next";
import i18n from '../../i18n' // Import to initialize

/* ----------------------
   Fixtures (unchanged)
   ---------------------- */
const STREAMS = [
  { id: "arts", label: { en: "Arts", hi: "आर्ट्स", ur: "آرٹس", dogri: "आर्ट्स", gojri: "آرٹس", pahari: "आर्ट्स", mi: "कला" } },
  { id: "science", label: { en: "Science", hi: "साइंस", ur: "سائنس", dogri: "साइंस", gojri: "سائنس", pahari: "साइंस", mi: "विज्ञान" } },
  { id: "commerce", label: { en: "Commerce", hi: "कॉमर्स", ur: "کامرس", dogri: "कॉमर्स", gojri: "کامرس", pahari: "कॉमर्स", mi: "वाणिज्य" } },
  { id: "vocational", label: { en: "Vocational", hi: "वोकेशनल", ur: "ووکیشنل", dogri: "वोकेशनल", gojri: "ووکیشنل", pahari: "वोकेशनल", mi: "व्यावसायिक" } },
];

const COURSES = {
  arts: [
    { id: "ba", label: { en: "B.A.", hi: "बी.ए.", ur: "بی. اے.", dogri: "बी.ए.", gojri: "بی. اے.", pahari: "बी.ए.", mi: "बी.ए." } },
    { id: "bfa", label: { en: "B.F.A.", hi: "बी.एफ.ए.", ur: "بی. ایف. اے.", dogri: "बी.एफ.ए.", gojri: "بی. ایف. اے.", pahari: "बी.एफ.ए.", mi: "बी.एफ.ए." } },
  ],
  science: [
    { id: "bsc", label: { en: "B.Sc.", hi: "बी.एससी.", ur: "بی. ایس سی.", dogri: "बी.एससी.", gojri: "بی. ایس سی.", pahari: "बी.एससी.", mi: "बी.एस्सी." } },
    { id: "btech", label: { en: "B.Tech", hi: "बी.टेक", ur: "بی. ٹیک", dogri: "बी.टेक", gojri: "بی. ٹیک", pahari: "बी.टेक", mi: "बी.टेक" } },
  ],
  commerce: [
    { id: "bcom", label: { en: "B.Com.", hi: "बी.कॉम.", ur: "بی. کام.", dogri: "बी.कॉम.", gojri: "بی. کام.", pahari: "बी.कॉम.", mi: "बी.कॉम." } },
    { id: "bba", label: { en: "B.B.A.", hi: "बी.बी.ए.", ur: "بی. بی. اے.", dogri: "बी.बी.ए.", gojri: "بی. بی. اے.", pahari: "बी.बी.ए.", mi: "बी.बी.ए." } },
  ],
  vocational: [
    { id: "diploma", label: { en: "Diploma", hi: "डिप्लोमा", ur: "ڈپلومہ", dogri: "डिप्लोमा", gojri: "ڈپلومہ", pahari: "डिप्लोमा", mi: "डिप्लोमा" } },
    { id: "certificate", label: { en: "Certificate Course", hi: "सर्टिफिकेट कोर्स", ur: "سرٹیفکیٹ کورس", dogri: "सर्टिफिकेट कोर्स", gojri: "سرٹیفکیٹ کورس", pahari: "सर्टिफिकेट कोर्स", mi: "प्रमाणपत्र अभ्यासक्रम" } },
  ],
};

const COLLEGE_TYPES = [
  { id: "govt", label: { en: "Government", hi: "सरकारी", ur: "حکومتی", dogri: "सरकारी", gojri: "حکومتی", pahari: "सरकारी", mi: "सरकारी" } },
  { id: "private", label: { en: "Private", hi: "निजी", ur: "نجی", dogri: "निजी", gojri: "نجی", pahari: "निजी", mi: "खाजगी" } },
];

const COLLEGES = {
  govt: [
    { id: "govt1", label: { en: "Govt College A", hi: "सरकारी कॉलेज ए", ur: "حکومتی کالج اے", dogri: "सरकारी कॉलेज ए", gojri: "حکومتی کالج اے", pahari: "सरकारी कॉलेज ए", mi: "सरकारी महाविद्यालय ए" }, location: "दिल्ली" },
    { id: "govt2", label: { en: "Govt College B", hi: "सरकारी कॉलेज बी", ur: "حکومتی کالج بی", dogri: "सरकारी कॉलेज बी", gojri: "حکومتی کالج بی", pahari: "सरकारी कॉलेज बी", mi: "सरकारी महाविद्यालय बी" }, location: "मुंबई" },
  ],
  private: [
    { id: "priv1", label: { en: "Private College X", hi: "निजी कॉलेज एक्स", ur: "نجی کالج ایکس", dogri: "निजी कॉलेज एक्स", gojri: "نجی کالج ایکس", pahari: "निजी कॉलेज एक्स", mi: "खाजगी महाविद्यालय एक्स" }, location: "बेंगलुरू" },
    { id: "priv2", label: { en: "Private College Y", hi: "निजी कॉलेज वाई", ur: "نجی کالج وائی", dogri: "निजी कॉलेज वाई", gojri: "نجی کالج وائی", pahari: "निजी कॉलेज वाई", mi: "खाजगी महाविद्यालय वाई" }, location: "चेन्नई" },
  ],
};

const SKILLS = [
  { id: "communication", label: { en: "Communication", hi: "संचार", ur: "مواصلات", dogri: "संचार", gojri: "مواصلات", pahari: "संचार", mi: "संनाद" } },
  { id: "coding", label: { en: "Coding", hi: "कोडिंग", ur: "کوڈنگ", dogri: "कोडिंग", gojri: "کوڈنگ", pahari: "कोडिंग", mi: "कोडिंग" } },
  { id: "management", label: { en: "Management", hi: "प्रबंधन", ur: "مینجمنٹ", dogri: "प्रबंधन", gojri: "مینجمنٹ", pahari: "प्रबंधन", mi: "व्यवस्थापन" } },
];

const UPSKILLS = [
  { id: "cert1", label: { en: "Certification 1", hi: "प्रमाणपत्र 1", ur: "سرٹیفیکیشن 1", dogri: "प्रमाणपत्र 1", gojri: "سرٹیفیکیشن 1", pahari: "प्रमाणपत्र 1", mi: "प्रमाणपत्र १" } },
  { id: "cert2", label: { en: "Certification 2", hi: "प्रमाणपत्र 2", ur: "سرٹیفیکیشن 2", dogri: "प्रमाणपत्र 2", gojri: "سرٹیفیکेशन 2", pahari: "प्रमाणपत्र 2", mi: "प्रमाणपत्र २" } },
];

const SCHOLARSHIPS = [
  { id: "sch1", label: { en: "Merit Scholarship", hi: "मेरिट छात्रवृत्ति", ur: "میرٹ سکالرشپ", dogri: "मेरिट छात्रवृत्ति", gojri: "میرٹ سکالرشپ", pahari: "मेरिट छात्रवृत्ति", mi: "गुणवत्ता शिष्यवृत्ती" } },
  { id: "sch2", label: { en: "Need-based Scholarship", hi: "आवश्यकता आधारित छात्रवृत्ति", ur: "ضرورت پر مبنی سکالرشپ", dogri: "आवश्यकता आधारित छात्रवृत्ति", gojri: "ضرورت پر مبنی سکالرشپ", pahari: "आवश्यकता आधारित छात्रवृत्ति", mi: "आवश्यकता आधारित शिष्यवृत्ती" } },
];
const SAMPLE_SCENARIOS = [
  {
    id: "sc1",
    name: "engineeringGovt",
    stream: "science",
    course: "btech",
    collegeType: "govt",
    college: "govt1",
    skills: ["coding"],
    upskill: ["cert1"],
    scholarship: "sch1",
    npv: 1200000,
    roi: 1.5,
    employmentProb: 0.85,
    startingSalary: 600000,
    timeToJob: 6,
    scholarshipOdds: 0.7,
  },
  {
    id: "sc2",
    name: "commercePrivate",
    stream: "commerce",
    course: "bcom",
    collegeType: "private",
    college: "priv1",
    skills: ["management"],
    upskill: ["cert2"],
    scholarship: "sch2",
    npv: 900000,
    roi: 1.2,
    employmentProb: 0.75,
    startingSalary: 450000,
    timeToJob: 8,
    scholarshipOdds: 0.5,
  },
];

function getLabel(item, lang = "en") {
  if (!item) return ""
  return item.label?.[lang] ?? item.label?.en ?? ""
}
function currency(x) {
  return `₹${Number(x || 0).toLocaleString()}`
}

/* -----------------------
   MAIN COMPONENT
   ----------------------- */
export default function SimulatorPage() {
  const { t } = useTranslation();

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
  const [sensitivity, setSensitivity] = useState(0)
  const [playgroundMode, setPlaygroundMode] = useState(false)
  const [govtFirst, setGovtFirst] = useState(true)

  // voice
  const [voiceConsent, setVoiceConsent] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcripts, setTranscripts] = useState([])
  const [dockExpanded, setDockExpanded] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(typeof window !== "undefined" && window.speechSynthesis ? window.speechSynthesis : null)

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
        } catch { }
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
        recognition.lang = "en-US"
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
      } catch { }
    }
  }, [voiceConsent, i18n.language])

  const toggleListening = () => {
    if (!voiceConsent) {
      alert(t('consentMic'))
      return
    }
    const rec = recognitionRef.current
    if (!rec) {
      alert("Speech recognition is not available in this browser.")
      return
    }
    if (listening) {
      try { rec.stop() } catch { }
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
          u.lang = "en-US"
          break
        case "ur":
          u.lang = "ur-PK"
          break
        default:
          u.lang = "hi-IN"
      }
      u.rate = 1
      u.pitch = 1
      synthRef.current.speak(u)
    } catch (err) {
      console.warn("TTS failed:", err)
    }
  }

  /* Export summary (unchanged, but robust) */
  const exportSummary = () => {
    const summary = scenarios
      .map((s, i) => {
        return `${t('scenario')} ${i + 1}:
Name: ${s.name || `${t('scenario')} ${i + 1}`}
Stream: ${getLabel(STREAMS.find((st) => st.id === s.stream), i18n.language)}
Course: ${getLabel((COURSES[s.stream] || []).find((c) => c.id === s.course), i18n.language)}
College Type: ${getLabel(COLLEGE_TYPES.find((ct) => ct.id === s.collegeType), i18n.language)}
College: ${getLabel((COLLEGES[s.collegeType] || []).find((cl) => cl.id === s.college), i18n.language)}
Skills: ${(s.skills || []).map((sk) => getLabel(SKILLS.find((skl) => skl.id === sk), i18n.language)).join(", ")}
Upskill: ${(s.upskill || []).map((u) => getLabel(UPSKILLS.find((up) => up.id === u), i18n.language)).join(", ")}
Scholarship: ${getLabel(SCHOLARSHIPS.find((sch) => sch.id === s.scholarship), i18n.language)}
NPV: ${s.npv ? currency(s.npv) : "-"}
ROI: ${s.roi ?? "-"}
Employment Probability: ${s.employmentProb ? `${(s.employmentProb * 100).toFixed(1)}%` : "-"}
Starting Salary: ${s.startingSalary ? currency(s.startingSalary) : "-"}
Time to Job: ${s.timeToJob ?? "-"} ${t('months')}
Scholarship Odds: ${s.scholarshipOdds ? `${(s.scholarshipOdds * 100).toFixed(1)}%` : "-"}
`
      })
      .join("\n\n---\n\n")

    try {
      const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "career_summary.txt"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.warn("Export failed:", err)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-900 font-sans selection:bg-indigo-300 selection:text-white">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg leading-tight">{t('title')}</h1>
            <p className="mt-2 text-base md:text-lg opacity-95">{t('subtitle')}</p>

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm bg-white/10 text-white border border-white/20 focus:outline-none"
                aria-label="Select language"
              >
                {languages.map(({ code, name }) => (
                  <option key={code} value={code} className="text-black">{name}</option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={govtFirst}
                  onChange={() => setGovtFirst(!govtFirst)}
                  className="h-5 w-5 rounded border-transparent focus:ring-2 focus:ring-offset-1 focus:ring-white cursor-pointer"
                />
                <span className="text-white font-semibold">{t('governmentFirst')}</span>
              </label>

              <button
                onClick={autoExperiment}
                className="ml-2 inline-flex items-center gap-2 bg-white text-indigo-700 px-3 py-2 rounded-lg font-semibold shadow-sm hover:shadow-md"
                title="Auto experiment"
              >
                <Target className="w-4 h-4" />
                {t('autoExperiment')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm opacity-80">{t('totalScenarios')}</div>
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
                <div className="text-xs opacity-80">{t('engagement')}</div>
                <div className="font-semibold">{t('high')}</div>
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
            {t('stream')} & {t('course')}
          </h3>

          <div className="space-y-4">
            <Select label={t('stream')} value={stream} options={STREAMS} lang={i18n.language} onChange={setStream} />
            <Select
              label={t('course')}
              value={course}
              options={COURSES[stream] || []}
              lang={i18n.language}
              onChange={setCourse}
              disabled={!stream}
            />
            <Select
              label={t('collegeType')}
              value={collegeType}
              options={COLLEGE_TYPES}
              lang={i18n.language}
              onChange={setCollegeType}
            />
            <Select
              label={t('college')}
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
              <h4 className="font-semibold text-indigo-700">{t('skills')}</h4>
              <button onClick={() => setSkills([])} className="text-sm text-indigo-500 hover:underline">
                {t('clear')}
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
              <h4 className="font-semibold text-indigo-700">{t('upskill')}</h4>
              <button onClick={() => setUpskill([])} className="text-sm text-indigo-500 hover:underline">
                {t('clear')}
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
            <label className="block mb-2 font-semibold text-indigo-700">{t('scholarships')}</label>
            <select
              value={scholarship}
              onChange={(e) => setScholarship(e.target.value)}
              className="w-full rounded-lg p-3 border border-indigo-100 focus:outline-none"
            >
              <option value="">{`-- ${t('select')} --`}</option>
              {SCHOLARSHIPS.map((s) => (
                <option key={s.id} value={s.id}>{getLabel(s, i18n.language)}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                const copy = [...scenarios]
                copy.push({ ...copy[activeScenarioIndex], id: `sc${Date.now()}`, name: `${t('scenario')} ${copy.length + 1}` })
                setScenarios(copy)
                setActiveScenarioIndex(copy.length - 1)
              }}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-3 font-semibold shadow"
            >
              + {t('addScenario')}
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
              {t('reset')}
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={saveActiveChanges} className="flex-1 bg-white border border-indigo-100 rounded-full py-2 text-indigo-700">Save</button>
            <button onClick={exportSummary} className="px-4 py-2 bg-indigo-50 rounded-full">Export</button>
          </div>
        </aside>

        {/* CENTER: Visualizer */}
        <main className="md:col-span-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl min-h-[520px] border border-indigo-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-700">{t(active?.name || `scenario${activeScenarioIndex + 1}`)}</h2>
                <p className="text-sm text-indigo-400 mt-1">{t('interactiveVisualizer')}</p>
              </div>

              <div className="flex items-center gap-3">
                <StatPill
                  icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
                  label={t('roi')}
                  value={active?.roi?.toFixed(2) ?? "-"}
                />
                <StatPill
                  icon={<Users className="w-5 h-5 text-indigo-400" />}
                  label={`${t('employ')} %`}
                  value={`${((active?.employmentProb || 0) * 100).toFixed(0)}%`}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border-2 border-dashed border-indigo-200 h-72 flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100">
                <div className="text-center text-indigo-400 select-none">
                  <div className="text-xl font-semibold tracking-wide">{t('sankeyFlow')}</div>
                  <div className="mt-2 text-sm">{t('visualizeCourse')}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl p-5 border border-indigo-100 shadow-sm bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-indigo-500 font-semibold">{t('startingSalary')}</div>
                      <div className="text-2xl font-extrabold text-indigo-700">{currency(active?.startingSalary || 0)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-indigo-500 font-semibold">{t('timeToJob')}</div>
                      <div className="text-xl font-semibold text-indigo-700">{active?.timeToJob} {t('months')}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-indigo-400 italic">{t('includesScholarship')}</div>
                </div>

                <div className="rounded-2xl p-4 border border-indigo-100 bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-indigo-700">{t('scholarshipOdds')}</div>
                    <div className="font-bold text-indigo-700">{Math.round((active?.scholarshipOdds || 0) * 100)}%</div>
                  </div>
                  <div className="mt-3 h-4 bg-indigo-200 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.round((active?.scholarshipOdds || 0) * 100)}%` }} className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => playTts(`${t(active?.name || 'scenario')}: ${t('roi')} ${active?.roi ?? "N/A"}`)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl hover:scale-[1.01] transition"> {t('explainVoice')}</button>
                  <button onClick={() => exportSummary()} className="flex-1 border border-indigo-100 rounded-2xl py-3"> {t('export')}</button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-semibold text-indigo-700">{t('sensitivityLens')}</label>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={sensitivity}
                onChange={(e) => setSensitivity(Number.parseFloat(e.target.value))}
                className="w-full h-3 rounded-lg accent-indigo-600"
                aria-label={t('sensitivityLens')}
              />
            </div>
          </div>

          {/* Scenario list / small pager */}
          <div className="mt-4 flex gap-2 items-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {scenarios.map((s, idx) => (
                <button key={s.id || idx} onClick={() => setActiveScenarioIndex(idx)} className={`px-3 py-2 rounded-full text-sm ${idx === activeScenarioIndex ? "bg-indigo-600 text-white" : "bg-white border border-indigo-100"}`}>
                  {s.name || `${t('scenario')} ${idx + 1}`}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => setScenarios((prev) => prev.slice(0, -1))} className="px-3 py-2 bg-white border rounded-md">Delete</button>
              <button onClick={() => setScenarios((prev) => { const c = [...prev]; c.push({...c[activeScenarioIndex]}); return c })} className="px-3 py-2 bg-white border rounded-md">Duplicate</button>
            </div>
          </div>
        </main>

        {/* RIGHT: Summary rail */}
        <aside className="md:col-span-3">
          <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-24 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-indigo-700">{t('summary')}</h4>
              <div className="text-indigo-600 font-semibold">{t('points')}: {totalPoints}</div>
            </div>

            <div className="space-y-4">
              <SummaryCard title={t('npv')} value={currency(active?.npv || 0)} hint={t('netPresentValue')} />
              <SummaryCard title={t('roi')} value={(active?.roi || 0).toFixed(2)} hint={t('returnOnInvestment')} />
              <SummaryCard title={t('employ')} value={`${((active?.employmentProb || 0) * 100).toFixed(1)}%`} hint={t('employmentProbability')} />
              <SummaryCard title={t('startingSalary').split(" ")[0]} value={currency(active?.startingSalary || 0)} hint={t('averageStartingSalary')} />
              <SummaryCard title={t('timeToJob')} value={`${active?.timeToJob} ${t('months')}`} hint={t('typicalTimeToEmployment')} />
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-indigo-700">{t('badges_1')}</h5>
              <div className="flex flex-wrap gap-2">
                {badges.length === 0 ? <div className="text-indigo-400 italic">{t('noBadgesYet')}</div> : badges.map(b => <Badge key={b}>{b}</Badge>)}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => alert("Share to parents (mock)")} className="flex-1 bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-2 rounded-xl"> {t('share')}</button>
              <button onClick={() => alert("Save scenario (mock)")} className="flex-1 border border-indigo-100 py-2 rounded-xl text-indigo-700"> {t('save')}</button>
            </div>
          </div>
        </aside>
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

/* -------------------------------
   PRESENTATIONAL SMALL COMPONENTS
   ------------------------------- */

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
          <option key={opt.id} value={opt.id}>{getLabel(opt, lang)}</option>
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

/* -------------------------------
   VOICE DOCK
   ------------------------------- */
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
          aria-label={expanded ? t('close') : t('voiceAssistant')}
          onClick={() => setExpanded((v) => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          title={t('voiceAssistant')}
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <>
            <div onClick={() => setExpanded(false)} className="fixed inset-0 bg-black bg-opacity-30 z-40" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.16 }} className={`fixed z-50 inset-0 flex items-end md:items-center justify-center md:justify-end p-4`}>
              <div className={`${panelWidthClass} bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden`}>
                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-full text-white"><Mic className="w-5 h-5" /></div>
                    <div>
                      <div className="font-semibold text-indigo-700">{t('voiceAssistant')}</div>
                      <div className="text-xs text-neutral-500">{t('tryCommands')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      const currentIndex = languagesList.findIndex((l) => l.code === lang)
                      const nextIndex = (currentIndex + 1) % languagesList.length
                      setLang(languagesList[nextIndex].code)
                    }} className="text-xs px-3 py-1 border rounded-lg text-indigo-700">
                      {lang === "en" ? "हिंदी" : "EN"}
                    </button>

                    <button onClick={() => setExpanded(false)} className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100" aria-label={t('close')}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
                  {!voiceConsent ? (
                    <div className="p-4 bg-indigo-50 rounded-lg text-center">
                      <p className="text-sm text-indigo-700 mb-3">{t('consentMic')}</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setVoiceConsent(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{t('consentAccept')}</button>
                        <button onClick={() => setVoiceConsent(false)} className="px-4 py-2 border rounded-lg">{t('consentDecline')}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <MicButton active={listening} onClick={toggleListening} />
                        <div className="flex-1">
                          <div className="text-xs text-neutral-500 mb-2 font-mono">
                            {t('listening')}: <span className={listening ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>{listening ? t('on') : t('off')}</span>
                          </div>
                          <div className="h-36 overflow-auto bg-neutral-50 rounded-lg p-3 text-xs font-mono text-neutral-800">
                            {transcripts.length === 0 ? <div className="text-neutral-400 italic">{t('noTranscriptsYet')}</div> : transcripts.map((tr, i) => <div key={i} className="mb-1 break-words">{tr}</div>)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => playTts(transcripts.join(" "))} className="p-2 bg-indigo-50 rounded-md">
                            <Volume2 className="w-5 h-5 text-indigo-600" />
                          </button>
                          <button onClick={() => clearTranscripts()} className="p-2 bg-neutral-50 rounded-md" title="Clear transcripts">Clear</button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-neutral-600">
                        <div className="font-semibold mb-1">{t('suggestedCommands')}</div>
                        <div className="flex gap-2 flex-wrap">
                          <CommandChip onClick={() => { alert("Compare (mock)"); setExpanded(false) }}>{t('compare')}</CommandChip>
                          <CommandChip onClick={() => { alert("Explain ROI (mock)"); setExpanded(false) }}>{t('roi')} {lang === "hi" ? "समझाएं" : "Explain"}</CommandChip>
                          <CommandChip onClick={() => { alert("Show scholarships (mock)"); setExpanded(false) }}>{t('scholarships')}</CommandChip>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-neutral-500">{t('voiceAssistant')}</div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => navigator.clipboard?.writeText(transcripts.join("\n"))} className="text-sm px-3 py-2 border rounded-lg">{t('copy')}</button>
                    <button onClick={() => setExpanded(false)} className="text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white">{t('done')}</button>
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
    <button onClick={onClick} className="px-3 py-1 text-xs font-semibold border rounded-full bg-neutral-100 hover:bg-neutral-200">{children}</button>
  )
}
