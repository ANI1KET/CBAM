import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { generatedData } from "@/lib/mock-generator";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis,
} from "recharts";
import { AlertTriangle, ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  "hsl(174, 62%, 42%)", "hsl(220, 60%, 50%)", "hsl(38, 92%, 50%)",
  "hsl(160, 60%, 40%)", "hsl(280, 50%, 50%)", "hsl(0, 72%, 51%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(220, 20%, 18%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
  fontSize: "12px",
};

export default function RiskAssessment() {
  const { suppliers, declarations, carbonPriceHistory, quarterlyReports } = generatedData;

  // Supplier risk distribution
  const riskDistribution = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    suppliers.forEach((s) => { counts[s.riskLevel]++; });
    return Object.entries(counts).map(([level, count]) => ({ level, count }));
  }, []);

  // Carbon price trend
  const priceTrend = useMemo(() =>
    carbonPriceHistory.filter((_, i) => i % 4 === 0).map((p) => ({
      date: p.date,
      price: p.price,
      type: p.source,
    })),
  []);

  // Emissions by quarter trend
  const quarterlyTrend = useMemo(() =>
    quarterlyReports.map((q) => ({
      period: q.period,
      emissions: Math.round(q.totalEmissions / 1000),
      cost: Math.round(q.totalCost / 1000),
      declarations: q.declarationCount,
    })),
  []);

  // Top risky suppliers
  const riskySuppliers = useMemo(() =>
    [...suppliers]
      .sort((a, b) => a.reliabilityScore - b.reliabilityScore)
      .slice(0, 10)
      .map((s) => ({
        name: s.name.length > 20 ? s.name.substring(0, 20) + "…" : s.name,
        score: s.reliabilityScore,
        risk: s.riskLevel,
        country: s.country,
      })),
  []);

  // Sector emission breakdown
  const sectorData = useMemo(() => {
    const latest = quarterlyReports[quarterlyReports.length - 1];
    if (!latest) return [];
    return Object.entries(latest.emissionsByCategory)
      .filter(([_, v]) => v > 0)
      .map(([sector, value]) => ({
        name: sector.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: Math.round(value),
      }));
  }, []);

  const totalSuppliers = suppliers.length;
  const criticalCount = suppliers.filter((s) => s.riskLevel === "critical").length;
  const highCount = suppliers.filter((s) => s.riskLevel === "high").length;
  const avgScore = Math.round(suppliers.reduce((s, sup) => s + sup.reliabilityScore, 0) / totalSuppliers);

  return (
    <DashboardLayout title="Risk Assessment" subtitle="Supply chain risk analysis & CO₂ trend monitoring">
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg Reliability", value: `${avgScore}/100`, icon: ShieldCheck, color: "text-success" },
          { label: "Critical Suppliers", value: criticalCount, icon: ShieldAlert, color: "text-destructive" },
          { label: "High Risk", value: highCount, icon: AlertTriangle, color: "text-warning" },
          { label: "Price Trend (latest)", value: `€${carbonPriceHistory[carbonPriceHistory.length - 1]?.price}`, icon: TrendingUp, color: "text-info" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg border border-border p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-card-foreground">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Carbon Price Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-semibold text-card-foreground mb-4">EU ETS Carbon Price (€/tCO₂)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 50%)" interval={5} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${v.toFixed(2)}`, "Price"]} />
                <Line type="monotone" dataKey="price" stroke="hsl(174, 62%, 42%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quarterly Emissions Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-semibold text-card-foreground mb-4">Quarterly Emissions (k tCO₂e)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="emissions" fill="hsl(220, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Risk Distribution */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-semibold text-card-foreground mb-4">Supplier Risk Distribution</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={80} label={({ level, count }) => `${level}: ${count}`}>
                  {riskDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sector Breakdown */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-semibold text-card-foreground mb-4">Emissions by Sector (Latest Q)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 50%)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 50%)" width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="hsl(174, 62%, 42%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom 10 Suppliers */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-semibold text-card-foreground mb-4">Lowest Reliability Suppliers</h2>
          <div className="space-y-2 overflow-y-auto max-h-56">
            {riskySuppliers.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.country}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-mono font-semibold text-card-foreground">{s.score}</span>
                  <Badge variant={s.risk === "critical" ? "destructive" : s.risk === "high" ? "outline" : "secondary"} className="text-xs">
                    {s.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
