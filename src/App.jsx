// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import ModernLayout from "./components/layout/ModernLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";

import LandingPage from "./components/LandingPage";
import QuizPage from "./components/quiz/QuizPage";
import QuizResults from "./components/quiz/QuizResults";
import QuizList from "./components/quiz/QuizList";

import ModernRecommendationsPage from "./components/recommendations/ModernRecommendationsPage";
import ModernCollegeDirectory from "./components/colleges/ModernCollegeDirectory";
import CollegeDetail from "./components/colleges/CollegeDetail";
import ModernTimelineTracker from "./components/timeline/ModernTimelineTracker";
import ModernContentHub from "./components/content/ModernContentHub";
import ContentDetail from "./components/content/ContentDetail";
import CareerGraphPage from "./components/career/CareerGraphPage";
import BookmarksPage from "./components/bookmarks/BookmarksPage";
import ModernProfilePage from "./components/profile/ModernProfilePage";
import SimulatorPage from "./components/simulator/SimulatorPage";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminColleges from "./components/admin/AdminColleges";
import AdminPrograms from "./components/admin/AdminPrograms";
import AdminTimeline from "./components/admin/AdminTimeline";
import AdminContent from "./components/admin/AdminContent";
import AdminCareerGraph from "./components/admin/AdminCareerGraph";
import AdminAnalytics from "./components/admin/AdminAnalytics";

import { LanguageProvider } from "./components/context/LanguageContext";
import ClerkProtectedRoute from "./components/auth/ClerkProtectedRoute";

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Go Home
      </Link>
    </div>
  </div>
);

// ---------------- PUBLIC ROUTES ----------------
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/colleges",
  "/colleges/:id",
  "/quiz",
];

// Utility: Check if route is public
function isPublicRoute(path) {
  return PUBLIC_ROUTES.includes(path) || PUBLIC_ROUTES.some((p) => p.includes(":"));
}

// ---------------- ROUTER ----------------
const appRouter = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },

  // Public Landing Page
  {
    path: "/",
    element: (
      <ModernLayout>
        <LandingPage />
      </ModernLayout>
    ),
  },

  // PUBLIC — College pages
  {
    path: "/colleges",
    element: (
      <ModernLayout>
        <ModernCollegeDirectory />
      </ModernLayout>
    ),
  },
  {
    path: "/colleges/:id",
    element: (
      <ModernLayout>
        <CollegeDetail />
      </ModernLayout>
    ),
  },

  // PUBLIC — Quiz pages
  {
    path: "/quiz",
    element: (
      <ModernLayout>
        <QuizList />
      </ModernLayout>
    ),
  },
  {
    path: "/quiz/:id",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
        <QuizPage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/quiz/results/:attemptId",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
        <QuizResults />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  // ------------ PROTECTED ROUTES -------------
  {
    path: "/profile",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <ModernProfilePage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/simulator",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <SimulatorPage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/recommendations",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <ModernRecommendationsPage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/timeline",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <ModernTimelineTracker />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/content",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <ModernContentHub />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/content/:id",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <ContentDetail />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/career-graph",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <CareerGraphPage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  {
    path: "/bookmarks",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <BookmarksPage />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  // Admin Routes (still protected)
  {
    path: "/admin",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminDashboard />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminUsers />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/colleges",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminColleges />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/programs",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminPrograms />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/timeline",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminTimeline />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/content",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminContent />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/career-graph",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminCareerGraph />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <ModernLayout>
        <ClerkProtectedRoute>
          <AdminAnalytics />
        </ClerkProtectedRoute>
      </ModernLayout>
    ),
  },

  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={appRouter} />
    </LanguageProvider>
  );
}

export default App;
