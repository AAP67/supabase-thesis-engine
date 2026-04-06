import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, ScatterChart, Scatter, CartesianGrid } from "recharts";

// ── Archetype definitions ──
const ARCHETYPES = {
  "full-stack-saas": { label: "Full-Stack Web/SaaS", fit: 9, avgMRR: 150, products: ["DB","Auth","RLS","Storage"], cacAlt: 300, color: "#3ecf8e" },
  "ai-native": { label: "AI-Native App", fit: 10, avgMRR: 250, products: ["DB","pgvector","Edge","Auth"], cacAlt: 400, color: "#22d3ee" },
  "api-platform": { label: "API / Platform", fit: 8, avgMRR: 300, products: ["DB","Edge","RLS"], cacAlt: 400, color: "#818cf8" },
  "mobile-consumer": { label: "Mobile Consumer", fit: 5, avgMRR: 60, products: ["Auth","DB"], cacAlt: 750, color: "#facc15" },
  "marketplace": { label: "Marketplace / E-comm", fit: 6, avgMRR: 120, products: ["DB","Auth","Storage"], cacAlt: 650, color: "#f97316" },
  "data-analytics": { label: "Data / Analytics", fit: 5, avgMRR: 100, products: ["DB"], cacAlt: 1000, color: "#a78bfa" },
  "hardware-iot": { label: "Hardware / IoT", fit: 2, avgMRR: 30, products: ["DB"], cacAlt: 1200, color: "#94a3b8" },
  "biotech-deep": { label: "Biotech / Deep Tech", fit: 1, avgMRR: 10, products: [], cacAlt: 1500, color: "#64748b" },
  "protocol-infra": { label: "Protocol / Infra (no use)", fit: 0, avgMRR: 0, products: [], cacAlt: 0, color: "#334155" },
};

const STAGE_MULT = { "Pre-seed": 0.4, "Seed": 0.5, "Series A": 0.85, "Series B+": 1.0 };

// ── Fund + Portfolio Data (real companies, classified) ──
const FUNDS = [
  {
    id: "yc",
    name: "Y Combinator (W25 Batch)",
    thesis: "Stage-agnostic accelerator. 160+ companies per batch. 55% of latest batch uses Supabase. Sample: 20 companies stratified by W25 sector distribution (B2B 58%, Fintech 8%, Consumer 10%, Healthcare 5%, Industrials 10%, Gov/Other 9%).",
    aum: "N/A (accelerator)",
    year: "W25",
    stageFocus: "Pre-seed",
    companies: [
      { name: "Browser Use", arch: "api-platform", stage: "Pre-seed" },
      { name: "Mastra", arch: "api-platform", stage: "Pre-seed" },
      { name: "assistant-ui", arch: "api-platform", stage: "Pre-seed" },
      { name: "Tally", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Fuse AI", arch: "ai-native", stage: "Pre-seed" },
      { name: "Pig", arch: "api-platform", stage: "Pre-seed" },
      { name: "CopyCat", arch: "ai-native", stage: "Pre-seed" },
      { name: "Peppr", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Olive", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Roark", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Rebolt", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "SolidRoad", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "BlindPay", arch: "api-platform", stage: "Pre-seed" },
      { name: "Karsa", arch: "mobile-consumer", stage: "Pre-seed" },
      { name: "Misprint", arch: "marketplace", stage: "Pre-seed" },
      { name: "Retrofit", arch: "marketplace", stage: "Pre-seed" },
      { name: "Paratus Health", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Red Barn Robotics", arch: "hardware-iot", stage: "Pre-seed" },
      { name: "Proception", arch: "hardware-iot", stage: "Pre-seed" },
      { name: "Archon Corp", arch: "full-stack-saas", stage: "Pre-seed" },
    ]
  },
  {
    id: "a16z-infra",
    name: "a16z Infrastructure",
    thesis: "Developer tools, cloud infrastructure, systems software. $1.7B fund (2024). Portfolio companies build picks-and-shovels for the software stack.",
    aum: "$1.7B",
    year: "2024",
    stageFocus: "Series A",
    companies: [
      { name: "Databricks", arch: "data-analytics", stage: "Series A" },
      { name: "Temporal", arch: "api-platform", stage: "Series A" },
      { name: "PlanetScale", arch: "api-platform", stage: "Series A" },
      { name: "Sourcegraph", arch: "full-stack-saas", stage: "Series A" },
      { name: "Railway", arch: "api-platform", stage: "Seed" },
      { name: "Replit", arch: "full-stack-saas", stage: "Series A" },
      { name: "Dagger", arch: "api-platform", stage: "Seed" },
      { name: "Modal", arch: "ai-native", stage: "Series A" },
      { name: "Weights & Biases", arch: "ai-native", stage: "Series A" },
      { name: "Hex", arch: "data-analytics", stage: "Series A" },
      { name: "Airplane", arch: "full-stack-saas", stage: "Seed" },
      { name: "Depot", arch: "api-platform", stage: "Seed" },
      { name: "Socket", arch: "full-stack-saas", stage: "Seed" },
      { name: "Stainless", arch: "api-platform", stage: "Seed" },
      { name: "Speakeasy", arch: "api-platform", stage: "Seed" },
      { name: "Coherence", arch: "api-platform", stage: "Seed" },
      { name: "Tigris Data", arch: "api-platform", stage: "Seed" },
      { name: "Arroyo", arch: "data-analytics", stage: "Seed" },
      { name: "Nango", arch: "api-platform", stage: "Seed" },
      { name: "Inngest", arch: "api-platform", stage: "Seed" },
    ]
  },
  {
    id: "boldstart",
    name: "Boldstart Ventures",
    thesis: "Inception-stage developer-first enterprise infrastructure. Fund VII: $250M (2025). Pre-product, pre-revenue technical founders. AI infra, security, agentic automation.",
    aum: "$250M",
    year: "2025",
    stageFocus: "Pre-seed",
    companies: [
      { name: "Snyk", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "BigID", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "SecurityScorecard", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Front", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Liveblocks", arch: "api-platform", stage: "Pre-seed" },
      { name: "Tessl", arch: "ai-native", stage: "Pre-seed" },
      { name: "Agentuity", arch: "ai-native", stage: "Pre-seed" },
      { name: "Pipelines.ai", arch: "ai-native", stage: "Pre-seed" },
      { name: "Systalyze", arch: "ai-native", stage: "Pre-seed" },
      { name: "Noded", arch: "ai-native", stage: "Pre-seed" },
      { name: "Spectro Cloud", arch: "api-platform", stage: "Pre-seed" },
      { name: "Cape Privacy", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Protect AI", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "env0", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Crossbeam", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Uare.ai", arch: "ai-native", stage: "Pre-seed" },
      { name: "Generalist AI", arch: "ai-native", stage: "Pre-seed" },
      { name: "Reco", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Kustomer", arch: "full-stack-saas", stage: "Pre-seed" },
      { name: "Perimeter 81", arch: "full-stack-saas", stage: "Pre-seed" },
    ]
  },
];


// ── Compute helpers ──
function computeFundMetrics(fund) {
  const cos = fund.companies.map(c => {
    const a = ARCHETYPES[c.arch];
    const sm = STAGE_MULT[c.stage] || 0.5;
    const creditPerCo = Math.round((a.cacAlt + a.cacAlt * 0.25) * sm);
    return { ...c, archetype: a, stageMult: sm, fitScore: a.fit, mrrEst: Math.round(a.avgMRR * sm), creditRec: creditPerCo, products: a.products };
  });
  const avgFit = cos.reduce((s, c) => s + c.fitScore, 0) / cos.length;
  const activationEst = Math.min(0.65, avgFit / 15 + 0.05);
  const avgMRR = cos.reduce((s, c) => s + c.mrrEst, 0) / cos.length;
  const avgCredit = cos.reduce((s, c) => s + c.creditRec, 0) / cos.length;
  const productMap = {};
  cos.forEach(c => c.products.forEach(p => { productMap[p] = (productMap[p] || 0) + 1; }));
  const archDist = {};
  cos.forEach(c => { const l = c.archetype.label; archDist[l] = (archDist[l] || 0) + 1; });
  const retentionRisk = cos.filter(c => c.fitScore <= 3).length / cos.length;
  const discountTier = avgFit >= 7 ? "Platinum (25-30%)" : avgFit >= 5 ? "Gold (15-20%)" : avgFit >= 3 ? "Silver (10-15%)" : "Goodwill (5%)";
  return { cos, avgFit: Math.round(avgFit * 10) / 10, activationEst, avgMRR: Math.round(avgMRR), avgCredit: Math.round(avgCredit), productMap, archDist, retentionRisk: Math.round(retentionRisk * 100), discountTier, totalProgramValue: Math.round(avgCredit * cos.length) };
}

const ALL_PRODUCTS = ["DB", "Auth", "RLS", "Storage", "pgvector", "Edge"];

// ── Tooltip ──
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c1917", border: "1px solid #44403c", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#d6d3d1", fontFamily: "inherit" }}>
      <div style={{ fontWeight: 700, color: "#fafaf9", marginBottom: 3 }}>{label || payload[0]?.payload?.name}</div>
      {payload.map((p, i) => <div key={i}>{p.name || p.dataKey}: {typeof p.value === "number" && p.value > 10 ? p.value.toLocaleString() : p.value}</div>)}
    </div>
  );
};

export default function ThesisEngine() {
  const [selectedFund, setSelectedFund] = useState("yc");
  const allMetrics = useMemo(() => FUNDS.reduce((acc, f) => { acc[f.id] = computeFundMetrics(f); return acc; }, {}), []);
  const fund = FUNDS.find(f => f.id === selectedFund);
  const m = allMetrics[selectedFund];

  const comparisonData = FUNDS.map(f => {
    const fm = allMetrics[f.id];
    return { name: f.name.replace("a16z ", "").replace("Ventures", "").replace("Capital (US Early)", ""), fullName: f.name, fit: fm.avgFit, activation: Math.round(fm.activationEst * 100), avgMRR: fm.avgMRR, credit: fm.avgCredit, retention: 100 - fm.retentionRisk, program: fm.totalProgramValue, id: f.id };
  }).sort((a, b) => b.fit - a.fit);

  const archBars = Object.entries(m.archDist).map(([k, v]) => ({ name: k.length > 18 ? k.slice(0, 16) + "…" : k, count: v, color: Object.values(ARCHETYPES).find(a => a.label === k)?.color || "#888" }));

  const productRadar = ALL_PRODUCTS.map(p => ({ product: p, coverage: m.productMap[p] || 0 }));

  const scatterData = FUNDS.map(f => {
    const fm = allMetrics[f.id];
    return { name: f.name.replace("a16z ", ""), fit: fm.avgFit, activation: Math.round(fm.activationEst * 100), program: fm.totalProgramValue, avgMRR: fm.avgMRR };
  });

  const isA16z = selectedFund.startsWith("a16z");

  return (
    <div style={{ minHeight: "100vh", background: "#0c0a09", color: "#e7e5e4", fontFamily: "'DM Sans', 'Sohne', system-ui, sans-serif", padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Fonts loaded in index.html */}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 6, height: 28, borderRadius: 3, background: "linear-gradient(180deg, #3ecf8e, #22d3ee)" }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Supabase Thesis-to-Usage Correlation Engine</h1>
        </div>
        <p style={{ color: "#78716c", fontSize: 12, margin: "4px 0 0 16px", fontFamily: "'DM Mono', monospace" }}>
          Fund investment thesis → portfolio classification → expected Supabase usage density → discount recommendation
        </p>
      </div>

      {/* Fund Selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
        {FUNDS.map(f => (
          <button key={f.id} onClick={() => setSelectedFund(f.id)} style={{
            padding: "7px 14px", borderRadius: 6, border: "1px solid",
            borderColor: selectedFund === f.id ? "#3ecf8e" : "#292524",
            background: selectedFund === f.id ? "#3ecf8e12" : "#1c1917",
            color: selectedFund === f.id ? "#3ecf8e" : "#a8a29e",
            fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}>{f.name.replace("a16z ", "a16z ").replace("Capital (US Early)", "")}</button>
        ))}
      </div>

      {/* Fund Overview Card */}
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", color: "#fafaf9" }}>{fund.name}</h2>
            <p style={{ fontSize: 12, color: "#a8a29e", lineHeight: 1.6, margin: 0 }}>{fund.thesis}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <span style={{ fontSize: 11, color: "#78716c" }}>AUM: <strong style={{ color: "#d6d3d1" }}>{fund.aum}</strong></span>
              <span style={{ fontSize: 11, color: "#78716c" }}>Year: <strong style={{ color: "#d6d3d1" }}>{fund.year}</strong></span>
              <span style={{ fontSize: 11, color: "#78716c" }}>Stage: <strong style={{ color: "#d6d3d1" }}>{fund.stageFocus}</strong></span>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Thesis Fit", value: `${m.avgFit}/10`, color: m.avgFit >= 7 ? "#3ecf8e" : m.avgFit >= 4 ? "#facc15" : "#ef4444" },
              { label: "Expected Activation", value: `${Math.round(m.activationEst * 100)}%`, color: m.activationEst >= 0.4 ? "#3ecf8e" : m.activationEst >= 0.25 ? "#facc15" : "#ef4444" },
              { label: "Avg MRR / Co", value: `$${m.avgMRR}`, color: "#22d3ee" },
              { label: "Retention Risk", value: `${m.retentionRisk}%`, color: m.retentionRisk <= 20 ? "#3ecf8e" : m.retentionRisk <= 50 ? "#facc15" : "#ef4444" },
              { label: "Discount Tier", value: m.discountTier.split(" (")[0], color: "#a78bfa" },
              { label: "Program Value", value: `$${m.totalProgramValue.toLocaleString()}`, color: "#f97316" },
            ].map((kpi, i) => (
              <div key={i} style={{ background: "#0c0a09", borderRadius: 8, padding: "10px 14px", minWidth: 110 }}>
                <div style={{ fontSize: 9, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Archetype Distribution */}
        <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "#a8a29e" }}>Portfolio Archetype Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={archBars} layout="vertical" margin={{ left: 100, right: 16 }}>
              <XAxis type="number" tick={{ fill: "#57534e", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#a8a29e", fontSize: 10 }} axisLine={false} tickLine={false} width={95} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {archBars.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Surface Radar */}
        <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "#a8a29e" }}>Supabase Product Surface Coverage</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={productRadar} outerRadius={70}>
              <PolarGrid stroke="#292524" />
              <PolarAngleAxis dataKey="product" tick={{ fill: "#a8a29e", fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar dataKey="coverage" stroke="#3ecf8e" fill="#3ecf8e" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Table */}
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 16px", marginBottom: 20, overflowX: "auto" }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "#a8a29e" }}>Portfolio Company Classification</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #292524" }}>
              {["Company", "Archetype", "Stage", "Fit", "Est. MRR", "Products Used", "Credit Rec."].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#57534e", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.cos.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1c1917" }}
                onMouseEnter={e => e.currentTarget.style.background = "#292524"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "8px 10px", fontWeight: 600, color: "#fafaf9" }}>{c.name}</td>
                <td style={{ padding: "8px 10px" }}>
                  <span style={{ color: c.archetype.color, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${c.archetype.color}15`, border: `1px solid ${c.archetype.color}30` }}>{c.archetype.label}</span>
                </td>
                <td style={{ padding: "8px 10px", color: "#a8a29e" }}>{c.stage}</td>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: c.fitScore >= 7 ? "#3ecf8e" : c.fitScore >= 4 ? "#facc15" : "#ef4444" }}>{c.fitScore}/10</td>
                <td style={{ padding: "8px 10px", color: "#d6d3d1", fontFamily: "'DM Mono', monospace" }}>${c.mrrEst}/mo</td>
                <td style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {c.products.length ? c.products.map(p => (
                      <span key={p} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#292524", color: "#a8a29e" }}>{p}</span>
                    )) : <span style={{ fontSize: 9, color: "#57534e" }}>—</span>}
                  </div>
                </td>
                <td style={{ padding: "8px 10px", color: c.creditRec > 0 ? "#22d3ee" : "#57534e", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                  {c.creditRec > 0 ? `$${c.creditRec}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-Fund Comparison */}
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "#a8a29e" }}>Cross-Fund Comparison: Thesis Fit vs Expected Activation</div>
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ left: 10, right: 20, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
            <XAxis dataKey="fit" name="Thesis Fit" tick={{ fill: "#57534e", fontSize: 10 }} axisLine={false} label={{ value: "Thesis Fit Score", position: "bottom", fill: "#57534e", fontSize: 10 }} />
            <YAxis dataKey="activation" name="Activation %" tick={{ fill: "#57534e", fontSize: 10 }} axisLine={false} unit="%" />
            <Tooltip content={<Tip />} />
            <Scatter data={scatterData} fill="#3ecf8e">
              {scatterData.map((d, i) => (
                <Cell key={i} fill={d.fit >= 7 ? "#3ecf8e" : d.fit >= 4 ? "#facc15" : "#ef4444"} r={Math.max(6, d.avgMRR / 20)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
          {scatterData.map((d, i) => (
            <span key={i} style={{ fontSize: 9, color: "#78716c" }}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: d.fit >= 7 ? "#3ecf8e" : d.fit >= 4 ? "#facc15" : "#ef4444", marginRight: 4 }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 16px", marginBottom: 20, overflowX: "auto" }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: "#a8a29e" }}>Fund Scorecard Summary</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #292524" }}>
              {["Fund", "Thesis Fit", "Activation", "Avg MRR", "Retention", "Credit/Co", "Program Value"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#57534e", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((d, i) => (
              <tr key={i} style={{
                borderBottom: "1px solid #1c1917", cursor: "pointer",
                background: d.id === selectedFund ? "#292524" : "transparent",
              }} onClick={() => setSelectedFund(d.id)}
                onMouseEnter={e => { if (d.id !== selectedFund) e.currentTarget.style.background = "#1c1917"; }}
                onMouseLeave={e => { if (d.id !== selectedFund) e.currentTarget.style.background = "transparent"; }}>
                <td style={{ padding: "8px 10px", fontWeight: 600, color: d.id === selectedFund ? "#fafaf9" : "#d6d3d1" }}>{d.fullName}</td>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: d.fit >= 7 ? "#3ecf8e" : d.fit >= 4 ? "#facc15" : "#ef4444" }}>{d.fit}/10</td>
                <td style={{ padding: "8px 10px", fontWeight: 600, color: d.activation >= 40 ? "#3ecf8e" : d.activation >= 25 ? "#facc15" : "#ef4444" }}>{d.activation}%</td>
                <td style={{ padding: "8px 10px", color: "#d6d3d1", fontFamily: "'DM Mono', monospace" }}>${d.avgMRR}/mo</td>
                <td style={{ padding: "8px 10px", color: d.retention >= 80 ? "#3ecf8e" : d.retention >= 50 ? "#facc15" : "#ef4444" }}>{d.retention}%</td>
                <td style={{ padding: "8px 10px", color: "#22d3ee", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>${d.credit}</td>
                <td style={{ padding: "8px 10px", color: "#f97316", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>${d.program.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Methodology Note */}
      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "18px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "#a8a29e" }}>Methodology</div>
        <div style={{ fontSize: 11, color: "#78716c", lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#a8a29e" }}>Thesis Fit Score (0-10):</strong> Each portfolio company is classified into one of 9 usage archetypes based on its product description. Each archetype has a pre-assigned fit score reflecting the likelihood and depth of Supabase product usage. Fund-level score is the portfolio-weighted average.</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#a8a29e" }}>Expected Activation:</strong> Derived from thesis fit score. Calibrated against YC's known 55% Supabase adoption rate. Formula: min(65%, fit/15 + 5%).</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#a8a29e" }}>MRR Estimate:</strong> Based on archetype average monthly usage × stage multiplier (Pre-seed: 0.4, Seed: 0.5, Series A: 0.85, Series B+: 1.0).</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: "#a8a29e" }}>Credit Recommendation:</strong> Per-company credit = (CAC_alt + 25% competitive displacement premium) × stage multiplier. CAC_alt varies by archetype: $300-400 for high-fit (organic discovery likely), $600-1500 for low-fit (would require paid/outbound acquisition).</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#a8a29e" }}>Retention Risk:</strong> Percentage of portfolio companies with fit score ≤ 3 (likely to churn post-credit or never meaningfully activate).</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #292524", paddingTop: 14 }}>
        <span style={{ fontSize: 10, color: "#44403c", fontFamily: "'DM Mono', monospace" }}>Supabase VC Partnerships · Thesis-to-Usage Engine v1.0</span>
        <span style={{ fontSize: 10, color: "#44403c", fontFamily: "'DM Mono', monospace" }}>Built by Karan · April 2026</span>
      </div>
    </div>
  );
}
