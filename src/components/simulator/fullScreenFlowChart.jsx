// New file: components/FullScreenFlowChart.jsx
// This component handles the full-screen modal with functional filters and search.
// It wraps the FlowChart component and manages the interaction state.
// Assumes FlowChart.jsx has been updated as per the notes below (minimal changes for functionality).

import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Filter } from 'lucide-react'; // Assuming lucide-react is available
import FlowChart from './FlowChart'; // Adjust path as needed
import { getLabel } from "../../utils/careerStream"; // Adjust path as needed
import { ReactFlowProvider } from 'reactflow';
// Stream configuration for filters
const STREAM_CONFIG = [
  { num: 1, label: { en: 'Science', hi: 'विज्ञान', ur: 'سائنس' } },
  { num: 2, label: { en: 'Commerce', hi: 'कॉमर्स', ur: 'کامرس' } },
  { num: 3, label: { en: 'Arts/Humanities', hi: 'कला/मानविकी', ur: 'آرٹس/ہیو مینیٹیز' } },
  { num: 4, label: { en: 'Diploma/Vocational', hi: 'डिप्लोमा/व्यावसायिक', ur: 'ڈپلومہ/ووکیشنل' } },
  { num: 5, label: { en: 'New-Age Careers', hi: 'नई-उम्र करियर', ur: 'نئی عمر کیریئرز' } },
];

const FullScreenFlowChart = ({ onClose, active, getLabel: getLabelFn, lang, t, dynamicPerks }) => {
  const [selectedStreams, setSelectedStreams] = useState([1, 2, 3, 4, 5]); // Initially all selected
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoResult, setShowNoResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  
  // Debounced search handler (simple 300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        // Trigger search in FlowChart via prop change
      } else {
        setShowNoResult(false);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter handler
  const toggleStream = useCallback((num) => {
    setSelectedStreams((prev) => {
      if (prev.includes(num)) {
        return prev.filter((s) => s !== num);
      }
      return [...prev, num];
    });
  }, []);

  // If no streams selected, show a warning (but don't force all)
  const allStreamsSelected = selectedStreams.length === 5;
  const noStreamsSelected = selectedStreams.length === 0;

  // Error handling: Reset search on empty
  useEffect(() => {
    if (!searchQuery) {
      setShowNoResult(false);
    }
  }, [searchQuery]);

  const streamLabel = (config) => getLabelFn ? getLabelFn({ label: config.label }, lang) : config.label[lang] || config.label.en;

  return (
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
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search careers..."
                className={`pl-10 pr-4 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-64 transition-all ${
                  isSearching ? 'ring-2 ring-indigo-500' : ''
                }`}
                aria-label="Search careers"
              />
              {showNoResult && (
                <div className="absolute top-full left-0 mt-1 bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700 w-64 z-10">
                  No careers found matching &quot;{searchQuery}&quot;. Try a different term.
                </div>
              )}
            </div>
            
            {/* Tools */}
            <button className="p-2 text-gray-600 hover:text-indigo-600 transition" title="Tools">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
            
            {/* Fullscreen Toggle (if nested) */}
            <button className="p-2 text-gray-600 hover:text-indigo-600 transition" title="Toggle Fullscreen">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Content Area: Full bleed with subtle padding */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
          {/* Optional Sidebar for Filters/Legend (Collapsible) */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 transform translate-x-0 transition-transform duration-300 md:translate-x-0 z-20">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Stream Filters</h3>
              </div>
              {noStreamsSelected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700">
                  No streams selected. Select at least one to view paths.
                </div>
              )}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {STREAM_CONFIG.map((config) => (
                  <label key={config.num} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStreams.includes(config.num)}
                      onChange={(e) => toggleStream(config.num)}
                      className="rounded border-gray-300 focus:ring-indigo-500 h-4 w-4 text-indigo-600"
                      aria-label={`Toggle ${streamLabel(config)} filter`}
                    />
                    <span className="text-sm text-gray-700">{streamLabel(config)}</span>
                  </label>
                ))}
              </div>
              <button 
                onClick={() => setSelectedStreams(allStreamsSelected ? [] : [1, 2, 3, 4, 5])}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
              >
                {allStreamsSelected ? 'Clear All' : 'Select All'}
              </button>
            </div>
          </div>

          {/* FlowChart with Zero Padding in Fullscreen */}
          
            <div className="absolute inset-0 md:left-64"> {/* Offset for sidebar */}
            <FlowChart
              isFullScreen={true}
              onCloseFullScreen={onClose}
              selectedStreams={selectedStreams}
              searchQuery={searchQuery}
              active={active}
              getLabel={getLabelFn}
              lang={lang}
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
  );
};

export default FullScreenFlowChart;