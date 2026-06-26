import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-700 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_35%)]" />
        <div className="relative max-w-6xl mx-auto grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-4 sm:space-y-6 text-white">
           
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Pata huduma ya maji bora kwa jamii yako.
            </h1>
            <p className="max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-cyan-100/90">
              WaterTrack inakuwezesha kuona vyanzo vya maji, ripoti matatizo,
              kufuatilia kazi za matengenezo na kutoa huduma salama kwa wananchi
              bila kufunga akaunti.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/map"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 hover:bg-slate-100 transition"
              >
                Angalia Ramani
              </Link>
              <Link
                to="/report"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Ripoti Uharibifu
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <article className="overflow-hidden rounded-2xl lg:rounded-[2rem] bg-white shadow-lg sm:shadow-xl lg:shadow-2xl shadow-slate-900/10">
              <img
                src="/tank1.png"
                alt="Tanki la maji"
                className="h-64 lg:h-80 w-full object-cover"
              />
              <div className="p-6 lg:p-8">
                <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">
                  Tanki la Maji
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Chunguza miundombinu ya uhifadhi wa maji na uhakikishe jinsi
                  inavyotumika kwa usalama.
                </p>
              </div>
            </article>
          </div>
        </div>
      </header>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <article className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-slate-50 shadow-lg sm:shadow-xl shadow-slate-900/10 hover:shadow-2xl transition">
              <img
                src="/kuchota maji.png"
                alt="Wananchi wakichota maji"
                className="h-48 sm:h-56 lg:h-64 w-full object-cover"
              />
              <div className="p-5 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Wananchi wakichota maji
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Pata taarifa za upatikanaji wa maji na maeneo ya kuchota maji
                  kwa wakazi.
                </p>
              </div>
            </article>
            <article className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-slate-50 shadow-lg sm:shadow-xl shadow-slate-900/10 hover:shadow-2xl transition">
              <img
                src="/tank2.png"
                alt="Watu wakifurahia huduma ya maji"
                className="h-48 sm:h-56 lg:h-64 w-full object-cover"
              />
              <div className="p-5 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Huduma ya Kuaminika
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Onyesha jinsi mfumo unavyoboresha maisha na huduma za maji kwa
                  jamii.
                </p>
              </div>
            </article>
            <article className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] bg-slate-50 shadow-lg sm:shadow-xl shadow-slate-900/10 hover:shadow-2xl transition">
              <img
                src="/tank1.png"
                alt="Watu wakishughulikia matengenezo ya bomba"
                className="h-48 sm:h-56 lg:h-64 w-full object-cover"
              />
              <div className="p-5 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Matengenezo ya Mabomba
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Fuata kazi za matengenezo, upate taarifa za hali ya mabomba na
                  miundombinu.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-slate-500">
                Mienendo ya Mfumo
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                Mfumo unaoweka kila mtumiaji katikati
              </h2>
              <p className="text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
                WaterTrack ni mfumo wa wazi ambao hutoa taarifa kwa wananchi,
                viongozi wa vijiji, wafanyakazi wa maji na wilaya bila haja ya
                kuingia ndani ya mfumo. Inakuwezesha kuchunguza, kuripoti,
                kuchukua hatua na kufurahia huduma ya maji bora.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  1. Ripoti bila kusubiri
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Mwananchi anaweza kuripoti uharibifu au upungufu wa maji
                  haraka kupitia ukurasa ulio wazi.
                </p>
              </div>
              <div className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  2. Ufuatiliaji wa chanzo
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Wafanyakazi wa maji wana uangalizi wa vyanzo, matengenezo na
                  taarifa za ubora kutoka kwa mfumo.
                </p>
              </div>
              <div className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  3. Taarifa kwa viongozi
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Viongozi wa vijiji na wilaya wanaweza kuona ripoti, maendeleo
                  na mahitaji ya matengenezo kwa urahisi.
                </p>
              </div>
              <div className="rounded-2xl lg:rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                  4. Jamii yenye furaha
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Mfumo unaleta huduma ya maji yenye uhakika na jamii inapata
                  maji safi kwa wakati.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl lg:rounded-3xl bg-slate-800/90 p-6 sm:p-7 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Huduma kwa Watumiaji Wote
              </h3>
              <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm leading-6">
                Wananchi, viongozi, wataalam wa maji na wilaya wanaona hali ya
                maji kwa mtiririko mmoja wa taarifa.
              </p>
            </div>
            <div className="rounded-2xl lg:rounded-3xl bg-slate-800/90 p-6 sm:p-7 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Uwazi wa Taarifa
              </h3>
              <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm leading-6">
                Kila taarifa ya chanzo, ripoti na matengenezo inapatikana kwa
                watoa huduma na jamii.
              </p>
            </div>
            <div className="rounded-2xl lg:rounded-3xl bg-slate-800/90 p-6 sm:p-7 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold">
                Uendeshaji wa Haraka
              </h3>
              <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm leading-6">
                Mfumo unaweka kipaumbele kwa ripoti na kuhakikisha kazi ya
                matengenezo inaanza haraka.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
