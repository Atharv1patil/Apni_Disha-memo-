"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

/* ------------------ Configuration (small / compact) ------------------ */
const CHILD_NODE_WIDTH = 160;
const CHILD_NODE_HEIGHT = 48;
const PARENT_PADDING = 12;
const DAGRE_NODESEP = 48;
const DAGRE_RANKSEP = 16;

/* dagre instance (re-used) */
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

/* small compact node renderer */
const CompactNode = ({ data }) => {
  const accent = data?.color || "#6366f1";

  return (
    <div
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      style={{
        width: CHILD_NODE_WIDTH,
        minHeight: CHILD_NODE_HEIGHT,
        padding: "8px 10px",
        background: "linear-gradient(180deg,#ffffff,#f8fafc)",
        border: `1px solid rgba(0,0,0,0.08)`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "0.2s transform",
        fontSize: 12,
        cursor: "pointer",
        lineHeight: "1.15",
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
      title={data.label.replace(/\n/g, " ")}
    ><Handle type="target" position={Position.Top} style={{ borderRadius: 3 }} />
      <div style={{ fontWeight: 600, color: "#0f172a" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 3 }} />
    </div>
  );
};

    
/* group (parent) renderer */
const GroupNode = ({ data }) => {
  const width = data?.width || CHILD_NODE_WIDTH + PARENT_PADDING * 2;
  const height = data?.height || CHILD_NODE_HEIGHT + PARENT_PADDING * 2;
  return (
    <div
      style={{
        width,
        minHeight: height,
        padding: 8,
        background: "rgba(243,244,246,0.95)",
        border: "1px solid rgba(99,102,241,0.12)",
        borderRadius: 10,
        fontSize: 12,
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontWeight: 700 }}>{data.label}</div>
    </div>
  );
};

/* ------------------ Dagre layout (absolute positions) ------------------ */
/* ------------------ REMOVE DAGRE — WE USE SYMMETRIC FAMILY TREE LAYOUT ------------------ */

function buildChildrenMap(edges) {
  const map = new Map();
  edges.forEach((e) => {
    if (!map.has(e.source)) map.set(e.source, []);
    map.get(e.source).push(e.target);
  });
  return map;
}

function buildIncomingMap(edges) {
  const map = new Map();
  edges.forEach((e) => {
    if (!map.has(e.target)) map.set(e.target, []);
    map.get(e.target).push(e.source);
  });
  return map;
}

/* ---- NEW: Compute subtree width for symmetry ---- */
/* -----------------------------------------------
   CONFIG – adjust these to tune your layout
-------------------------------------------------- */
const LEVEL_VERTICAL_GAP = 120;  // distance between parent & children
const SIBLING_HORIZONTAL_GAP = 40; // gap between subtrees
const MIN_NODE_WIDTH = CHILD_NODE_WIDTH + 40;

/* -------------------------------------------------
   Compute subtree width recursively
-------------------------------------------------- */
function computeSubtreeWidth(nodeId, childrenMap) {
  const children = childrenMap.get(nodeId) || [];

  // leaf node → minimal width
  if (children.length === 0) return MIN_NODE_WIDTH;

  let total = 0;
  for (const child of children) {
    total += computeSubtreeWidth(child, childrenMap);
  }

  return Math.max(total, MIN_NODE_WIDTH);
}

/* -------------------------------------------------
   Symmetric, centered family tree layout
-------------------------------------------------- */
function layoutTree(rootId, childrenMap, x, y, positioned, subtreeWidthFn) {
  const children = childrenMap.get(rootId) || [];
  const thisWidth = subtreeWidthFn(rootId);

  // parent centered above children
  positioned[rootId] = {
    x: x + thisWidth / 2 - CHILD_NODE_WIDTH / 2,
    y: y,
  };

  if (children.length === 0) return;

  // lay out children horizontally
  let cursorX = x;
  for (const child of children) {
    const w = subtreeWidthFn(child);
    layoutTree(child, childrenMap, cursorX, y + LEVEL_VERTICAL_GAP, positioned, subtreeWidthFn);
    cursorX += w + SIBLING_HORIZONTAL_GAP;
  }
}

/* -------------------------------------------------
   DFS: collect descendants
-------------------------------------------------- */
function collectDescendants(startId, childrenMap) {
  const out = new Set();
  const stack = [...(childrenMap.get(startId) || [])];

  while (stack.length) {
    const cur = stack.pop();
    if (!out.has(cur)) {
      out.add(cur);
      const kids = childrenMap.get(cur) || [];
      kids.forEach((k) => stack.push(k));
    }
  }

  return out;
}

/* -------------------------------------------------
   NEW getLayoutedElements() → replaces DAGRE
   Uses family-tree symmetric layout
-------------------------------------------------- */
function getLayoutedElements(nodes, edges) {
  const childrenMap = buildChildrenMap(edges);
  const incomingMap = buildIncomingMap(edges);

  // root nodes = nodes with no incoming edges
  const rootNodes = nodes.filter((n) => !incomingMap.has(n.id));

  const subtreeWidthFn = (id) => computeSubtreeWidth(id, childrenMap);
  const positioned = {};

  // lay out each tree next to each other
  let startX = 0;

  for (const root of rootNodes) {
    const width = subtreeWidthFn(root.id);
    layoutTree(root.id, childrenMap, startX, 0, positioned, subtreeWidthFn);
    startX += width + 200; // gap between independent root trees
  }

  // apply final positions
  const layoutedNodes = nodes.map((n) => ({
    ...n,
    position: positioned[n.id] || { x: 0, y: 0 },
    draggable: true,
  }));

  return {
    nodes: layoutedNodes,
    edges: edges.map((e) => ({
      ...e,
      type: "smoothstep",
      style: {
        stroke: "rgba(71,85,105,0.35)",
        strokeWidth: 1.8,
      },
      markerEnd: {
        type: "arrowclosed",
        color: "rgba(71,85,105,0.35)",
      },
    })),
  };
}



/* ------------------ Main component ------------------ */
export default function FlowChart({
  isFullScreen = false,
  onCloseFullScreen,
}) {
  const initialNodes = [
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

  const initialEdges = [
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

  // -------------------------
  // PARENT–CHILD MOVE SYSTEM
  // -------------------------
  // children map built once from initialEdges
  const childrenMap = useMemo(() => buildChildrenMap(initialEdges), [/* initialEdges stable */]);

  // wrapper to collect descendants
  const getAllDescendants = useCallback(
    (id) => {
      return collectDescendants(id, childrenMap);
    },
    [childrenMap]
  );

  // -------------------------
  // node types
  // -------------------------
  const nodeTypes = useMemo(
    () => ({
      custom: CompactNode,
      group: GroupNode,
    }),
    []
  );
const [collapsed, setCollapsed] = useState(new Set());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState(initialEdges);

  edges.map((e) => ({
  ...e,
  type: "smoothstep",
  style: { stroke: "rgba(71,85,105,0.35)", strokeWidth: 1.5 },
  markerEnd: {
    type: "arrowclosed",
    color: "rgba(71,85,105,0.35)"
  }
}))
  // Auto-layout nodes once at mount (TB layout)
  useEffect(() => {
    // Use the full initialNodes & initialEdges arrays for layout
    const { nodes: layouted, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, "TB");
    setNodes(layouted);
    setEdges(layoutedEdges);
    const collapsedLocal = collapsed;

const filteredNodes = layouted.filter((n) => {
  // If parent is collapsed, hide all its descendants
  for (const parentId of collapsedLocal) {
    const desc = getAllDescendants(parentId, childrenMap);
    if (desc.has(n.id)) return false;
  }
  return true;
});

const filteredEdges = layoutedEdges.filter((e) => {
  for (const parentId of collapsedLocal) {
    const desc = getAllDescendants(parentId, childrenMap);
    if (desc.has(e.target)) return false;
  }
  return true;
});

setNodes(filteredNodes);
setEdges(filteredEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]); // run once

  // ============================
  // CUSTOM DRAG MANAGER FOR PARENTS
  // ============================
  const onNodeDrag = useCallback(
  (evt, draggedNode) => {
    const deltaX = draggedNode.position.x - draggedNode.__rf.position.x;
    const deltaY = draggedNode.position.y - draggedNode.__rf.position.y;

    const descendants = getAllDescendants(draggedNode.id, childrenMap);

    setNodes((nds) =>
      nds.map((n) => {
        // move node ONLY if visible AND descendant
        const isVisible = !Array.from(collapsed)
          .some((p) => getAllDescendants(p, childrenMap).has(n.id));

        if (descendants.has(n.id) && isVisible) {
          return {
            ...n,
            position: {
              x: n.position.x + deltaX,
              y: n.position.y + deltaY,
            },
          };
        }
        return n;
      })
    );

    draggedNode.__rf.position = { ...draggedNode.position };
  },
  [childrenMap, collapsed]
);

// Toggle collapse
const toggleCollapse = useCallback((nodeId) => {
  setCollapsed((prev) => {
    const next = new Set(prev);
    if (next.has(nodeId)) next.delete(nodeId);
    else next.add(nodeId);
    return next;
  });
}, []);
  // prevent jitter on first drag by storing starting rf position
  const onNodeDragStart = useCallback((evt, node) => {
    // store a starting snapshot on the node so we can compute deltas later
    node.__rf = node.__rf || {};
    node.__rf.position = { ...(node.position || { x: 0, y: 0 }) };
  }, []);

  // ============================
  // RENDER
  // ============================
  return (
    <div
  className={`w-full ${isFullScreen ? "h-full" : "h-96"} 
    bg-gradient-to-b from-indigo-50 to-indigo-100 rounded-2xl shadow-inner overflow-hidden relative`}
 
>
      {isFullScreen && (
        <button
          onClick={onCloseFullScreen}
          className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="w-full h-full">
  <ReactFlow
    style={{ width: "100%", height: "100%" }}
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    nodesDraggable
    nodesConnectable={false}
    elementsSelectable
    onNodesChange={onNodesChange}
    onNodeClick={(evt, node) => toggleCollapse(node.id)}
    edgesFocusable
    onNodeDrag={onNodeDrag}
    onNodeDragStart={onNodeDragStart}
    panOnDrag
    zoomOnScroll
    zoomOnDoubleClick={false}
    fitView
    fitViewOptions={{
      padding: isFullScreen ? 0.05 : 0.1,
      duration: 600,
    }}
  >
    {isFullScreen ? (
      <>
        <Controls className="bg-white rounded shadow-lg" />
        <MiniMap className="bg-white border-2 border-indigo-200" zoomable pannable />
      </>
    ) : (
      <Background variant="dots" gap={16} size={0.8} color="#c7d2fe" />
    )}

    {isFullScreen && <Background variant="dots" gap={20} size={1} />}
  </ReactFlow>
</div>
    </div>
  );
}
