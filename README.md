# Supabase Thesis-to-Usage Correlation Engine

An interactive dashboard that correlates VC fund investment theses with expected Supabase product usage across their portfolio companies.

## What It Does

Takes 8 VC funds (5 a16z sub-funds, Y Combinator, Boldstart Ventures, Sequoia Capital), classifies 160 portfolio companies across 9 usage archetypes, and computes:

- **Thesis Fit Score** — how well the fund's portfolio maps to Supabase's product surface
- **Expected Activation Rate** — % of portfolio companies likely to adopt (calibrated against YC's 55% Supabase adoption)
- **Usage Density** — average expected MRR per activated company
- **Credit Recommendation** — per-company discount based on CAC displacement + competitive premium
- **Product Surface Coverage** — which Supabase features each fund's portfolio would use

## The Core Insight

Five funds under a16z — same brand, same GP relationships — score between 2.1/10 and 7.1/10 on thesis fit. Giving them all the same discount wastes money on low-fit funds and under-invests in high-fit ones.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect this GitHub repo to Vercel for automatic deploys.

## Built With

- React 18
- Recharts
- Vite

## Data Sources

- Portfolio companies: Fund websites, Crunchbase (public data)
- CAC benchmarks: First Page Sage, Phoenix Strategy Group, OpenView Partners
- Activation calibration: Craft Ventures Supabase growth analysis (55% YC adoption)
- SaaS retention benchmarks: VC Cafe, Userpilot

---

Built by [Karan](https://github.com/AAP67) · April 2026
