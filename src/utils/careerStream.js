import {
  Users,
  AlertTriangle,
  Shield,
  TrendingUp,
  MapPin,
} from "lucide-react";
// ================================
// STREAMS
// ================================
export const STREAMS = [
  {
    id: "arts",
    label: {
      en: "Arts",
      hi: "आर्ट्स",
      ur: "آرٹس",
      dogri: "आर्ट्स",
      gojri: "آرٹس",
      pahari: "आर्ट्स",
      mi: "कला",
    },
  },
  {
    id: "science",
    label: {
      en: "Science",
      hi: "साइंस",
      ur: "سائنس",
      dogri: "साइंस",
      gojri: "سائنس",
      pahari: "साइंस",
      mi: "विज्ञान",
    },
  },
  {
    id: "commerce",
    label: {
      en: "Commerce",
      hi: "कॉमर्स",
      ur: "کامرس",
      dogri: "कॉमर्स",
      gojri: "کامرس",
      pahari: "कॉमर्स",
      mi: "वाणिज्य",
    },
  },
  {
    id: "vocational",
    label: {
      en: "Vocational",
      hi: "वोकेशनल",
      ur: "ووکیشنل",
      dogri: "वोकेशनल",
      gojri: "ووکیشنل",
      pahari: "वोकेशनल",
      mi: "व्यावसायिक",
    },
  },
];

// ================================
// COURSES
// ================================
export const COURSES = {
  arts: [
    {
      id: "ba",
      label: {
        en: "B.A.",
        hi: "बी.ए.",
        ur: "بی. اے.",
        dogri: "बी.ए.",
        gojri: "بی. اے.",
        pahari: "बी.ए.",
        mi: "बी.ए.",
      },
    },
    {
      id: "bfa",
      label: {
        en: "B.F.A.",
        hi: "बी.एफ.ए.",
        ur: "بی. ایف. اے.",
        dogri: "बी.एफ.ए.",
        gojri: "بی. ایف. اے.",
        pahari: "बी.एफ.ए.",
        mi: "बी.एफ.ए.",
      },
    },
  ],
  science: [
    {
      id: "bsc",
      label: {
        en: "B.Sc.",
        hi: "बी.एससी.",
        ur: "بی. ایس سی.",
        dogri: "बी.एससी.",
        gojri: "بی. ایس سی.",
        pahari: "बी.एससी.",
        mi: "बी.एस्सी.",
      },
    },
    {
      id: "btech",
      label: {
        en: "B.Tech",
        hi: "बी.टेक",
        ur: "بی. ٹیک",
        dogri: "बी.टेक",
        gojri: "بی. ٹیک",
        pahari: "बी.टेक",
        mi: "बी.टेक",
      },
    },
  ],
  commerce: [
    {
      id: "bcom",
      label: {
        en: "B.Com.",
        hi: "बी.कॉम.",
        ur: "بی. کام.",
        dogri: "बी.कॉम.",
        gojri: "بی. کام.",
        pahari: "बी.कॉम.",
        mi: "बी.कॉम.",
      },
    },
    {
      id: "bba",
      label: {
        en: "B.B.A.",
        hi: "बी.बी.ए.",
        ur: "بی. بی. اے.",
        dogri: "बी.बी.ए.",
        gojri: "بی. بی. اے.",
        pahari: "बी.बी.ए.",
        mi: "बी.बी.ए.",
      },
    },
  ],
  vocational: [
    {
      id: "diploma",
      label: {
        en: "Diploma",
        hi: "डिप्लोमा",
        ur: "ڈپلومہ",
        dogri: "डिप्लोमा",
        gojri: "ڈپلومہ",
        pahari: "डिप्लोमा",
        mi: "डिप्लोमा",
      },
    },
    {
      id: "certificate",
      label: {
        en: "Certificate Course",
        hi: "सर्टिफिकेट कोर्स",
        ur: "سرٹیفکیٹ کورس",
        dogri: "सर्टिफिकेट कोर्स",
        gojri: "سرٹیفکیٹ کورس",
        pahari: "सर्टिफिकेट कोर्स",
        mi: "प्रमाणपत्र अभ्यासक्रम",
      },
    },
  ],
};

// ================================
// COLLEGE TYPES
// ================================
export const COLLEGE_TYPES = [
  {
    id: "govt",
    label: {
      en: "Government",
      hi: "सरकारी",
      ur: "حکومتی",
      dogri: "सरकारी",
      gojri: "حکومتی",
      pahari: "सरकारी",
      mi: "सरकारी",
    },
  },
  {
    id: "private",
    label: {
      en: "Private",
      hi: "निजी",
      ur: "نجی",
      dogri: "निजी",
      gojri: "نجی",
      pahari: "निजी",
      mi: "खाजगी",
    },
  },
];

// ================================
// COLLEGES
// ================================
export const COLLEGES = {
  govt: [
    {
      id: "govt1",
      label: {
        en: "Govt College A",
        hi: "सरकारी कॉलेज ए",
        ur: "حکومتی کالج اے",
        dogri: "सरकारी कॉलेज ए",
        gojri: "حکومتی کالج اے",
        pahari: "सरकारी कॉलेज ए",
        mi: "सरकारी महाविद्यालय ए",
      },
      location: "Delhi",
    },
    {
      id: "govt2",
      label: {
        en: "Govt College B",
        hi: "सरकारी कॉलेज बी",
        ur: "حکومتی کالج بی",
        dogri: "सरकारी कॉलेज बी",
        gojri: "حکومتی کالج بی",
        pahari: "सरकारी कॉलेज बी",
        mi: "सरकारी महाविद्यालय बी",
      },
      location: "Mumbai",
    },
  ],
  private: [
    {
      id: "priv1",
      label: {
        en: "Private College X",
        hi: "निजी कॉलेज एक्स",
        ur: "نجی کالج ایکس",
        dogri: "निजी कॉलेज एक्स",
        gojri: "نجی کالج ایکس",
        pahari: "निजी कॉलेज एक्स",
        mi: "खाजगी महाविद्यालय एक्स",
      },
      location: "Bengaluru",
    },
    {
      id: "priv2",
      label: {
        en: "Private College Y",
        hi: "निजी कॉलेज वाई",
        ur: "نجی کالج وائی",
        dogri: "निजी कॉलेज वाई",
        gojri: "نجی کالج وائی",
        pahari: "निजी कॉलेज वाई",
        mi: "खाजगी महाविद्यालय वाई",
      },
      location: "Chennai",
    },
  ],
};

// ================================
// SKILLS
// ================================
export const SKILLS = [
  {
    id: "communication",
    label: {
      en: "Communication",
      hi: "संचार",
      ur: "مواصلات",
      dogri: "संचार",
      gojri: "مواصلات",
      pahari: "संचार",
      mi: "संनाद",
    },
  },
  {
    id: "coding",
    label: {
      en: "Coding",
      hi: "कोडिंग",
      ur: "کوڈنگ",
      dogri: "कोडिंग",
      gojri: "کوڈنگ",
      pahari: "कोडिंग",
      mi: "कोडिंग",
    },
  },
  {
    id: "management",
    label: {
      en: "Management",
      hi: "प्रबंधन",
      ur: "مینجمنٹ",
      dogri: "प्रबंधन",
      gojri: "مینجمنٹ",
      pahari: "प्रबंधन",
      mi: "व्यवस्थापन",
    },
  },
];

// ================================
// UPSKILLS
// ================================
export const UPSKILLS = [
  {
    id: "cert1",
    label: {
      en: "Certification 1",
      hi: "प्रमाणपत्र 1",
      ur: "سرٹیفیکیشن 1",
      dogri: "प्रमाणपत्र 1",
      gojri: "سرٹیفیکیشن 1",
      pahari: "प्रमाणपत्र 1",
      mi: "प्रमाणपत्र १",
    },
  },
  {
    id: "cert2",
    label: {
      en: "Certification 2",
      hi: "प्रमाणपत्र 2",
      ur: "سرٹیفیکیشن 2",
      dogri: "प्रमाणपत्र 2",
      gojri: "سرٹیفیکیشن 2",
      pahari: "प्रमाणपत्र 2",
      mi: "प्रमाणपत्र २",
    },
  },
];

// ================================
// SCHOLARSHIPS
// ================================
export const SCHOLARSHIPS = [
  {
    id: "sch1",
    label: {
      en: "Merit Scholarship",
      hi: "मेरिट छात्रवृत्ति",
      ur: "میرٹ سکالرشپ",
      dogri: "मेरिट छात्रवृत्ति",
      gojri: "میرٹ سکالرشپ",
      pahari: "मेरिट छात्रवृत्ति",
      mi: "गुणवत्ता शिष्यवृत्ती",
    },
  },
  {
    id: "sch2",
    label: {
      en: "Need-based Scholarship",
      hi: "आवश्यकता आधारित छात्रवृत्ति",
      ur: "ضرورت پر مبنی سکالرشپ",
      dogri: "आवश्यकता आधारित छात्रवृत्ति",
      gojri: "ضرورت پر مبنی سکالرشپ",
      pahari: "आवश्यकता आधारित छात्रवृत्ति",
      mi: "आवश्यकता आधारित शिष्यवृत्ती",
    },
  },
];

// ================================
// SAMPLE SCENARIOS
// ================================
export const SAMPLE_SCENARIOS = [
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
export const PERKS = {
  jobSecurity: {
    icon: Shield,
    label: { en: "JobSecurity", hi: "नौकरीकीसुरक्षा", ur: "ملازمتکیسلامتی" },
    score: 8,
  },
  competition: {
    icon: Users,
    label: { en: "Competition", hi: "प्रतिस्पर्धा", ur: "مسابقت" },
    ratio: "1:50",
  },
  pension: {
    icon: TrendingUp,
    label: { en: "Pension", hi: "पेंशन", ur: "پنشن" },
    coverage: "80%",
  },
  startupRisk: {
    icon: AlertTriangle,
    label: { en: "StartupRisk", hi: "स्टार्टअपजोखिम", ur: "اسٹارٹاپخطرہ" },
    volatility: "High",
  },
  postings: {
    icon: MapPin,
    label: { en: "Postings", hi: "तैनाती", ur: "تعیناتی" },
    variety: "Nationwide/Global",
  },
};
// ================================
// HELPERS
// ================================
export function getLabel(item, lang = "en") {
  if (!item) return "";
  return item.label?.[lang] ?? item.label?.en ?? "";
}

export function currency(x) {
  return `₹${Number(x || 0).toLocaleString()}`;
}

// ================================
// MAIN NARRATIVE GENERATOR
// ================================
export function generateNarrative(scenario, lang = "en") {
  const streamLabel = getLabel(
    STREAMS.find((s) => s.id === scenario.stream),
    lang
  );

  const courseLabel = getLabel(
    (COURSES[scenario.stream] || []).find((c) => c.id === scenario.course),
    lang
  );

  const collegeLabel = getLabel(
    (COLLEGES[scenario.collegeType] || []).find((cl) => cl.id === scenario.college),
    lang
  );

  const skillLabels = (scenario.skills || [])
    .map((sk) => getLabel(SKILLS.find((skl) => skl.id === sk), lang))
    .join(", ");

  const upskillLabels = (scenario.upskill || [])
    .map((u) => getLabel(UPSKILLS.find((up) => up.id === u), lang))
    .join(", ");

  const scholarshipLabel = getLabel(
    SCHOLARSHIPS.find((sch) => sch.id === scenario.scholarship),
    lang
  );

  const narratives = {
    en: () =>
      `You've selected ${streamLabel} with ${courseLabel} at ${collegeLabel}. With your skills in ${skillLabels}${upskillLabels ? ` and upskilling in ${upskillLabels}` : ""}, and with a ${scholarshipLabel}, your total investment will be around ${currency(scenario.npv)}. Your expected return on investment is ${scenario.roi}. You have an ${((scenario.employmentProb || 0) * 100).toFixed(0)}% employment probability with a starting salary of ${currency(scenario.startingSalary)}. On average, it takes about ${scenario.timeToJob} months to land a job. Your scholarship odds are ${Math.round((scenario.scholarshipOdds || 0) * 100)}%. This path offers strong career prospects with quality returns on your educational investment.`,
    hi: () =>
      `आपने ${streamLabel} के साथ ${courseLabel} को ${collegeLabel} में चुना है। ${skillLabels} कौशल और ${upskillLabels ? `${upskillLabels} में अपस्किलिंग के साथ` : ""}, और ${scholarshipLabel} के साथ, आपका कुल निवेश लगभग ${currency(scenario.npv)} होगा। आपकी प्रत्याशित निवेश पर रिटर्न ${scenario.roi} है। आपके पास ${((scenario.employmentProb || 0) * 100).toFixed(0)}% रोजगार संभावना है जिसमें ${currency(scenario.startingSalary)} का शुरुआती वेतन है। औसतन नौकरी पाने में लगभग ${scenario.timeToJob} महीने लगते हैं। आपकी छात्रवृत्ति की संभावना ${Math.round((scenario.scholarshipOdds || 0) * 100)}% है। यह पथ मजबूत कैरियर संभावनाएं प्रदान करता है।`,
    ur: () =>
      `آپ نے ${streamLabel} کے ساتھ ${courseLabel} کو ${collegeLabel} میں منتخب کیا ہے۔ ${skillLabels} میں مہارت اور ${upskillLabels ? `${upskillLabels} میں اپ اسکلنگ کے ساتھ` : ""}, اور ${scholarshipLabel} کے ساتھ، آپ کی کل سرمایہ کاری تقریباً ${currency(scenario.npv)} ہوگی۔ آپ کی متوقع سرمایہ کاری پر واپسی ${scenario.roi} ہے۔ آپ کے پاس ${((scenario.employmentProb || 0) * 100).toFixed(0)}% روزگار کی امکانات ہے جس میں ${currency(scenario.startingSalary)} کی شروعاتی تنخواہ ہے۔ اوسطاً نوکری حاصل کرنے میں تقریباً ${scenario.timeToJob} مہینے لگتے ہیں۔ آپ کی وظیفہ کی امکانات ${Math.round((scenario.scholarshipOdds || 0) * 100)}% ہے۔ یہ راستہ مضبوط کیریئر کی آگے بڑھنے کی صلاحیت فراہم کرتا ہے۔`,
  };

  return narratives[lang] ? narratives[lang]() : narratives.en();
}

 export const INITIAL_NODES = [
    // Main Streams
    { id: '1', type: 'custom', data: { label: '1️⃣ SCIENCE STREAM', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '2', type: 'custom', data: { label: '2️⃣ COMMERCE STREAM', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '3', type: 'custom', data: { label: '3️⃣ ARTS/HUMANITIES STREAM', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '4', type: 'custom', data: { label: '4️⃣ DIPLOMA/VOCATIONAL STREAM', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '5', type: 'custom', data: { label: '5️⃣ NEW-AGE CAREERS (ALL STREAMS)', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
// Science Stream - A. PCM CAREERS
{ id: '1A', type: 'custom', data: { label: 'A. PCM CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A1', type: 'custom', data: { label: '1. ENGINEERING BRANCHES', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A11', type: 'custom', data: { label: '1.1 Computer Science Engineering (CSE)\nIIT Bombay\nIIIT Hyderabad\nBITS Pilani\nVIT Vellore', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A12', type: 'custom', data: { label: '1.2 Mechanical Engineering\nIIT Madras\nIIT Bombay\nCOEP Pune\nNIT Trichy', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A13', type: 'custom', data: { label: '1.3 Civil Engineering\nIIT Roorkee\nNIT Surathkal\nSRM University\nMIT Pune', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A14', type: 'custom', data: { label: '1.4 Electrical Engineering\nIIT Delhi\nNIT Warangal\nJadavpur University\nBITS Pilani', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A15', type: 'custom', data: { label: '1.5 Electronics & Communication Engineering\nIIT Kanpur\nNIT Trichy\nDelhi Technological University\nIIIT Delhi', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A16', type: 'custom', data: { label: '1.6 Aerospace Engineering\nIIT Kanpur\nIIST Thiruvananthapuram\nHindustan Institute of Technology\nAmity University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A17', type: 'custom', data: { label: '1.7 Automobile Engineering\nIIT Madras\nPSG College of Technology\nVIT Vellore\nSRM University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A18', type: 'custom', data: { label: '1.8 Artificial Intelligence & Machine Learning (AI/ML) Engineering\nIIT Hyderabad (best for AI/ML in India)\nIIT Madras\nIIIT Bangalore\nOnline: UpGrad AI/ML Program', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A2', type: 'custom', data: { label: '2. TECHNOLOGY CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A21', type: 'custom', data: { label: '2.1 Software Developer\nIITs/NITs\nVIT Vellore\nIIITs\nOnline: FreeCodeCamp/Udemy', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A22', type: 'custom', data: { label: '2.2 Data Scientist\nIIT Madras Data Science BSc\nISI Kolkata\nIISc Bangalore\nCoursera – Google Data Analytics', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A23', type: 'custom', data: { label: '2.3 Cybersecurity Analyst\nIIT Kanpur Cybersecurity Course\nEC-Council CEH\nOffensive Security (OSCP)\nCoursera – IBM Cybersecurity', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A24', type: 'custom', data: { label: '2.4 Cloud Engineer\nAWS Academy\nGoogle Cloud Career Readiness\nIIT Kharagpur Cloud Computing Course\nUdemy – Cloud Architect', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A25', type: 'custom', data: { label: '2.5 Game Developer\nNID Bangalore\nICAT Design & Media College\nArena Animation\nUdemy/Unity Learn', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A26', type: 'custom', data: { label: '2.6 DevOps Engineer\nIIT Roorkee (Great Learning DevOps)\nUpGrad DevOps\nLinux Foundation\nUdemy DevOps Masterclass', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A3', type: 'custom', data: { label: '3. OTHER PCM CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A31', type: 'custom', data: { label: '3.1 Architecture (B.Arch)\nCEPT University\nSchool of Planning & Architecture Delhi\nIIT Roorkee\nNIT Calicut', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A32', type: 'custom', data: { label: '3.2 Commercial Pilot\nIndira Gandhi Rashtriya Uran Akademi (IGRUA)\nCAE Global Academy\nBombay Flying Club\nNFTI Gondia', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A33', type: 'custom', data: { label: '3.3 Merchant Navy\nIndian Maritime University\nTMI Mumbai\nAMET University\nAnglo Eastern Maritime Academy', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1A34', type: 'custom', data: { label: '3.4 Defence (NDA – Technical)\nNDA Pune\nSSB Coaching – Major Kalshi\nSSB Crack\nUnacademy NDA', color: "#10b981" }, position: { x: 0, y: 0 } },
// Science Stream - B. PCB CAREERS
{ id: '1B', type: 'custom', data: { label: 'B. PCB CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B1', type: 'custom', data: { label: '1. MEDICAL CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B11', type: 'custom', data: { label: '1.1 MBBS Doctor\nAIIMS Delhi\nCMC Vellore\nJIPMER Puducherry\nKEM Mumbai', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B12', type: 'custom', data: { label: '1.2 BDS (Dentist)\nMaulana Azad Institute of Dental Sciences\nManipal College of Dental Sciences\nGovernment Dental College Mumbai\nSRM Dental College', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B13', type: 'custom', data: { label: '1.3 BAMS/BHMS/Unani\nBHU Varanasi\nTilak Ayurveda Pune\nNational Institute of Ayurveda Jaipur\nAMU Aligarh', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B14', type: 'custom', data: { label: '1.4 Veterinary (BVSc)\nIVRI Bareilly\nGADVASU Ludhiana\nTANUVAS Chennai\nKVAF SU Karnataka', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B15', type: 'custom', data: { label: '1.5 Nursing\nAIIMS College of Nursing\nChristian Medical College\nPGIMER Chandigarh\nApollo Nursing', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B2', type: 'custom', data: { label: '2. ALLIED HEALTH SCIENCES', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B21', type: 'custom', data: { label: '2.1 Physiotherapy (BPT)\nManipal College of Health Professions\nDY Patil Mumbai\nJamia Hamdard\nAmity University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B22', type: 'custom', data: { label: '2.2 Optometry\nAIIMS\nManipal Academy\nSankara Nethralaya Chennai\nLV Prasad Hyderabad', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B23', type: 'custom', data: { label: '2.3 Radiology/Imaging\nAIIMS Delhi\nPGIMER Chandigarh\nCMC Vellore\nManipal University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B24', type: 'custom', data: { label: '2.4 Medical Lab Technology (MLT)\nAIIMS Delhi\nManipal College\nJIPMER\nSt. John’s Bangalore', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B25', type: 'custom', data: { label: '2.5 Occupational Therapy\nAIIMS Delhi\nNIMS Hyderabad\nSRM University\nJamia Hamdard', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B3', type: 'custom', data: { label: '3. RESEARCH & LIFE SCIENCES', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B31', type: 'custom', data: { label: '3.1 Microbiology\nIISc Bangalore\nJNU Delhi\nBHU\nLoyola College', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B32', type: 'custom', data: { label: '3.2 Biotechnology\nIIT Bombay\nIISc Bangalore\nAmity University\nVIT Vellore', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B33', type: 'custom', data: { label: '3.3 Genetics\nIISc Bangalore\nDelhi University\nBangalore University\nSRM University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1B34', type: 'custom', data: { label: '3.4 Pharmacology\nNIPER Mohali\nICT Mumbai\nJSS College of Pharmacy\nManipal College of Pharmacy', color: "#10b981" }, position: { x: 0, y: 0 } },
// Science Stream - C. PCMB CAREERS
{ id: '1C', type: 'custom', data: { label: 'C. PCMB CAREERS', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1C1', type: 'custom', data: { label: '1. Biomedical Engineering\nIIT Madras\nVIT Vellore\nSRM University\nAmrita University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1C2', type: 'custom', data: { label: '2. Bioinformatics\nIIT Delhi\nIIIT Hyderabad\nIGIB Delhi\nAmity University', color: "#10b981" }, position: { x: 0, y: 0 } },
{ id: '1C3', type: 'custom', data: { label: '3. Biotechnology + Research\nIISc Bangalore\nIISER Pune\nIIT Delhi\nTIFR Mumbai', color: "#10b981" }, position: { x: 0, y: 0 } },
// Commerce Stream - A. FINANCE & PROFESSIONAL
{ id: '2A', type: 'custom', data: { label: 'A. FINANCE & PROFESSIONAL', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2A1', type: 'custom', data: { label: '1. Chartered Accountant (CA)\nICAI\nVSI Jaipur\nAldine CA\nUnacademy CA', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2A2', type: 'custom', data: { label: '2. Company Secretary (CS)\nICSI\nToplad\nElite CS\nUnacademy CS', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2A3', type: 'custom', data: { label: '3. Cost & Management Accountant (CMA)\nICMAI\nTakshila Learning\nEdugyan\nUnacademy CMA', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2A4', type: 'custom', data: { label: '4. CFA (Chartered Financial Analyst)\nCFA Institute (official)\nIMS Proschool\nEdu Pristine\nFitch Learning', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2A5', type: 'custom', data: { label: '5. Banking (SBI/IBPS/RBI)\nAdda247 Banking\nCareer Power\nUnacademy Bank\nOliveboard', color: "#f59e0b" }, position: { x: 0, y: 0 } },
// Commerce Stream - B. BUSINESS & CORPORATE
{ id: '2B', type: 'custom', data: { label: 'B. BUSINESS & CORPORATE', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2B1', type: 'custom', data: { label: '1. BBA → MBA\nIIM Indore (IPM)\nNMIMS Mumbai\nChrist University\nDelhi University', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2B2', type: 'custom', data: { label: '2. Entrepreneurship\nNSRCEL IIM Bangalore\nBITS Pilani\nSIBM Pune\nStartup India', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2B3', type: 'custom', data: { label: '3. Marketing/HR/Operations\nIIM Ahmedabad\nXLRI Jamshedpur\nFMS Delhi\nSymbiosis Pune', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2B4', type: 'custom', data: { label: '4. E-commerce Management\nIIM Bangalore\nNMIMS\nUpGrad\nCoursera', color: "#f59e0b" }, position: { x: 0, y: 0 } },
// Commerce Stream - C. ANALYTICAL CAREERS
{ id: '2C', type: 'custom', data: { label: 'C. ANALYTICAL CAREERS', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2C1', type: 'custom', data: { label: '1. Business Analyst\nISI Kolkata\nIIT Madras\nGreat Learning BA\nCoursera', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2C2', type: 'custom', data: { label: '2. Financial Analyst\nCFA Institute\nEdu Pristine\nUdemy Finance\nIMS Proschool', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2C3', type: 'custom', data: { label: '3. Investment Banker\nIIM Ahmedabad\nISB Hyderabad\nNMIMS\nNSE Courses', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2C4', type: 'custom', data: { label: '4. Stock Market Trader\nZerodha Varsity (best free course)\nNSE Certification\nBSE Institute\nFinGrad', color: "#f59e0b" }, position: { x: 0, y: 0 } },
// Commerce Stream - D. OTHER COMMERCE PATHS
{ id: '2D', type: 'custom', data: { label: 'D. OTHER COMMERCE PATHS', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2D1', type: 'custom', data: { label: '1. Law (CLAT)\nNLSIU Bangalore\nNALSAR Hyderabad\nNLU D\nSymbiosis Pune', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2D2', type: 'custom', data: { label: '2. Hotel Management\nIHM Delhi\nIHM Mumbai\nWelcomgroup Manipal\nAmity Hospitality', color: "#f59e0b" }, position: { x: 0, y: 0 } },
{ id: '2D3', type: 'custom', data: { label: '3. Economics\nDelhi School of Economics\nAshoka University\nJNU\nLoyola College', color: "#f59e0b" }, position: { x: 0, y: 0 } },
// Arts/Humanities Stream - A. GOVERNMENT & PUBLIC SECTOR
{ id: '3A', type: 'custom', data: { label: 'A. GOVERNMENT & PUBLIC SECTOR', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3A1', type: 'custom', data: { label: '1. UPSC (IAS, IPS)\nVajiram & Ravi\nDrishti IAS\nVision IAS\nUnacademy UPSC', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3A2', type: 'custom', data: { label: '2. MPSC/State PSC\nStudy Circle\nDyaneshwari Academy\nUnacademy\nAdda247', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3A3', type: 'custom', data: { label: '3. Defence (NDA Non-Tech)\nNDA Khadakwasla\nMajor Kalshi Classes\nSSB Crack\nShield Defence Academy', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3A4', type: 'custom', data: { label: '4. Public Administration\nIGNOU\nDelhi University\nJNU Delhi\nAmity University', color: "#3b82f6" }, position: { x: 0, y: 0 } },
// Arts/Humanities Stream - B. LEGAL & SOCIAL SCIENCES
{ id: '3B', type: 'custom', data: { label: 'B. LEGAL & SOCIAL SCIENCES', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3B1', type: 'custom', data: { label: '1. Law (BALLB)\nNLSIU Bangalore\nNLU Delhi\nSymbiosis Pune\nJindal Global Law School', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3B2', type: 'custom', data: { label: '2. Psychology\nChrist University\nDU North Campus\nJMI Delhi\nSt. Xavier’s Mumbai', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3B3', type: 'custom', data: { label: '3. Social Work\nTISS Mumbai\nDelhi University\nNIMHANS\nIGNOU', color: "#3b82f6" }, position: { x: 0, y: 0 } },
// Arts/Humanities Stream - C. MEDIA & COMMUNICATION
{ id: '3C', type: 'custom', data: { label: 'C. MEDIA & COMMUNICATION', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3C1', type: 'custom', data: { label: '1. Journalism\nIIMC Delhi\nXavier Institute of Communications\nSymbiosis Institute of Media\nAmity School of Communication', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3C2', type: 'custom', data: { label: '2. Mass Communication\nIIMC\nManipal Institute\nBennett University\nPearl Academy', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3C3', type: 'custom', data: { label: '3. Content Writing\nCoursera\nUdemy\nHenry Harvin\nHubSpot Academy', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3C4', type: 'custom', data: { label: '4. Event Management\nNAEMD Mumbai\nNIEM Pune\nPearl Academy\nWizcraft Academy', color: "#3b82f6" }, position: { x: 0, y: 0 } },
// Arts/Humanities Stream - D. CREATIVE FIELDS
{ id: '3D', type: 'custom', data: { label: 'D. CREATIVE FIELDS', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3D1', type: 'custom', data: { label: '1. Fashion Design\nNIFT\nNID\nPearl Academy\nAmity School of Fashion', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3D2', type: 'custom', data: { label: '2. Interior Design\nCEPT Ahmedabad\nJJ School of Arts\nNID\nPearl Academy', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3D3', type: 'custom', data: { label: '3. Fine Arts\nJJ School of Arts\nKala Bhavan (Shantiniketan)\nMSU Baroda\nDelhi College of Arts', color: "#3b82f6" }, position: { x: 0, y: 0 } },
{ id: '3D4', type: 'custom', data: { label: '4. UI/UX Design\nNID\nISD I Mumbai\nMIT ID Pune\nCoursera UI/UX', color: "#3b82f6" }, position: { x: 0, y: 0 } },
// Diploma/Vocational Stream
{ id: '4-1', type: 'custom', data: { label: '1. Polytechnic Engineering\nGovernment Polytechnic Mumbai\nGovernment Polytechnic Pune\nThapar Polytechnic\nMSU Baroda Polytechnic', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-2', type: 'custom', data: { label: '2. Electrician/Plumber/Technician\nITI Government Institutes\nNSDC Skill India\nLarsen & Toubro Skill Centre\nTATA STRIVE', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-3', type: 'custom', data: { label: '3. Automobile Technician\nITI Motor Mechanic\nBosch Training Centre\nMaruti Suzuki Training Academy\nTata Motors Skill Centre', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-4', type: 'custom', data: { label: '4. Animation & VFX\nArena Animation\nMAAC\nWhistling Woods International\nICAT', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-5', type: 'custom', data: { label: '5. Graphic Design\nNID\nMIT ID Pune\nArena Animation\nUdemy', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-6', type: 'custom', data: { label: '6. Digital Marketing\nIIDE\nGoogle Digital Garage\nHubSpot Academy\nUdemy', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-7', type: 'custom', data: { label: '7. Hotel Management\nIHM Delhi\nIHM Mumbai\nWelcomgroup Manipal\nAmity Hospitality', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-8', type: 'custom', data: { label: '8. Cabin Crew/Aviation\nFrankfinn Institute\nAir Hostess Academy\nAptech Aviation\nJet Airways Training Academy', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-9', type: 'custom', data: { label: '9. Agriculture\nIndian Agricultural Research Institute\nPunjab Agricultural University\nTNAU\nGBPUAT Pantnagar', color: "#ef4444" }, position: { x: 0, y: 0 } },
{ id: '4-10', type: 'custom', data: { label: '10. Medical Lab Technician\nAIIMS\nJIPMER\nManipal MLT\nSRM Institute', color: "#ef4444" }, position: { x: 0, y: 0 } },
// New-Age Careers - A. TECHNOLOGY
{ id: '5A', type: 'custom', data: { label: 'A. TECHNOLOGY', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A1', type: 'custom', data: { label: '1. AI & ML\nIIT Hyderabad\nIISc Bangalore\nIIIT Bangalore\nUpGrad AI/ML', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A2', type: 'custom', data: { label: '2. Data Science\nIIT Madras (BSDS)\nISI Kolkata\nGreat Learning DS\nCoursera', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A3', type: 'custom', data: { label: '3. Cybersecurity\nEC-Council CEH\nIIT Kanpur Cybersecurity\nOSCP\nCoursera IBM Security', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A4', type: 'custom', data: { label: '4. Cloud Computing\nAWS Academy\nGoogle Cloud\nMicrosoft Azure\nUdemy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A5', type: 'custom', data: { label: '5. Blockchain Development\nIIT Kanpur Blockchain\nBlockchain Council\nUdemy\nCoursera', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A6', type: 'custom', data: { label: '6. Full-Stack Development\nMasai School\nPW Skills\nNewton School\nFreeCodeCamp', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A7', type: 'custom', data: { label: '7. App Development\nCoding Ninjas\nUdemy\nCoursera\nPW Skills', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A8', type: 'custom', data: { label: '8. AR/VR Development\nIIT Jodhpur\nArena Animation\nUdacity\nCoursera', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5A9', type: 'custom', data: { label: '9. Game Development\nICAT Design\nArena Animation\nMAAC\nUdemy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
// New-Age Careers - B. BUSINESS & FINANCE
{ id: '5B', type: 'custom', data: { label: 'B. BUSINESS & FINANCE', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5B1', type: 'custom', data: { label: '1. Product Management\nUpGrad\nISB Hyderabad\nIIM Bangalore\nCoursera Google PM', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5B2', type: 'custom', data: { label: '2. Business Analytics\nGreat Learning\nISB\nIIT Madras\nCoursera', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5B3', type: 'custom', data: { label: '3. Startup Founder Skills\nStartup India\nNSRCEL IIMB\nY Combinator Startup School\nUdemy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
// New-Age Careers - C. CREATIVE & DIGITAL
{ id: '5C', type: 'custom', data: { label: 'C. CREATIVE & DIGITAL', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5C1', type: 'custom', data: { label: '1. Content Creator/Influencer\nYouTube Creator Academy\nMeta Blueprint\nUdemy Content Creation\nNas Academy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5C2', type: 'custom', data: { label: '2. Video Editing\nFilmora Academy\nPremiere Pro Masterclass (Udemy)\nFTII Pune\nMAAC', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5C3', type: 'custom', data: { label: '3. Graphic Design\nNID\nArena Animation\nISD I Mumbai\nUdemy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5C4', type: 'custom', data: { label: '4. Social Media Manager\nIIDE\nGoogle Digital Marketing\nHubSpot Academy\nCoursera', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
{ id: '5C5', type: 'custom', data: { label: '5. Digital Marketing\nGoogle\nHubSpot\nIIDE\nUdemy', color: "#8b5cf6" }, position: { x: 0, y: 0 } },
]

 export const initialEdges = [
    // Science Stream connections
    { id: 'e1-1A', source: '1', target: '1A', animated: true },
    { id: 'e1-1B', source: '1', target: '1B', animated: true },
    { id: 'e1-1C', source: '1', target: '1C', animated: true },
    { id: 'e1A-1A1', source: '1A', target: '1A1', animated: true },
    { id: 'e1A1-1A11', source: '1A1', target: '1A11', animated: true },
    { id: 'e1A1-1A12', source: '1A1', target: '1A12', animated: true },
    { id: 'e1A1-1A13', source: '1A1', target: '1A13', animated: true },
    { id: 'e1A1-1A14', source: '1A1', target: '1A14', animated: true },
    { id: 'e1A1-1A15', source: '1A1', target: '1A15', animated: true },
    { id: 'e1A1-1A16', source: '1A1', target: '1A16', animated: true },
    { id: 'e1A1-1A17', source: '1A1', target: '1A17', animated: true },
    { id: 'e1A1-1A18', source: '1A1', target: '1A18', animated: true },
    { id: 'e1A-1A2', source: '1A', target: '1A2', animated: true },
    { id: 'e1A2-1A21', source: '1A2', target: '1A21', animated: true },
    { id: 'e1A2-1A22', source: '1A2', target: '1A22', animated: true },
    { id: 'e1A2-1A23', source: '1A2', target: '1A23', animated: true },
    { id: 'e1A2-1A24', source: '1A2', target: '1A24', animated: true },
    { id: 'e1A2-1A25', source: '1A2', target: '1A25', animated: true },
    { id: 'e1A2-1A26', source: '1A2', target: '1A26', animated: true },
    { id: 'e1A-1A3', source: '1A', target: '1A3', animated: true },
    { id: 'e1A3-1A31', source: '1A3', target: '1A31', animated: true },
    { id: 'e1A3-1A32', source: '1A3', target: '1A32', animated: true },
    { id: 'e1A3-1A33', source: '1A3', target: '1A33', animated: true },
    { id: 'e1A3-1A34', source: '1A3', target: '1A34', animated: true },
    { id: 'e1B-1B1', source: '1B', target: '1B1', animated: true },
    { id: 'e1B1-1B11', source: '1B1', target: '1B11', animated: true },
    { id: 'e1B1-1B12', source: '1B1', target: '1B12', animated: true },
    { id: 'e1B1-1B13', source: '1B1', target: '1B13', animated: true },
    { id: 'e1B1-1B14', source: '1B1', target: '1B14', animated: true },
    { id: 'e1B1-1B15', source: '1B1', target: '1B15', animated: true },
    { id: 'e1B-1B2', source: '1B', target: '1B2', animated: true },
    { id: 'e1B2-1B21', source: '1B2', target: '1B21', animated: true },
    { id: 'e1B2-1B22', source: '1B2', target: '1B22', animated: true },
    { id: 'e1B2-1B23', source: '1B2', target: '1B23', animated: true },
    { id: 'e1B2-1B24', source: '1B2', target: '1B24', animated: true },
    { id: 'e1B2-1B25', source: '1B2', target: '1B25', animated: true },
    { id: 'e1B-1B3', source: '1B', target: '1B3', animated: true },
    { id: 'e1B3-1B31', source: '1B3', target: '1B31', animated: true },
    { id: 'e1B3-1B32', source: '1B3', target: '1B32', animated: true },
    { id: 'e1B3-1B33', source: '1B3', target: '1B33', animated: true },
    { id: 'e1B3-1B34', source: '1B3', target: '1B34', animated: true },
    { id: 'e1C-1C1', source: '1C', target: '1C1', animated: true },
    { id: 'e1C-1C2', source: '1C', target: '1C2', animated: true },
    { id: 'e1C-1C3', source: '1C', target: '1C3', animated: true },
    // Commerce Stream connections
    { id: 'e2-2A', source: '2', target: '2A', animated: true },
    { id: 'e2A-2A1', source: '2A', target: '2A1', animated: true },
    { id: 'e2A-2A2', source: '2A', target: '2A2', animated: true },
    { id: 'e2A-2A3', source: '2A', target: '2A3', animated: true },
    { id: 'e2A-2A4', source: '2A', target: '2A4', animated: true },
    { id: 'e2A-2A5', source: '2A', target: '2A5', animated: true },
    { id: 'e2-2B', source: '2', target: '2B', animated: true },
    { id: 'e2B-2B1', source: '2B', target: '2B1', animated: true },
    { id: 'e2B-2B2', source: '2B', target: '2B2', animated: true },
    { id: 'e2B-2B3', source: '2B', target: '2B3', animated: true },
    { id: 'e2B-2B4', source: '2B', target: '2B4', animated: true },
    { id: 'e2-2C', source: '2', target: '2C', animated: true },
    { id: 'e2C-2C1', source: '2C', target: '2C1', animated: true },
    { id: 'e2C-2C2', source: '2C', target: '2C2', animated: true },
    { id: 'e2C-2C3', source: '2C', target: '2C3', animated: true },
    { id: 'e2C-2C4', source: '2C', target: '2C4', animated: true },
    { id: 'e2-2D', source: '2', target: '2D', animated: true },
    { id: 'e2D-2D1', source: '2D', target: '2D1', animated: true },
    { id: 'e2D-2D2', source: '2D', target: '2D2', animated: true },
    { id: 'e2D-2D3', source: '2D', target: '2D3', animated: true },
    // Arts/Humanities Stream connections
    { id: 'e3-3A', source: '3', target: '3A', animated: true },
    { id: 'e3A-3A1', source: '3A', target: '3A1', animated: true },
    { id: 'e3A-3A2', source: '3A', target: '3A2', animated: true },
    { id: 'e3A-3A3', source: '3A', target: '3A3', animated: true },
    { id: 'e3A-3A4', source: '3A', target: '3A4', animated: true },
    { id: 'e3-3B', source: '3', target: '3B', animated: true },
    { id: 'e3B-3B1', source: '3B', target: '3B1', animated: true },
    { id: 'e3B-3B2', source: '3B', target: '3B2', animated: true },
    { id: 'e3B-3B3', source: '3B', target: '3B3', animated: true },
    { id: 'e3-3C', source: '3', target: '3C', animated: true },
    { id: 'e3C-3C1', source: '3C', target: '3C1', animated: true },
    { id: 'e3C-3C2', source: '3C', target: '3C2', animated: true },
    { id: 'e3C-3C3', source: '3C', target: '3C3', animated: true },
    { id: 'e3C-3C4', source: '3C', target: '3C4', animated: true },
    { id: 'e3-3D', source: '3', target: '3D', animated: true },
    { id: 'e3D-3D1', source: '3D', target: '3D1', animated: true },
    { id: 'e3D-3D2', source: '3D', target: '3D2', animated: true },
    { id: 'e3D-3D3', source: '3D', target: '3D3', animated: true },
    { id: 'e3D-3D4', source: '3D', target: '3D4', animated: true },
    // Diploma/Vocational Stream connections
    { id: 'e4-4-1', source: '4', target: '4-1', animated: true },
    { id: 'e4-4-2', source: '4', target: '4-2', animated: true },
    { id: 'e4-4-3', source: '4', target: '4-3', animated: true },
    { id: 'e4-4-4', source: '4', target: '4-4', animated: true },
    { id: 'e4-4-5', source: '4', target: '4-5', animated: true },
    { id: 'e4-4-6', source: '4', target: '4-6', animated: true },
    { id: 'e4-4-7', source: '4', target: '4-7', animated: true },
    { id: 'e4-4-8', source: '4', target: '4-8', animated: true },
    { id: 'e4-4-9', source: '4', target: '4-9', animated: true },
    { id: 'e4-4-10', source: '4', target: '4-10', animated: true },
    // New-Age Careers connections
    { id: 'e5-5A', source: '5', target: '5A', animated: true },
    { id: 'e5A-5A1', source: '5A', target: '5A1', animated: true },
    { id: 'e5A-5A2', source: '5A', target: '5A2', animated: true },
    { id: 'e5A-5A3', source: '5A', target: '5A3', animated: true },
    { id: 'e5A-5A4', source: '5A', target: '5A4', animated: true },
    { id: 'e5A-5A5', source: '5A', target: '5A5', animated: true },
    { id: 'e5A-5A6', source: '5A', target: '5A6', animated: true },
    { id: 'e5A-5A7', source: '5A', target: '5A7', animated: true },
    { id: 'e5A-5A8', source: '5A', target: '5A8', animated: true },
    { id: 'e5A-5A9', source: '5A', target: '5A9', animated: true },
    { id: 'e5-5B', source: '5', target: '5B', animated: true },
    { id: 'e5B-5B1', source: '5B', target: '5B1', animated: true },
    { id: 'e5B-5B2', source: '5B', target: '5B2', animated: true },
    { id: 'e5B-5B3', source: '5B', target: '5B3', animated: true },
    { id: 'e5-5C', source: '5', target: '5C', animated: true },
    { id: 'e5C-5C1', source: '5C', target: '5C1', animated: true },
    { id: 'e5C-5C2', source: '5C', target: '5C2', animated: true },
    { id: 'e5C-5C3', source: '5C', target: '5C3', animated: true },
    { id: 'e5C-5C4', source: '5C', target: '5C4', animated: true },
    { id: 'e5C-5C5', source: '5C', target: '5C5', animated: true },
  ];