// src/components/ModernNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import NotificationCenter from "../notifications/NotificationCenter";
import logo from "./image.jpeg";

import {
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  FileText,
  Target,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

// ⭐ Clerk Authentication
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";

// ---------------------------------

const NAV_ITEMS = [
  { key: "quiz", href: "/quiz", title: "Quizzes", icon: BookOpen },
  { key: "recommendations", href: "/recommendations", title: "Recommendations", icon: GraduationCap },
  { key: "colleges", href: "/colleges", title: "Colleges", icon: Users },
  { key: "timeline", href: "/timeline", title: "Timeline", icon: Calendar },
  { key: "content", href: "/content", title: "Study Content", icon: FileText },
  { key: "dishalab", href: "/simulator", title: "Disha Lab", icon: Target },
];

const ModernNavbar = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [openExplore, setOpenExplore] = useState(false);
  const [unreadCount] = useState(0);

  const exploreRef = useRef(null);
  const hoverTimer = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setOpenExplore(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "ur", label: "اردو" },
    { code: "dogri", label: "डोगरी" },
    { code: "gojri", label: "گوجری" },
    { code: "pahari", label: "पहाड़ी" },
    { code: "mi", label: "मराठी" },
  ];

  const openExploreDelayed = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenExplore(true), 80);
  };

  const closeExploreDelayed = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenExplore(false), 120);
  };

  return (
    <nav className="bg-white/85 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ApniDisha" className="h-9 w-auto rounded-md shadow-sm" />
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">ApniDisha</div>
              <div className="text-xs text-gray-500 -mt-1">Career & Education Advisor</div>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Explore */}
            <div
              ref={exploreRef}
              className="relative"
              onMouseEnter={openExploreDelayed}
              onMouseLeave={closeExploreDelayed}
            >
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50">
                <span className="hidden sm:block text-sm font-medium">Explore</span>
                <ChevronDown className={`h-4 w-4 transition ${openExplore ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openExplore && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-[520px] rounded-xl bg-white/90 backdrop-blur-md shadow-lg z-50"
                  >
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.key}
                            to={item.href}
                            onClick={() => setOpenExplore(false)}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-indigo-50"
                          >
                            <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-sm font-medium">{item.title}</div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" onClick={() => setIsNotifOpen((s) => !s)}>
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* ⭐ Clerk Auth */}
            <ClerkLoaded>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="px-3 py-2 border text-sm">Sign In</Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                      userProfileUrl="/profile"
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
              </SignedIn>

            </ClerkLoaded>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="hidden md:block border rounded px-2 py-1 text-sm bg-white"
            >
              {languages.map((lng) => (
                <option key={lng.code} value={lng.code}>{lng.label}</option>
              ))}
            </select>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen((s) => !s)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white/95 border-t"
            >
              <div className="space-y-2 p-4">

                {/* Auth for Mobile */}
                <ClerkLoaded>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button className="w-full border py-2">Sign In</Button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <Button className="w-full py-2 bg-indigo-600 text-white">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                      userProfileUrl="/profile"
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </SignedIn>
                </ClerkLoaded>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      </div>
    </nav>
  );
};

export default ModernNavbar;
