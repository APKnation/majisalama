// frontend/src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import WaterSourceDetail from "./pages/WaterSourceDetail";
import ReportDamage from "./pages/ReportDamage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Alerts from "./pages/Alerts";
import VillageDashboard from "./pages/VillageDashboard";
import WaterOfficerDashboard from "./pages/WaterOfficerDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";

// Admin imports
import AdminDashboard from "./admin/pages/AdminDashboard";
import WaterSourcesAdmin from "./admin/pages/WaterSourcesAdmin";

// ✅ Protected Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is admin or superuser
  if (!user || (user.role !== "admin" && !user.is_superuser)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Role-based Protected Route Component
const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ✅ Public Route (redirect to role-specific dashboard)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === "admin" || user.is_superuser) {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "village_leader") {
      return <Navigate to="/village-dashboard" replace />;
    }
    if (user.role === "water_officer") {
      return <Navigate to="/water-officer-dashboard" replace />;
    }
    if (user.role === "district_officer") {
      return <Navigate to="/district-dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <Home />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <MapView />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/source/:id"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <WaterSourceDetail />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <ReportDamage />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <PublicRoute>
                <>
                  <Navbar />
                  <Alerts />
                </>
              </PublicRoute>
            }
          />

          {/* Role-based Dashboard Routes */}
          <Route
            path="/village-dashboard"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <>
                  <Navbar />
                  <VillageDashboard />
                </>
              </RoleRoute>
            }
          />
          <Route
            path="/water-officer-dashboard"
            element={
              <RoleRoute allowedRoles={["water_officer"]}>
                <>
                  <Navbar />
                  <WaterOfficerDashboard />
                </>
              </RoleRoute>
            }
          />
          <Route
            path="/district-dashboard"
            element={
              <RoleRoute allowedRoles={["district_officer"]}>
                <>
                  <Navbar />
                  <DistrictDashboard />
                </>
              </RoleRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/water-sources"
            element={
              <AdminRoute>
                <WaterSourcesAdmin />
              </AdminRoute>
            }
          />
          {/* Add more admin routes here */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
