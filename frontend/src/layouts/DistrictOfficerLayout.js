import React from "react";
import MLayout from "./MLayout";

const MENU = [
  { path: "/district-dashboard",  label: "Dashboard",       abbr: "DB" },
  { path: "/village-sources",     label: "Vyanzo vya Maji", abbr: "VS" },
  { path: "/village-reports",     label: "Ripoti",          abbr: "RP" },
  { path: "/village-messages",    label: "Ujumbe",          abbr: "UJ" },
];

export default function DistrictOfficerLayout({ children }) {
  return (
    <MLayout menuItems={MENU} roleLabel="Mfanyakazi wa Wilaya">
      {children}
    </MLayout>
  );
}
