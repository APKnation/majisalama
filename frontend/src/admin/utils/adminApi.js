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

// Quality Reports
export const getAllQualityReports = () => api.get("/quality-reports/");
export const createQualityReport = (data) =>
  api.post("/quality-reports/", data);

// Users
export const getAllUsers = () => api.get("/auth/user/"); // Au custom endpoint

// Villages
export const getAllVillages = () => api.get("/villages/");
export const createVillage = (data) => api.post("/villages/", data);

// Stats
export const getDashboardStats = () => api.get("/water-sources/"); // We'll calculate from this
