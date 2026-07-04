import React from "react";

export default function VillageSettings() {
  return (
    <div style={{ background: "#000000", minHeight: "100vh", color: "#ffffff" }}>
      <div className="m-stripe" />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Akaunti</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Mipangilio</h1>
        <p style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>Badilisha wasifu na mapendeleo ya arifa.</p>
        <div style={{ border: "1px solid #3c3c3c", padding: "48px", textAlign: "center", color: "#7e7e7e", fontWeight: 300 }}>
          Sehemu hii inajengwa.
        </div>
      </div>
    </div>
  );
}
