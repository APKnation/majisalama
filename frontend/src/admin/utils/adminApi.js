// src/admin/utils/adminApi.js

import api from "../../utils/api";

// Water Sources
export const getAllWaterSources = () => api.get("/water-sources/");
export const createWaterSource = (data) => api.post("/water-sources/", data);
export const updateWaterSource = (id, data) =>
  api.patch(`/water-sources/${id}/`, data);
export const deleteWaterSource = (id) => api.delete(`/water-sources/${id}/`);

// Damage Reports
export const getAllDamageReports = () => api.get("/damage-reports/");
export const updateDamageReport = (id, data) =>
  api.patch(`/damage-reports/${id}/`, data);
export const assignDamageReport = (id, data) =>
  api.post(`/damage-reports/${id}/assign/`, data);
export const resolveDamageReport = (id, data) =>
  api.post(`/damage-reports/${id}/resolve/`, data);

// Quality Reports
export const getAllQualityReports = () => api.get("/quality-reports/");
export const createQualityReport = (data) =>
  api.post("/quality-reports/", data);

// Alerts
export const getAllAlerts = () => api.get("/alerts/");
export const createAlert = (data) => api.post("/alerts/", data);

// Users
export const getAllUsers = () => api.get("/users/");
export const createUser = (data) => api.post("/users/", data);
export const updateUser = (id, data) => api.patch(`/users/${id}/`, data);
export const deleteUser = (id) => api.delete(`/users/${id}/`);

// Villages
export const getAllVillages = () => api.get("/villages/");
export const createVillage = (data) => api.post("/villages/", data);
export const updateVillage = (id, data) => api.patch(`/villages/${id}/`, data);
export const deleteVillage = (id) => api.delete(`/villages/${id}/`);

// Stats
export const getDashboardStats = () => api.get("/water-sources/"); // We'll calculate from this
