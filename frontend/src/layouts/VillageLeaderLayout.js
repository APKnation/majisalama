import React from "react";
import MLayout from "./MLayout";

const MENU = [
  { path: "/village-dashboard",       label: "Dashboard",           abbr: "DB" },
  { path: "/village-sources",         label: "Vyanzo vya Maji",     abbr: "VS" },
  { path: "/village-reports",         label: "Ripoti",              abbr: "RP" },
  { path: "/village-create",          label: "Anzisha Ripoti",      abbr: "AR" },
  { path: "/village-assign",          label: "Tenga Kazi",          abbr: "TK" },
  { path: "/village-inspections",     label: "Uchunguzi / Ubora",   abbr: "UC" },
  { path: "/village-messages",        label: "Ujumbe",              abbr: "UJ" },
  { path: "/village-users",           label: "Watumishi",           abbr: "WA" },
  { path: "/village-notifications",   label: "Arifa",               abbr: "AF" },
  { path: "/village-export",          label: "Export / Ripoti",     abbr: "EX" },
  { path: "/village-settings",        label: "Mipangilio",          abbr: "MP" },
];

export default function VillageLeaderLayout({ children }) {
  return (
    <MLayout menuItems={MENU} roleLabel="Kiongozi wa Kijiji">
      {children}
    </MLayout>
  );
}