import React from "react";
import MLayout from "./MLayout";

const MENU = [
  { path: "/water-officer-dashboard", label: "Dashboard",           abbr: "DB" },
  { path: "/water-officer-reports",   label: "Ripoti Zangu",        abbr: "RP" },
  { path: "/water-officer-sources",   label: "Vyanzo Vilivyopewa",  abbr: "VS" },
];

export default function WaterOfficerLayout({ children }) {
  return (
    <MLayout menuItems={MENU} roleLabel="Mfanyakazi wa Maji">
      {children}
    </MLayout>
  );
}
