import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ─── Spotify colour tokens as Tailwind arbitrary values ─────────────────
   #121212  page bg          → bg-[#121212]
   #181818  section dark     → bg-[#181818]
   #282828  card             → bg-[#282828]
   #3E3E3E  card hover       → hover:bg-[#3E3E3E]
   #1DB954  spotify green    → text-[#1DB954]  bg-[#1DB954]  border-[#1DB954]
   #1ed760  green hover      → hover:bg-[#1ed760]
   #B3B3B3  muted text       → text-[#B3B3B3]
──────────────────────────────────────────────────────────────────────── */

function MediaCard({ src, title, desc }) {
  return (
    <div className="bg-[#282828] hover:bg-[#3E3E3E] rounded-lg overflow-hidden cursor-pointer transition-colors duration-200 pb-4">
      <img src={src} alt={title} className="w-full h-40 object-cover block" />
      <div className="px-4 pt-3">
        <h3 className="text-sm font-bold mb-1 text-white">{title}</h3>
        <p className="text-xs text-[#B3B3B3] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="bg-[#282828] hover:bg-[#3E3E3E] rounded-lg p-5 border-l-[3px] border-[#1DB954] transition-colors duration-200">
      <p className="text-xs font-bold text-[#1DB954] tracking-widest uppercase mb-2">
        Step {num}
      </p>
      <h4 className="text-sm font-bold mb-1.5 text-white">{title}</h4>
      <p className="text-xs text-[#B3B3B3] leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#121212] text-white min-h-screen font-sans">
      {/* ── HERO ── */}
      <header
        className="relative overflow-hidden px-8 pt-14 pb-16"
        style={{
          background: "linear-gradient(180deg, #1a3a1a 0%, #121212 100%)",
        }}
      >
        {/* ambient glow blob */}
        <div
          className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#1DB954] rounded-full opacity-[0.08] pointer-events-none"
          style={{ filter: "blur(60px)" }}
        />

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* left: copy */}
          <div>
            {/* live badge */}
            

            <h1 className="text-4xl lg:text-[42px] font-black leading-[1.1] tracking-tight mb-5">
              Pata huduma ya maji bora kwa{" "}
              <span className="text-[#1DB954]">jamii yako.</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-[#B3B3B3] mb-8 max-w-md">
              WaterTrack inakuwezesha kuona vyanzo vya maji, ripoti matatizo,
              kufuatilia kazi za matengenezo na kutoa huduma salama kwa wananchi
              bila kufunga akaunti.
            </p>

            <div className="flex flex-wrap gap-3">
             
              <Link
                to="/report"
                className="bg-transparent hover:bg-white/5 text-white font-bold text-sm tracking-wider uppercase rounded-full px-8 py-3.5 border border-white/30 hover:border-white transition-all duration-150"
              >
                Ripoti Uharibifu
              </Link>
            </div>
          </div>

          {/* right: card — hidden on mobile */}
          <div className="hidden lg:block bg-[#282828] rounded-xl overflow-hidden">
            <img
              src="/tank1.png"
              alt="Tanki la maji"
              className="w-full h-56 object-cover block"
            />
            <div className="p-5">
             
              <p className="text-sm text-[#B3B3B3] leading-relaxed">
                Chunguza miundombinu ya uhifadhi wa maji na uhakikishe jinsi
                inavyotumika kwa usalama.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── MEDIA CARDS ── */}
      <section className="px-8 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MediaCard
            src="/kuchota maji.png"
            title="Wananchi wakichota maji"
            desc="Pata taarifa za upatikanaji wa maji na maeneo ya kuchota maji kwa wakazi."
          />
          <MediaCard
            src="/tank2.png"
            title="Huduma ya Kuaminika"
            desc="Onyesha jinsi mfumo unavyoboresha maisha na huduma za maji kwa jamii."
          />
          <MediaCard
            src="/tank1.png"
            title="Matengenezo ya Mabomba"
            desc="Fuata kazi za matengenezo, upate taarifa za hali ya mabomba na miundombinu."
          />
        </div>
      </section>

      <hr className="border-none border-t border-white/[0.07] mx-8" />

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#181818]">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#1DB954] mb-3">
            Mienendo ya Mfumo
          </p>
          <h2 className="text-3xl lg:text-[32px] font-black tracking-tight mb-3">
            Mfumo unaoweka kila mtumiaji katikati
          </h2>
          <p className="text-[15px] text-[#B3B3B3] leading-relaxed mb-9 max-w-md">
            WaterTrack ni mfumo wa wazi ambao hutoa taarifa kwa wananchi,
            viongozi wa vijiji, wafanyakazi wa maji na wilaya bila haja ya
            kuingia ndani ya mfumo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StepCard
              num="01"
              title="Ripoti bila kusubiri"
              desc="Mwananchi anaweza kuripoti uharibifu au upungufu wa maji haraka kupitia ukurasa ulio wazi."
            />
            <StepCard
              num="02"
              title="Ufuatiliaji wa chanzo"
              desc="Wafanyakazi wa maji wana uangalizi wa vyanzo, matengenezo na taarifa za ubora kutoka kwa mfumo."
            />
            <StepCard
              num="03"
              title="Taarifa kwa viongozi"
              desc="Viongozi wa vijiji na wilaya wanaweza kuona ripoti, maendeleo na mahitaji ya matengenezo kwa urahisi."
            />
            <StepCard
              num="04"
              title="Jamii yenye furaha"
              desc="Mfumo unaleta huduma ya maji yenye uhakika na jamii inapata maji safi kwa wakati."
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5">
            {[
              {
                icon: "👥",
                title: "Huduma kwa Watumiaji Wote",
                desc: "Wananchi, viongozi, wataalam wa maji na wilaya wanaona hali ya maji kwa mtiririko mmoja wa taarifa.",
              },
              {
                icon: "👁",
                title: "Uwazi wa Taarifa",
                desc: "Kila taarifa ya chanzo, ripoti na matengenezo inapatikana kwa watoa huduma na jamii.",
              },
              {
                icon: "⚡",
                title: "Uendeshaji wa Haraka",
                desc: "Mfumo unaweka kipaumbele kwa ripoti na kuhakikisha kazi ya matengenezo inaanza haraka.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`bg-[#282828] p-7 ${
                  i === 0 ? "rounded-l-lg" : i === 2 ? "rounded-r-lg" : ""
                }`}
              >
                <div className="w-10 h-10 bg-[#1DB954]/15 rounded-full flex items-center justify-center text-lg mb-4">
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[#B3B3B3] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1DB954] px-8 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black text-black tracking-tight mb-3">
            Anza leo. Bure.
          </h2>
          <p className="text-[15px] text-black/60 mb-7">
            Jiunge na jamii zinazotumia WaterTrack kufuatilia na kuboresha
            huduma ya maji.
          </p>
          <Link
            to="/report"
            className="bg-black hover:bg-[#1a1a1a] text-white font-bold text-sm tracking-widest uppercase rounded-full px-10 py-4 inline-block transition-all duration-150 hover:scale-105"
          >
            Anza Sasa
          </Link>
        </div>
      </section>
    </div>
  );
}
