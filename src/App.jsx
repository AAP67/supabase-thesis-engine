import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell } from "recharts";

const ARCHETYPES = {
  "full-stack-saas": { label: "Full-Stack SaaS", fit: 9, products: ["DB","Auth","RLS","Storage"], color: "#3ecf8e" },
  "ai-native": { label: "AI-Native App", fit: 10, products: ["DB","pgvector","Edge","Auth"], color: "#22d3ee" },
  "api-platform": { label: "API / Platform", fit: 8, products: ["DB","Edge","RLS"], color: "#818cf8" },
  "mobile-consumer": { label: "Mobile Consumer", fit: 5, products: ["Auth","DB"], color: "#facc15" },
  "marketplace": { label: "Marketplace", fit: 6, products: ["DB","Auth","Storage"], color: "#f97316" },
  "data-analytics": { label: "Data / Analytics", fit: 5, products: ["DB"], color: "#a78bfa" },
  "hardware-iot": { label: "Hardware / IoT", fit: 2, products: ["DB"], color: "#94a3b8" },
  "biotech-deep": { label: "Biotech / Deep Tech", fit: 1, products: [], color: "#64748b" },
  "protocol-infra": { label: "Protocol / Infra", fit: 0, products: [], color: "#334155" },
};

const ALL_PRODUCTS = ["DB", "Auth", "RLS", "Storage", "pgvector", "Edge"];

const FUNDS = [
  {
    id: "yc",
    name: "Y Combinator (W25)",
    thesis: "Stage-agnostic accelerator. 160+ companies per batch. 55% of latest batch uses Supabase (Craft Ventures, Oct 2025). Sample: 20 companies via stratified random sampling from W25 batch, proportional to actual sector distribution.",
    aum: "Accelerator",
    year: "W25",
    stageFocus: "Pre-seed",
    sampling: "Stratified random from W25 batch (B2B 58%, Fintech 8%, Consumer 10%, Healthcare 5%, Industrials 10%, Gov 9%). Source: Extruct.ai W25 database.",
    companies: [
      { name: "Browser Use", arch: "api-platform", desc: "Open-source web agent framework, 50k GitHub stars" },
      { name: "Mastra", arch: "api-platform", desc: "JS framework for AI agents, from Gatsby devs" },
      { name: "assistant-ui", arch: "api-platform", desc: "Open source React library for AI chat" },
      { name: "Tally", arch: "full-stack-saas", desc: "AI agents for accounting, tax, audit" },
      { name: "Fuse AI", arch: "ai-native", desc: "AI agents to replace Salesforce" },
      { name: "Pig", arch: "api-platform", desc: "API for automating Windows apps with AI" },
      { name: "CopyCat", arch: "ai-native", desc: "Next-gen RPA powered by browser agents" },
      { name: "Peppr", arch: "full-stack-saas", desc: "Self-improving knowledge base for company data" },
      { name: "Olive", arch: "full-stack-saas", desc: "Build internal tools from data with NL" },
      { name: "Roark", arch: "full-stack-saas", desc: "Datadog for Voice AI" },
      { name: "Rebolt", arch: "full-stack-saas", desc: "AI agents to replace restaurant managers" },
      { name: "SolidRoad", arch: "full-stack-saas", desc: "AI agents for sales and support training" },
      { name: "BlindPay", arch: "api-platform", desc: "Stablecoin API for global payments" },
      { name: "Karsa", arch: "mobile-consumer", desc: "Stablecoin neobank for emerging markets" },
      { name: "Misprint", arch: "marketplace", desc: "Real-time marketplace for trading cards" },
      { name: "Retrofit", arch: "marketplace", desc: "AI-curated vintage marketplace" },
      { name: "Paratus Health", arch: "full-stack-saas", desc: "AI-powered intake nurse" },
      { name: "Red Barn Robotics", arch: "hardware-iot", desc: "Autonomous weeding robot for farms" },
      { name: "Proception", arch: "hardware-iot", desc: "Making humanoids dexterous" },
      { name: "Archon Corp", arch: "full-stack-saas", desc: "Help software cos sell to government" },
    ]
  },
  {
    id: "a16z-infra",
    name: "a16z Infrastructure",
    thesis: "Developer tools, cloud infrastructure, systems software. $1.7B fund (2024). Portfolio builds picks-and-shovels for the software stack.",
    aum: "$1.7B",
    year: "2024",
    stageFocus: "Series A",
    sampling: "Representative sample from public portfolio page and Crunchbase. Biased toward more visible companies.",
    companies: [
      { name: "Databricks", arch: "data-analytics", desc: "Unified data analytics platform" },
      { name: "Temporal", arch: "api-platform", desc: "Workflow orchestration engine" },
      { name: "PlanetScale", arch: "api-platform", desc: "Serverless MySQL platform" },
      { name: "Sourcegraph", arch: "full-stack-saas", desc: "Code search and intelligence" },
      { name: "Railway", arch: "api-platform", desc: "Infrastructure platform for devs" },
      { name: "Replit", arch: "full-stack-saas", desc: "Browser-based IDE and deployment" },
      { name: "Dagger", arch: "api-platform", desc: "Programmable CI/CD engine" },
      { name: "Modal", arch: "ai-native", desc: "Serverless cloud for AI/ML" },
      { name: "Weights & Biases", arch: "ai-native", desc: "ML experiment tracking" },
      { name: "Hex", arch: "data-analytics", desc: "Collaborative data workspace" },
      { name: "Airplane", arch: "full-stack-saas", desc: "Internal tool builder" },
      { name: "Depot", arch: "api-platform", desc: "Fast container builds" },
      { name: "Socket", arch: "full-stack-saas", desc: "Supply chain security for deps" },
      { name: "Stainless", arch: "api-platform", desc: "SDK generation from APIs" },
      { name: "Speakeasy", arch: "api-platform", desc: "API DevEx platform" },
      { name: "Coherence", arch: "api-platform", desc: "Full-stack cloud automation" },
      { name: "Tigris Data", arch: "api-platform", desc: "Globally distributed object storage" },
      { name: "Arroyo", arch: "data-analytics", desc: "Real-time stream processing" },
      { name: "Nango", arch: "api-platform", desc: "Unified API for integrations" },
      { name: "Inngest", arch: "api-platform", desc: "Event-driven durable functions" },
    ]
  },
  {
    id: "boldstart",
    name: "Boldstart Ventures",
    thesis: "Inception-stage developer-first enterprise infrastructure. Fund VII: $250M (2025). Pre-product, pre-revenue technical founders. AI infra, security, agentic automation.",
    aum: "$250M",
    year: "2025",
    stageFocus: "Pre-seed",
    sampling: "Representative sample from boldstart.vc portfolio page and Crunchbase. Includes both flagship exits and 2025 inception investments.",
    companies: [
      { name: "Snyk", arch: "full-stack-saas", desc: "Developer security platform" },
      { name: "BigID", arch: "full-stack-saas", desc: "Data intelligence for privacy" },
      { name: "SecurityScorecard", arch: "full-stack-saas", desc: "Security ratings platform" },
      { name: "Front", arch: "full-stack-saas", desc: "Customer ops platform" },
      { name: "Liveblocks", arch: "api-platform", desc: "Real-time collaboration infra" },
      { name: "Tessl", arch: "ai-native", desc: "AI-native software development" },
      { name: "Agentuity", arch: "ai-native", desc: "Cloud infra for autonomous agents" },
      { name: "Pipelines.ai", arch: "ai-native", desc: "AI R&D workflow platform" },
      { name: "Systalyze", arch: "ai-native", desc: "Enterprise AI workload optimization" },
      { name: "Noded", arch: "ai-native", desc: "AI workflow automation for CS" },
      { name: "Spectro Cloud", arch: "api-platform", desc: "Kubernetes management platform" },
      { name: "Cape Privacy", arch: "full-stack-saas", desc: "Secure ML collaboration" },
      { name: "Protect AI", arch: "full-stack-saas", desc: "AI/ML security platform" },
      { name: "env0", arch: "full-stack-saas", desc: "IaC automation for DevOps" },
      { name: "Crossbeam", arch: "full-stack-saas", desc: "Partner ecosystem platform" },
      { name: "Uare.ai", arch: "ai-native", desc: "Individual AI platform" },
      { name: "Generalist AI", arch: "ai-native", desc: "Robotics foundation models" },
      { name: "Reco", arch: "full-stack-saas", desc: "AI-driven SaaS security" },
      { name: "Kustomer", arch: "full-stack-saas", desc: "CRM for customer service" },
      { name: "Perimeter 81", arch: "full-stack-saas", desc: "Zero-trust network security" },
    ]
  },
];

function computeFund(fund) {
  const cos = fund.companies.map(c => {
    const a = ARCHETYPES[c.arch];
    return { ...c, archetype: a, fitScore: a.fit, products: a.products };
  });
  const avgFit = cos.reduce((s, c) => s + c.fitScore, 0) / cos.length;
  const activationEst = Math.min(0.65, avgFit / 15 + 0.05);
  const productMap = {};
  cos.forEach(c => c.products.forEach(p => { productMap[p] = (productMap[p] || 0) + 1; }));
  const archDist = {};
  cos.forEach(c => { const l = c.archetype.label; archDist[l] = (archDist[l] || 0) + 1; });
  const retentionRisk = cos.filter(c => c.fitScore <= 3).length / cos.length;
  return { cos, avgFit: Math.round(avgFit * 10) / 10, activationEst, productMap, archDist, retentionRisk: Math.round(retentionRisk * 100) };
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c1917", border: "1px solid #44403c", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#d6d3d1", fontFamily: "inherit" }}>
      <div style={{ fontWeight: 700, color: "#fff", marginBottom: 3 }}>{label || payload[0]?.payload?.name}</div>
      {payload.map((p, i) => <div key={i}>{p.name || p.dataKey}: {p.value}</div>)}
    </div>
  );
};

export default function App() {
  const [selected, setSelected] = useState("yc");
  const metrics = useMemo(() => FUNDS.reduce((a, f) => { a[f.id] = computeFund(f); return a; }, {}), []);
  const fund = FUNDS.find(f => f.id === selected);
  const m = metrics[selected];

  const archBars = Object.entries(m.archDist)
    .map(([k, v]) => ({ name: k.length > 20 ? k.slice(0, 18) + "…" : k, count: v, color: Object.values(ARCHETYPES).find(a => a.label === k)?.color || "#888" }))
    .sort((a, b) => b.count - a.count);

  const productRadar = ALL_PRODUCTS.map(p => ({ product: p, coverage: m.productMap[p] || 0 }));

  const comparison = FUNDS.map(f => {
    const fm = metrics[f.id];
    return { id: f.id, name: f.name, fit: fm.avgFit, activation: Math.round(fm.activationEst * 100), risk: fm.retentionRisk, highFit: fm.cos.filter(c => c.fitScore >= 8).length, lowFit: fm.cos.filter(c => c.fitScore <= 3).length };
  }).sort((a, b) => b.fit - a.fit);

  return (
    <div style={{ minHeight: "100vh", background: "#0c0a09", color: "#e7e5e4", fontFamily: "'DM Sans', system-ui, sans-serif", padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 5, height: 26, borderRadius: 3, background: "linear-gradient(180deg, #3ecf8e, #22d3ee)" }} />
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Supabase Thesis-to-Usage Correlation Engine</h1>
        </div>
        <p style={{ color: "#57534e", fontSize: 11, margin: "4px 0 0 15px", fontFamily: "'DM Mono', monospace" }}>
          How well does a fund's investment thesis map to Supabase's product surface?
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {FUNDS.map(f => (
          <button key={f.id} onClick={() => setSelected(f.id)} style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid",
            borderColor: selected === f.id ? "#3ecf8e" : "#292524",
            background: selected === f.id ? "#3ecf8e12" : "#1c1917",
            color: selected === f.id ? "#3ecf8e" : "#a8a29e",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}>{f.name}</button>
        ))}
      </div>

      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "20px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", color: "#fafaf9" }}>{fund.name}</h2>
            <p style={{ fontSize: 11, color: "#a8a29e", lineHeight: 1.6, margin: "0 0 8px" }}>{fund.thesis}</p>
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ fontSize: 10, color: "#57534e" }}>AUM: <strong style={{ color: "#a8a29e" }}>{fund.aum}</strong></span>
              <span style={{ fontSize: 10, color: "#57534e" }}>Year: <strong style={{ color: "#a8a29e" }}>{fund.year}</strong></span>
              <span style={{ fontSize: 10, color: "#57534e" }}>Stage: <strong style={{ color: "#a8a29e" }}>{fund.stageFocus}</strong></span>
            </div>
            <p style={{ fontSize: 9, color: "#57534e", marginTop: 8, fontStyle: "italic" }}>Sampling: {fund.sampling}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Thesis Fit", value: `${m.avgFit}/10`, color: m.avgFit >= 7 ? "#3ecf8e" : m.avgFit >= 5 ? "#facc15" : "#ef4444" },
              { label: "Est. Activation", value: `${Math.round(m.activationEst * 100)}%`, color: m.activationEst >= 0.4 ? "#3ecf8e" : m.activationEst >= 0.25 ? "#facc15" : "#ef4444" },
              { label: "Retention Risk", value: `${m.retentionRisk}%`, color: m.retentionRisk <= 15 ? "#3ecf8e" : m.retentionRisk <= 40 ? "#facc15" : "#ef4444" },
            ].map((kpi, i) => (
              <div key={i} style={{ background: "#0c0a09", borderRadius: 8, padding: "12px 16px", minWidth: 120 }}>
                <div style={{ fontSize: 9, color: "#57534e", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, color: "#a8a29e" }}>Portfolio Archetype Distribution</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={archBars} layout="vertical" margin={{ left: 95, right: 12 }}>
              <XAxis type="number" tick={{ fill: "#44403c", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#a8a29e", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {archBars.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, color: "#a8a29e" }}>Supabase Product Surface Coverage</div>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={productRadar} outerRadius={65}>
              <PolarGrid stroke="#292524" />
              <PolarAngleAxis dataKey="product" tick={{ fill: "#a8a29e", fontSize: 10 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar dataKey="coverage" stroke="#3ecf8e" fill="#3ecf8e" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "16px", marginBottom: 18, overflowX: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, color: "#a8a29e" }}>Portfolio Company Classification</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #292524" }}>
              {["Company", "Description", "Archetype", "Fit", "Supabase Products"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "7px 10px", color: "#57534e", fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.cos.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1c1917" }}
                onMouseEnter={e => e.currentTarget.style.background = "#292524"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "7px 10px", fontWeight: 600, color: "#fafaf9", whiteSpace: "nowrap" }}>{c.name}</td>
                <td style={{ padding: "7px 10px", color: "#78716c", fontSize: 10 }}>{c.desc}</td>
                <td style={{ padding: "7px 10px" }}>
                  <span style={{ color: c.archetype.color, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${c.archetype.color}15`, border: `1px solid ${c.archetype.color}30`, whiteSpace: "nowrap" }}>{c.archetype.label}</span>
                </td>
                <td style={{ padding: "7px 10px", fontWeight: 700, color: c.fitScore >= 8 ? "#3ecf8e" : c.fitScore >= 5 ? "#facc15" : "#ef4444", fontFamily: "'DM Mono', monospace" }}>{c.fitScore}/10</td>
                <td style={{ padding: "7px 10px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {c.products.length ? c.products.map(p => (
                      <span key={p} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "#292524", color: "#a8a29e" }}>{p}</span>
                    )) : <span style={{ fontSize: 9, color: "#44403c" }}>None</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "16px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10, color: "#a8a29e" }}>Cross-Fund Comparison</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #292524" }}>
              {["Fund", "Thesis Fit", "Est. Activation", "High-Fit Cos (≥8)", "Low-Fit Cos (≤3)", "Retention Risk"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "7px 10px", color: "#57534e", fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((d, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1c1917", cursor: "pointer", background: d.id === selected ? "#292524" : "transparent" }}
                onClick={() => setSelected(d.id)}
                onMouseEnter={e => { if (d.id !== selected) e.currentTarget.style.background = "#1c1917"; }}
                onMouseLeave={e => { if (d.id !== selected) e.currentTarget.style.background = "transparent"; }}>
                <td style={{ padding: "7px 10px", fontWeight: 600, color: d.id === selected ? "#fafaf9" : "#d6d3d1" }}>{d.name}</td>
                <td style={{ padding: "7px 10px", fontWeight: 700, color: d.fit >= 7 ? "#3ecf8e" : d.fit >= 5 ? "#facc15" : "#ef4444", fontFamily: "'DM Mono', monospace", fontSize: 14 }}>{d.fit}/10</td>
                <td style={{ padding: "7px 10px", fontWeight: 600, color: d.activation >= 40 ? "#3ecf8e" : d.activation >= 25 ? "#facc15" : "#ef4444" }}>{d.activation}%</td>
                <td style={{ padding: "7px 10px", color: "#3ecf8e", fontFamily: "'DM Mono', monospace" }}>{d.highFit}/20</td>
                <td style={{ padding: "7px 10px", color: d.lowFit > 0 ? "#ef4444" : "#3ecf8e", fontFamily: "'DM Mono', monospace" }}>{d.lowFit}/20</td>
                <td style={{ padding: "7px 10px", color: d.risk <= 15 ? "#3ecf8e" : d.risk <= 40 ? "#facc15" : "#ef4444", fontWeight: 600 }}>{d.risk}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 12, padding: "16px 20px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: "#a8a29e" }}>Methodology</div>
        <div style={{ fontSize: 10, color: "#78716c", lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#a8a29e" }}>Archetypes:</strong> Each portfolio company is classified into 1 of 9 usage archetypes based on its product description. Each archetype maps to specific Supabase features (DB, Auth, RLS, Storage, pgvector, Edge Functions) and carries a fit score (0-10) reflecting likelihood and depth of adoption.</p>
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#a8a29e" }}>Thesis Fit Score:</strong> Portfolio-weighted average of company-level fit scores. A fund concentrated in SaaS and AI-Native companies scores higher than one in Hardware or Protocol companies.</p>
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#a8a29e" }}>Activation Estimate:</strong> Derived from fit score via min(65%, score/15 + 5%). Calibrated against Y Combinator's known 55% Supabase adoption rate (<a href="https://www.craftventures.com/articles/inside-supabase-breakout-growth" style={{ color: "#3ecf8e" }} target="_blank" rel="noreferrer">Craft Ventures, Oct 2025</a>).</p>
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#a8a29e" }}>Retention Risk:</strong> Percentage of portfolio companies with fit score ≤ 3 — companies unlikely to adopt or likely to churn.</p>
          <p style={{ margin: 0 }}><strong style={{ color: "#a8a29e" }}>Scope of v1:</strong> This version covers thesis fit and product surface mapping only. MRR estimates, credit/discount recommendations, and CAC analysis require Supabase's internal usage data and are planned for v2.</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #292524", paddingTop: 12 }}>
        <span style={{ fontSize: 9, color: "#44403c", fontFamily: "'DM Mono', monospace" }}>Supabase Thesis-to-Usage Engine v1 — thesis fit only</span>
        <span style={{ fontSize: 9, color: "#44403c", fontFamily: "'DM Mono', monospace" }}>Built by Karan · April 2026</span>
      </div>
    </div>
  );
}