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
import VillageLeaderLayout from "./layouts/VillageLeaderLayout";
import DistrictOfficerLayout from "./layouts/DistrictOfficerLayout";
import WaterOfficerLayout from "./layouts/WaterOfficerLayout";
import VillageSources from "./pages/VillageSources";
import VillageReports from "./pages/VillageReports";
import CreateReport from "./pages/CreateReport";
import AssignTasks from "./pages/AssignTasks";
import Inspections from "./pages/Inspections";
import Messages from "./pages/Messages";
import VillageUsers from "./pages/VillageUsers";
import Notifications from "./pages/Notifications";
import ExportReports from "./pages/ExportReports";
import VillageSettings from "./pages/VillageSettings";
import WaterOfficerDashboard from "./pages/WaterOfficerDashboard";
import WaterOfficerReports from "./pages/WaterOfficerReports";
import WaterOfficerSources from "./pages/WaterOfficerSources";
import DistrictDashboard from "./pages/DistrictDashboard";

// Admin imports
import AdminDashboard from "./admin/pages/AdminDashboard";
import WaterSourcesAdmin from "./admin/pages/WaterSourcesAdmin";
import UsersAdmin from "./admin/pages/UsersAdmin";
import VillagesAdmin from "./admin/pages/VillagesAdmin";
import DamageReportsAdmin from "./admin/pages/DamageReportsAdmin";
import QualityReportsAdmin from "./admin/pages/QualityReportsAdmin";
import AlertsAdmin from "./admin/pages/AlertsAdmin";

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
                <VillageLeaderLayout>
                  <VillageDashboard />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-sources"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <VillageSources />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-reports"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <VillageReports />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-create"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <CreateReport />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-assign"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <AssignTasks />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-inspections"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <Inspections />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-messages"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <Messages />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-users"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <VillageUsers />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-notifications"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <Notifications />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-export"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <ExportReports />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/village-settings"
            element={
              <RoleRoute allowedRoles={["village_leader"]}>
                <VillageLeaderLayout>
                  <VillageSettings />
                </VillageLeaderLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/water-officer-dashboard"
            element={
              <RoleRoute allowedRoles={["water_officer"]}>
                <WaterOfficerLayout>
                  <WaterOfficerDashboard />
                </WaterOfficerLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/water-officer-reports"
            element={
              <RoleRoute allowedRoles={["water_officer"]}>
                <WaterOfficerLayout>
                  <WaterOfficerReports />
                </WaterOfficerLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/water-officer-sources"
            element={
              <RoleRoute allowedRoles={["water_officer"]}>
                <WaterOfficerLayout>
                  <WaterOfficerSources />
                </WaterOfficerLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/district-dashboard"
            element={
              <RoleRoute allowedRoles={["district_officer"]}>
                <DistrictOfficerLayout>
                  <DistrictDashboard />
                </DistrictOfficerLayout>
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
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <DamageReportsAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quality"
            element={
              <AdminRoute>
                <QualityReportsAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/villages"
            element={
              <AdminRoute>
                <VillagesAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/alerts"
            element={
              <AdminRoute>
                <AlertsAdmin />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
