import React from "react";
import MLayout from "./MLayout";

const MENU = [
  { path: "/district-dashboard", label: "Dashboard",         abbr: "DB" },
  { path: "/district-reports",   label: "Ripoti za Wilaya",  abbr: "RW" },
  { path: "/district-assign",    label: "Tenga Kazi",        abbr: "TK" },
  { path: "/district-messages",  label: "Ujumbe",            abbr: "UJ" },
];

export default function DistrictOfficerLayout({ children }) {
  return (
    <MLayout menuItems={MENU} roleLabel="Mfanyakazi wa Wilaya">
      {children}
    </MLayout>
  );
}
