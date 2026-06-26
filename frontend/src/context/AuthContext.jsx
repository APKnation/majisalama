// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

const getRedirectPath = (userData) => {
    if (!userData) return "/login";
    if (userData.role === "admin" || userData.is_superuser) return "/admin";
    if (userData.role === "village_leader") return "/village-dashboard";
    if (userData.role === "water_officer") return "/water-officer-dashboard";
    if (userData.role === "district_officer") return "/district-dashboard";
    return "/";
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/user/");
      setUser(response.data);
    } catch (error) {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login/", { username, password });
      console.log("Login response:", response.data);

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const userData = response.data.user;
      setUser(userData);

      const redirectPath = getRedirectPath(userData);
      navigate(redirectPath);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  const register = async (userData) => {
    const response = await api.post("/auth/registration/", userData);
    return response.data;
  };

  const isAdmin = () => {
    return user?.role === "admin" || user?.is_superuser === true;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loading, isAdmin, getRedirectPath }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
