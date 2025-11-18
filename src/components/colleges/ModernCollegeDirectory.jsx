// src/components/ModernCollegeDirectory.jsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Search,
  MapPin,
  Star,
  Users,
  IndianRupee,
  GraduationCap,
  Award,
  Loader2,
  SlidersHorizontal,
  X,
  Heart,
} from "lucide-react";

import debounce from "lodash.debounce";

// -------------------------------
// API CONFIG
// -------------------------------
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// -------------------------------
const INTEREST_BUFFER_KEY = "apnidisha_interest_buffer_v1";

// -------------------------------
const ModernCollegeDirectory = () => {
  const location = useLocation();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    type: "",
    course: "",
    rating: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const isSyncingRef = useRef(false);

  // -------------------------------
  // BUFFER HELPERS
  // -------------------------------
  const readInterestBuffer = () => {
    try {
      const raw = localStorage.getItem(INTEREST_BUFFER_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Failed to read interest buffer:", e);
      return {};
    }
  };

  const writeInterestBuffer = (buffer) => {
    try {
      localStorage.setItem(INTEREST_BUFFER_KEY, JSON.stringify(buffer));
    } catch (e) {
      console.warn("Failed to write interest buffer:", e);
    }
  };

  // Attempt to send buffer using sendBeacon, otherwise fallback to fetch keepalive
  const sendBufferedInterest = (buffer) => {
    if (!buffer || Object.keys(buffer).length === 0) return false;

    const url = "http://127.0.0.1:5000/api/colleges/interest-batch";
    const body = JSON.stringify({ interest: buffer });

    // Try sendBeacon first (best for unload/route-leave)
    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: "application/json" });
        const ok = navigator.sendBeacon(url, blob);
        console.log("sendBeacon result:", ok);
        return ok;
      } catch (e) {
        console.warn("sendBeacon failed, falling back to fetch:", e);
      }
    }

    // Fallback: fetch with keepalive (supported in modern browsers)
    try {
      // Use navigator.fetch if available to be explicit, otherwise global fetch
      const fetchFn = (typeof navigator !== "undefined" && navigator.fetch) || fetch;
      fetchFn(url, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        mode: "cors",
      }).then(() => {
        console.log("fetch keepalive sent");
      }).catch((err) => {
        console.warn("fetch keepalive error:", err);
      });
      return true;
    } catch (e) {
      console.warn("No sendBeacon/fetch keepalive available:", e);
      return false;
    }
  };

  // -------------------------------
  // SYNC BUFFER (regular axios call)
  // Called on mount to flush any previous buffer when page loads
  // -------------------------------
  const syncInterestBuffer = async () => {
    if (isSyncingRef.current) return;
    const buffer = readInterestBuffer();
    if (!buffer || Object.keys(buffer).length === 0) return;

    isSyncingRef.current = true;
    try {
      console.log("🔄 Syncing interest via axios (mount flush):", buffer);
      await API.post("/colleges/interest-batch", { interest: buffer });
      localStorage.removeItem(INTEREST_BUFFER_KEY);
      console.log("✅ Interest flushed to server.");
    } catch (err) {
      console.error("Interest flush failed:", err);
    }
    isSyncingRef.current = false;
  };

  // -------------------------------
  // FETCH COLLEGES (with search + filters)
  // -------------------------------
  const fetchColleges = async (search = searchTerm, appliedFilters = filters) => {
    try {
      setLoading(true);
      const params = { search, ...appliedFilters, limit: 50 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const res = await API.get("/colleges", { params });
      const data = res.data?.data || res.data?.colleges || [];

      console.log("📥 DATA RECEIVED FROM BACKEND:", data);

      const totalInt =
        res.data?.totalInterest ?? data.reduce((sum, c) => sum + (c.interest || 0), 0);

      setColleges(data);
      setTotalResults(res.data?.total || data.length);
      setTotalInterest(totalInt);
    } catch (err) {
      console.error("Backend down, cannot fetch colleges.", err);
      setColleges([]);
      setTotalResults(0);
      setTotalInterest(0);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((value, currentFilters) => {
      fetchColleges(value, currentFilters);
    }, 400)
  ).current;

  // -------------------------------
  // INIT (no periodic timer)
  // - flush any buffer from previous sessions
  // - load colleges
  // -------------------------------
  useEffect(() => {
    (async () => {
      await syncInterestBuffer();
      await fetchColleges();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------
  // INTEREST CLICK
  // Buffer click locally only (no UI counter change)
  // -------------------------------
  const handleViewDetails = (id) => {
    const buffer = readInterestBuffer();
    buffer[id] = (buffer[id] || 0) + 1;
    writeInterestBuffer(buffer);
    console.log("❤️ Stored interest in buffer:", buffer);

    // You can navigate to details page here if desired
    // navigate(`/colleges/${id}`)
  };

  // -------------------------------
  const computeInterestPercent = (val) =>
    totalInterest > 0 ? `${Math.round((val / totalInterest) * 100)}%` : "0%";

  // -------------------------------
  // SYNC ON ROUTE CHANGE (user leaves the route)
  // Use sendBeacon or fallback fetch keepalive
  // -------------------------------
  useEffect(() => {
    return () => {
      const buffer = readInterestBuffer();
      if (buffer && Object.keys(buffer).length > 0) {
        console.log("📤 Syncing via sendBeacon on route LEAVE:", buffer);
        const sent = sendBufferedInterest(buffer);
        if (sent) {
          localStorage.removeItem(INTEREST_BUFFER_KEY);
        } else {
          console.warn("Buffered interest not sent on route leave; it will remain for next session.");
        }
      }
    };
  }, [location.pathname]);

  // -------------------------------
  // SYNC ON TAB CLOSE / REFRESH
  // -------------------------------
  useEffect(() => {
    const handleUnload = (e) => {
      const buffer = readInterestBuffer();
      if (buffer && Object.keys(buffer).length > 0) {
        console.log("📤 Syncing via sendBeacon on TAB CLOSE:", buffer);
        const sent = sendBufferedInterest(buffer);
        if (sent) {
          localStorage.removeItem(INTEREST_BUFFER_KEY);
        } else {
          console.warn("Buffered interest not sent on unload; it will remain for next session.");
        }
      }
      // no need to prevent unload; just attempt to send
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold">College Directory</h1>
          <p className="text-gray-600">Discover top colleges across India</p>

          <div className="flex justify-center gap-8 text-sm mt-4">
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
              100+ Programs
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Verified Reviews
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Tracking interest across <span className="font-semibold">{totalResults}</span> colleges
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-7">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    debouncedFetch(value, filters);
                  }}
                  className="pl-10 h-12"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-12"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* FILTER PANEL */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                {/* STATE */}
                <Select
                  value={filters.state || "all"}
                  onValueChange={(v) => {
                    const next = { ...filters, state: v === "all" ? "" : v };
                    setFilters(next);
                    debouncedFetch(searchTerm, next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>

                {/* TYPE */}
                <Select
                  value={filters.type || "all"}
                  onValueChange={(v) => {
                    const next = { ...filters, type: v === "all" ? "" : v };
                    setFilters(next);
                    debouncedFetch(searchTerm, next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="deemed">Deemed University</SelectItem>
                  </SelectContent>
                </Select>

                {/* COURSE */}
                <Select
                  value={filters.course || "all"}
                  onValueChange={(v) => {
                    const next = { ...filters, course: v === "all" ? "" : v };
                    setFilters(next);
                    debouncedFetch(searchTerm, next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                  </SelectContent>
                </Select>

                {/* RATING */}
                <Select
                  value={filters.rating || "all"}
                  onValueChange={(v) => {
                    const next = { ...filters, rating: v === "all" ? "" : v };
                    setFilters(next);
                    debouncedFetch(searchTerm, next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                {/* CLEAR FILTERS */}
                <div className="col-span-full flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const reset = { state: "", type: "", course: "", rating: "" };
                      setFilters(reset);
                      setSearchTerm("");
                      fetchColleges("", reset);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GRID */}
        {loading ? (
          <div className="min-h-[200px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const val = college.interest || 0;
              const pct = computeInterestPercent(val);

              return (
                <Card
                  key={college._id}
                  className="border-0 shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={college.image || "https://via.placeholder.com/600x300?text=College"}
                      alt={college.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />

                    {/* INTEREST BADGE */}
                    <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2 text-xs">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Interested</span>
                      <Badge className="bg-blue-600 text-white text-[10px]">{pct}</Badge>
                    </div>

                    {college.type && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 text-gray-900">{college.type}</Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-2">{college.name}</CardTitle>

                    <div className="flex justify-end mt-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {college.rating ?? "-"}
                    </div>
                  </CardHeader>

                  <CardContent className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {college.location || college.city || "Location N/A"}
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      {college.studentsCount ? `${college.studentsCount} students` : "Students: N/A"}
                    </div>

                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                      ₹{college.averageFee ? college.averageFee.toLocaleString() : "0"} per year
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-3" onClick={() => handleViewDetails(college._id)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCollegeDirectory;
