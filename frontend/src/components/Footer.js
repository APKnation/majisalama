import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: "#000000", borderTop: "1px solid #3c3c3c" }}>
      {/* ─── M TRICOLOR STRIPE ─── */}
      <div className="m-stripe" />

      <div className="max-w-[1440px] mx-auto px-8 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12"
          style={{ borderBottom: "1px solid #3c3c3c" }}>

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="m-stripe" style={{ width: "32px", height: "3px" }} />
              <span className="font-bold text-white tracking-[2px] uppercase text-sm">
                Maji Salama
              </span>
            </div>
            <p style={{ color: "#bbbbbb", fontWeight: 300, fontSize: "14px", lineHeight: "1.6" }}>
              Kutoa suluhisho la uhakika la kufuatilia na kusimamia maji
              kwa jamii. Kuhakikisha kila mtu anapata maji safi na salama.
            </p>
          </div>

          {/* Nav columns */}
          {[
            {
              heading: "Viungo vya Haraka",
              links: [
                { to: "/", label: "Mwanzo" },
                { to: "/report", label: "Ripoti Tatizo" },
                { to: "/dashboard", label: "Dashibodi" },
              ],
            },
            {
              heading: "Rasilimali",
              links: [
                { to: "/alerts", label: "Arifa" },
                { to: "/login", label: "Wafanyakazi" },
                { to: "#", label: "Nyaraka" },
                { to: "#", label: "Sera ya Faragha" },
              ],
            },
            {
              heading: "Wasiliana Nasi",
              links: null,
              contact: true,
            },
          ].map(({ heading, links, contact }) => (
            <div key={heading}>
              <p
                className="mb-5"
                style={{
                  color: "#7e7e7e",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                {heading}
              </p>

              {links && (
                <ul className="space-y-3">
                  {links.map(({ to, label }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        style={{
                          color: "#bbbbbb",
                          fontSize: "14px",
                          fontWeight: 300,
                          textDecoration: "none",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                        onMouseLeave={(e) => (e.target.style.color = "#bbbbbb")}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {contact && (
                <ul className="space-y-3">
                  <li style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
                    support@majisalama.com
                  </li>
                  <li style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
                    +255 (0) 123 456 789
                  </li>
                  <li style={{ color: "#bbbbbb", fontSize: "14px", fontWeight: 300 }}>
                    Dar es Salaam, Tanzania
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p style={{ color: "#7e7e7e", fontSize: "12px", fontWeight: 400, letterSpacing: "0.5px" }}>
            &copy; {new Date().getFullYear()} Maji Salama. Haki zote zimehifadhiwa.
          </p>

          <div className="flex items-center gap-6">
            {/* Social icons */}
            {[
              {
                label: "Facebook",
                path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                rule: "evenodd",
              },
              {
                label: "Twitter",
                path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
              },
            ].map(({ label, path, rule }) => (
              <a
                key={label}
                href="#"
                style={{ color: "#7e7e7e", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7e7e")}
                aria-label={label}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {rule
                    ? <path fillRule="evenodd" d={path} clipRule="evenodd" />
                    : <path d={path} />}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
