import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

/* ─── BMW M Design System Tokens ─────────────────────────────────
   canvas:        #000000
   surface-card:  #1a1a1a
   body text:     #bbbbbb
   m-blue-light:  #0066b1
   m-blue-dark:   #1c69d4
   m-red:         #e22718
   hairline:      #3c3c3c
─────────────────────────────────────────────────────────────────── */

function StatusBadge({ status, label }) {
  const map = {
    pending:     { color: "#f4b400", bg: "#2a2200", text: "Inasubiri" },
    assigned:    { color: "#0066b1", bg: "#001a2e", text: "Imepewa" },
    in_progress: { color: "#1c69d4", bg: "#001a3e", text: "Inafanywa" },
    resolved:    { color: "#0fa336", bg: "#012010", text: "Imetatuliwa" },
    closed:      { color: "#7e7e7e", bg: "#1a1a1a", text: "Imefungwa" },
  };
  const s = map[status] || { color: "#7e7e7e", bg: "#1a1a1a", text: status };
  return (
    <span style={{ display: "inline-block", padding: "4px 12px", background: s.bg, color: s.color, fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${s.color}33` }}>
      {label || s.text}
    </span>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      style={{ background: "#1a1a1a", borderTop: "1px solid #3c3c3c" }}
      className="p-7 hover:bg-[#262626] transition-colors duration-200"
    >
      <div
        className="text-2xl mb-5"
        style={{ color: "#0066b1" }}
      >
        {icon}
      </div>
      <h3 className="text-white font-bold text-[15px] uppercase tracking-[1px] mb-3">
        {title}
      </h3>
      <p style={{ color: "#bbbbbb", fontWeight: 300 }} className="text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div
      style={{ background: "#1a1a1a", borderLeft: "2px solid #0066b1" }}
      className="p-6 hover:bg-[#262626] transition-colors duration-200"
    >
      <p
        className="text-xs font-bold tracking-[2px] uppercase mb-3"
        style={{ color: "#0066b1" }}
      >
        {num}
      </p>
      <h4 className="text-white font-bold text-sm uppercase tracking-[0.5px] mb-2">
        {title}
      </h4>
      <p style={{ color: "#bbbbbb", fontWeight: 300 }} className="text-xs leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function Home() {
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      const res = await api.get('/damage-reports/recent/');
      setRecentReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: "#000000" }} className="text-white min-h-screen">

      {/* ─── M TRICOLOR STRIPE ─── */}
      <div className="m-stripe" />

      {/* ─── TOP NAV ─── */}
      <nav
        style={{ background: "#000000", borderBottom: "1px solid #3c3c3c" }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between"
          style={{ height: "64px" }}
        >
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="m-stripe" style={{ width: "32px", height: "3px" }} />
            <span
              className="text-white font-bold tracking-[2px] uppercase text-sm"
            >
              Maji Salama
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { to: "/map", label: "Ramani" },
              { to: "/report", label: "Ripoti" },
              { to: "/alerts", label: "Arifa" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{ color: "#bbbbbb", letterSpacing: "0.5px", fontSize: "14px", fontWeight: 400 }}
                className="hover:text-white transition-colors duration-150 no-underline"
              >
                {label}
              </Link>
            ))}
          </div>

          <Link to="/login" className="btn-m-outline" style={{ padding: "10px 24px", height: "40px", fontSize: "13px" }}>
            Ingia
          </Link>
        </div>
      </nav>

      {/* ─── HERO BAND ─── */}
      <section
        style={{
          background: "#000000",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          padding: "96px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle grid pattern */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="animate-fade-in-up">
              <p
                className="label-uppercase mb-6"
                style={{ color: "#0066b1" }}
              >
                Mfumo wa Kisasa wa Maji · Tanzania
              </p>

              <h1 className="display-xl text-white mb-8" style={{ maxWidth: "600px" }}>
                Maji Safi.<br />Jamii Salama.
              </h1>

              <p
                className="body-md mb-10"
                style={{ color: "#bbbbbb", maxWidth: "480px" }}
              >
                WaterTrack inakuwezesha kuona vyanzo vya maji, ripoti matatizo,
                kufuatilia kazi za matengenezo na kutoa huduma salama kwa wananchi.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/report" className="btn-m-primary">
                  Ripoti Uharibifu
                </Link>
                <Link to="/map" className="btn-m-outline">
                  Ona Ramani
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="hidden lg:flex flex-col gap-8 animate-fade-in-up delay-200">
              <div style={{ width: "100%", height: "400px", overflow: "hidden", border: "1px solid #3c3c3c", background: "#1a1a1a" }}>
                <img src="/kuchota%20maji.png" alt="Maji Salama" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(20%) contrast(120%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── M STRIPE DIVIDER ─── */}
      <div className="m-stripe" />

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: "#0d0d0d", padding: "96px 0" }}>
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-16">
            <p className="label-uppercase mb-4" style={{ color: "#0066b1" }}>
              Jinsi Inavyofanya Kazi
            </p>
            <h2 className="display-md text-white mb-4">
              Mfumo Unaoweka<br />Jamii Kwanza
            </h2>
            <p
              className="body-md"
              style={{ color: "#bbbbbb", maxWidth: "480px" }}
            >
              WaterTrack ni mfumo wa wazi ambao hutoa taarifa kwa wananchi,
              viongozi wa vijiji, wafanyakazi wa maji na wilaya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "#3c3c3c" }}>
            <StepCard
              num="01"
              title="Ripoti bila kusubiri"
              desc="Mwananchi anaweza kuripoti uharibifu au upungufu wa maji haraka kupitia ukurasa ulio wazi."
            />
            <StepCard
              num="02"
              title="Ufuatiliaji wa chanzo"
              desc="Wafanyakazi wa maji wana uangalizi wa vyanzo, matengenezo na taarifa za ubora."
            />
            <StepCard
              num="03"
              title="Taarifa kwa viongozi"
              desc="Viongozi wa vijiji na wilaya wanaweza kuona ripoti na maendeleo kwa urahisi."
            />
            <StepCard
              num="04"
              title="Jamii yenye furaha"
              desc="Mfumo unaleta huduma ya maji yenye uhakika na jamii inapata maji safi kwa wakati."
            />
          </div>
        </div>
      </section>

      {/* ─── M STRIPE DIVIDER ─── */}
      <div className="m-stripe" />

      {/* ─── RECENT REPORTS ─── */}
      <section style={{ background: "#0d0d0d", padding: "96px 0", borderTop: "1px solid #3c3c3c" }}>
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
            <div>
              <p className="label-uppercase mb-4" style={{ color: "#0066b1" }}>
                Uwazi wa Taarifa
              </p>
              <h2 className="display-md text-white">
                Ripoti za Hivi Karibuni
              </h2>
            </div>
            <Link to="/map" className="btn-m-outline">Ona Ramani</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#3c3c3c" }}>
            {recentReports.length > 0 ? recentReports.map((r) => (
              <div key={r.id} style={{ background: "#1a1a1a" }} className="p-8 hover:bg-[#262626] transition-colors duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <StatusBadge status={r.status} label={r.status_display} />
                    <span style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 300 }}>{new Date(r.report_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-white font-bold text-[16px] uppercase tracking-[0.5px] mb-3">{r.title}</h3>
                  <p style={{ color: "#bbbbbb", fontWeight: 300 }} className="text-sm line-clamp-3 mb-6">
                    {r.description}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid #3c3c3c", paddingTop: "16px" }}>
                  <p style={{ color: "#7e7e7e", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Chanzo cha Maji</p>
                  <p className="text-sm font-bold text-white">{r.water_source?.name || "Hakijulikani"}</p>
                </div>
              </div>
            )) : (
              <div style={{ background: "#1a1a1a", gridColumn: "1 / -1" }} className="p-12 text-center text-[#7e7e7e] font-light">
                Hakuna ripoti zilizotumwa hivi karibuni.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section style={{ background: "#000000", padding: "96px 0" }}>
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-16">
            <p className="label-uppercase mb-4" style={{ color: "#0066b1" }}>
              Vipengele
            </p>
            <h2 className="display-md text-white">
              Imeundwa Kwa<br />Kila Mtumiaji
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px"
            style={{ background: "#3c3c3c" }}>
            <FeatureCard
              icon="👥"
              title="Huduma kwa Watumiaji Wote"
              desc="Wananchi, viongozi, wataalam wa maji na wilaya wanaona hali ya maji kwa mtiririko mmoja."
            />
            <FeatureCard
              icon="👁"
              title="Uwazi wa Taarifa"
              desc="Kila taarifa ya chanzo, ripoti na matengenezo inapatikana kwa watoa huduma na jamii."
            />
            <FeatureCard
              icon="⚡"
              title="Uendeshaji wa Haraka"
              desc="Mfumo unaweka kipaumbele kwa ripoti na kuhakikisha kazi ya matengenezo inaanza haraka."
            />
          </div>
        </div>
      </section>

      {/* ─── M STRIPE DIVIDER ─── */}
      <div className="m-stripe" />

      {/* ─── CTA BAND ─── */}
      <section
        style={{
          background: "#000000",
          padding: "96px 0",
          borderTop: "1px solid #3c3c3c",
        }}
        className="text-center"
      >
        <div className="max-w-[800px] mx-auto px-8">
          <p className="label-uppercase mb-6" style={{ color: "#0066b1" }}>
            Anza Leo
          </p>
          <h2 className="display-lg text-white mb-8">
            Jiunge Na Jamii<br />Zinazotumia WaterTrack
          </h2>
          <p
            className="body-md mb-10 mx-auto"
            style={{ color: "#bbbbbb", maxWidth: "400px" }}
          >
            Bure kabisa. Hakuna akaunti inayohitajika kuripoti tatizo au kuona hali ya vyanzo.
          </p>
          <Link to="/register" className="btn-m-primary" style={{ fontSize: "13px" }}>
            Unda Akaunti
          </Link>
        </div>
      </section>
    </div>
  );
}
