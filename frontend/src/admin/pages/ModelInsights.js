import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../../utils/api";

function ScoreCard({ title, value, accent, sub }) {
  return (
    <div style={{ background: "#0d0d0d", borderTop: `2px solid ${accent}`, padding: "24px" }}>
      <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>
        {title}
      </p>
      <p style={{ color: "#ffffff", fontSize: "40px", fontWeight: 700, lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ color: "#7e7e7e", fontSize: "12px", marginTop: "8px", fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}

function BarChart({ data, color, unit = "" }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.map((item, i) => {
        const width = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "#bbbbbb", fontSize: "12px", fontWeight: 400 }}>{item.label}</span>
              <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700 }}>{item.value}{unit}</span>
            </div>
            <div style={{ background: "#1a1a1a", height: "8px", width: "100%" }}>
              <div style={{ background: color, height: "100%", width: `${width}%`, transition: "width 0.5s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ModelInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await api.get("/model-insights/");
      setInsights(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <div style={{ color: "#7e7e7e", fontSize: "14px" }}>Inapakia data ya mfanyakazi...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ background: "#2e0800", border: "1px solid #f4b400", padding: "24px", color: "#ffffff" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Hitilafu:</p>
          <p style={{ fontSize: "13px", color: "#bbbbbb" }}>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const r2 = insights?.r2_score || 0;
  const r2Percent = (r2 * 100).toFixed(1);
  const r2Color = r2 >= 0.8 ? "#0fa336" : r2 >= 0.5 ? "#f4b400" : "#ffffff";

  const featureImportances = (insights?.feature_importances || []).map(f => ({
    label: f.feature,
    value: parseFloat(f.importance)
  }));

  const topFeatures = featureImportances.slice(0, 10);

  const samplePredictions = insights?.sample_predictions || [];
  const predData = samplePredictions.map(p => ({
    label: "",
    value: parseFloat(p.actual)
  }));
  const predPredictedData = samplePredictions.map(p => ({
    label: "",
    value: parseFloat(p.predicted)
  }));

  return (
    <AdminLayout>
      <div style={{ marginBottom: "40px" }} className="animate-fade-in-up">
        <p style={{ color: "#0066b1", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>
          AI & Machine Learning
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.05 }}>
          Ufahamu wa Mfanyakazi
        </h1>
        <p style={{ color: "#7e7e7e", fontSize: "13px", marginTop: "8px", fontWeight: 300 }}>
          Maonyesho ya mfanyabiashara wa akili bandia (Random Forest) kwa u demanda wa maji.
        </p>
      </div>

      {/* ─── SCORE CARDS ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#3c3c3c", marginBottom: "40px" }}>
        <ScoreCard title="R² Score" value={`${r2Percent}%`} accent={r2Color} sub="Ufanisi wa mfanyakazi" />
        <ScoreCard title="MAE" value={insights?.error_stats?.mae || 0} accent="#0066b1" sub="Kosa la wastani" />
        <ScoreCard title="RMSE" value={insights?.error_stats?.rmse || 0} accent="#1c69d4" sub="Kosa la mizizi" />
        <ScoreCard title="Samples" value={insights?.model_metadata?.training_samples || 0} accent="#0fa336" sub="Data ya mafunzo" />
      </section>

      {/* ─── MODEL METADATA ─── */}
      <section style={{ marginBottom: "40px", background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "24px" }} className="animate-fade-in-up delay-100">
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
          Maelezo ya Mfanyabiashara
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Aina", value: insights?.model_metadata?.model_type || "—" },
            { label: "Mizeituni", value: insights?.model_metadata?.n_estimators || "—" },
            { label: "Kina", value: insights?.model_metadata?.max_depth || "—" },
            { label: "Sampuli", value: insights?.model_metadata?.training_samples || "—" },
          ].map((item, i) => (
            <div key={i}>
              <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 400 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURE IMPORTANCES ─── */}
      <section style={{ marginBottom: "40px" }} className="animate-fade-in-up delay-200">
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
          Umuhimu wa Sifa (Top 10)
        </p>
        <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "24px" }}>
          <BarChart data={topFeatures} color="#0066b1" />
        </div>
      </section>

      {/* ─── ACTUAL VS PREDICTED ─── */}
      <section style={{ marginBottom: "40px" }} className="animate-fade-in-up delay-300">
        <p style={{ color: "#7e7e7e", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
          Halisi vs. Ubashiri (Sampuli 50)
        </p>
        <div style={{ background: "#0d0d0d", border: "1px solid #3c3c3c", padding: "24px", overflowX: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {samplePredictions.map((p, i) => {
              const actual = parseFloat(p.actual);
              const predicted = parseFloat(p.predicted);
              const maxVal = Math.max(actual, predicted, 1);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "#7e7e7e", fontSize: "10px", width: "20px", textAlign: "right" }}>{i + 1}</span>
                  <div style={{ flex: 1, position: "relative", height: "16px" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "#262626", width: `${(actual / maxVal) * 100}%` }} title={`Halisi: ${actual}`} />
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "#0066b1", width: `${(predicted / maxVal) * 100}%`, opacity: 0.7 }} title={`Ubashiri: ${predicted}`} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#262626" }} />
              <span style={{ color: "#7e7e7e", fontSize: "11px" }}>Halisi</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", background: "#0066b1", opacity: 0.7 }} />
              <span style={{ color: "#7e7e7e", fontSize: "11px" }}>Ubashiri</span>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
