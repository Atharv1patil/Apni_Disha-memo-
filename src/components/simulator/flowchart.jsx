"use client";
import React, { useCallback, useEffect, useMemo, useState, } from "react";
import { X } from "lucide-react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,useReactFlow,
  Handle,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import { ReactFlowProvider } from "reactflow";
import { INITIAL_NODES,initialEdges } from "@/utils/careerStream";
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
const isHighlighted = data?.highlight;


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
        boxShadow: isHighlighted
          ? "0 0 0 3px rgba(99,102,241,0.5), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transition: "0.2s transform, 0.3s box-shadow",
        fontSize: 12,
        cursor: "pointer",
        lineHeight: "1.15",
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        transform: isHighlighted ? "scale(1.02)" : "scale(1.0)",
        
      }}
      title={data.label.replace(/\n/g, " ")}
    >
      <Handle type="target" position={Position.Top} style={{ borderRadius: 3 }} />
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
  if (children.length === 0) return MIN_NODE_WIDTH;
  let total = 0;
  for (const child of children) {
    total += computeSubtreeWidth(child, childrenMap);
  }
  return Math.max(total, MIN_NODE_WIDTH);
}

function layoutTree(rootId, childrenMap, x, y, positioned, subtreeWidthFn) {
  const children = childrenMap.get(rootId) || [];
  const thisWidth = subtreeWidthFn(rootId);
  positioned[rootId] = {
    x: x + thisWidth / 2 - CHILD_NODE_WIDTH / 2,
    y: y,
  };
  if (children.length === 0) return;
  let cursorX = x;
  for (const child of children) {
    const w = subtreeWidthFn(child);
    layoutTree(child, childrenMap, cursorX, y + LEVEL_VERTICAL_GAP, positioned, subtreeWidthFn);
    cursorX += w + SIBLING_HORIZONTAL_GAP;
  }
}

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
/* -------------------------------------------------
   NEW getLayoutedElements() → replaces DAGRE
   Uses family-tree symmetric layout
-------------------------------------------------- */
function getLayoutedElements(nodes, edges, selectedStreams = [1, 2, 3, 4, 5]) {
  const childrenMap = buildChildrenMap(edges);
  const incomingMap = buildIncomingMap(edges);
  const rootNodes = nodes.filter((n) => !incomingMap.has(n.id));
  const subtreeWidthFn = (id) => computeSubtreeWidth(id, childrenMap);
  const positioned = {};
  let startX = 0;
  for (const root of rootNodes) {
    const width = subtreeWidthFn(root.id);
    layoutTree(root.id, childrenMap, startX, 0, positioned, subtreeWidthFn);
    startX += width + 200;
  }

  // Apply hidden: Parse stream from id[0] (e.g., '1A' -> 1)
  const layoutedNodes = nodes.map((n) => {
    const streamNum = parseInt(n.id.charAt(0));
    const shouldHide = isNaN(streamNum) || !selectedStreams.includes(streamNum);
    return {
      ...n,
      position: positioned[n.id] || { x: 0, y: 0 },
      hidden: shouldHide,
      draggable: true,
    };
  });

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
  selectedStreams = [1, 2, 3, 4, 5], // New prop: Array of visible stream numbers
  searchQuery = "", // New prop: Search string for highlighting/zooming
  
}) {
  // New state for highlight
  const [highlightNodeId, setHighlightNodeId] = useState(null);
  const { fitBounds, getNodes } = useReactFlow(); // New: For search zoom

  // Your full INITIAL_NODES (unchanged - paste the complete array from your original)


  // -------------------------
  // PARENT–CHILD MOVE SYSTEM
  // -------------------------
  // children map built once from initialEdges
  const childrenMap = useMemo(() => buildChildrenMap(initialEdges), [/* initialEdges stable */]);
const memoEdges = useMemo(() => initialEdges, []);
const initialEdgesMemo = useMemo(() => initialEdges, []);
const INITIAL_NODES_MEMO = useMemo(() => INITIAL_NODES, []);
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
// Updated useEffect: Handles layout, collapse, hide, highlight
useEffect(() => {
  // 1. Layout nodes only once
  const { nodes: layouted, edges: layoutedEdges } =
    getLayoutedElements(INITIAL_NODES_MEMO, initialEdgesMemo, selectedStreams);


  // 2. Apply collapse filtering
  let processedNodes = layouted.filter((n) => {
    for (const parentId of collapsed) {
      if (getAllDescendants(parentId).has(n.id)) return false;
    }
    return !n.hidden;
  });

  // 3. Filter edges accordingly
  const processedEdges = layoutedEdges.filter((e) => {
    for (const parentId of collapsed) {
      if (getAllDescendants(parentId).has(e.target)) return false;
    }
    const sourceVisible = processedNodes.some((n) => n.id === e.source && !n.hidden);
    const targetVisible = processedNodes.some((n) => n.id === e.target && !n.hidden);
    return sourceVisible && targetVisible;
  });

  // 4. Apply highlight
  processedNodes = processedNodes.map((n) => ({
    ...n,
    data: { ...n.data, highlight: n.id === highlightNodeId },
  }));

  // 5. Update ReactFlow only once
  setNodes(processedNodes);
  setEdges(processedEdges);

}, [collapsed, selectedStreams, highlightNodeId]);

  // New: Search effect - highlight and zoom
  useEffect(() => {
    if (!searchQuery.trim()) {
      setHighlightNodeId(null);
      return;
    }
    try {
      const currentNodes = getNodes();
      const match = currentNodes.find(
        (n) =>
          n.data.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !n.hidden
      );
      if (match) {
        setHighlightNodeId(match.id);
        const x = match.positionAbsolute?.x || match.position.x;
        const y = match.positionAbsolute?.y || match.position.y;
        const bounds = {
          x: x - 20,
          y: y - 20,
          width: CHILD_NODE_WIDTH + 40,
          height: CHILD_NODE_HEIGHT + 40,
        };
        fitBounds(bounds, { padding: 0.3, duration: 800 });
      } else {
        setHighlightNodeId(null);
        console.warn(`No career found for "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Search error:", error);
      setHighlightNodeId(null);
    }
  }, [searchQuery, fitBounds, getNodes]);
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
