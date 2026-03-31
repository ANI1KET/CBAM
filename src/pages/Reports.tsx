import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { motion } from "framer-motion";

const quarterlyData = [
  { period: "Q1 '24", emissions: 28400, cost: 1846000 },
  { period: "Q2 '24", emissions: 31200, cost: 2028000 },
  { period: "Q3 '24", emissions: 34500, cost: 2242500 },
  { period: "Q4 '24", emissions: 32100, cost: 2086500 },
  { period: "Q1 '25", emissions: 38700, cost: 2461500 },
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(220, 20%, 18%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
  fontSize: "12px",
};

const Reports = () => {
  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Emission trends and cost projections">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-display font-semibold text-card-foreground mb-4">Quarterly Emissions (tCO₂e)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="emissions" fill="hsl(174, 62%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-display font-semibold text-card-foreground mb-4">Estimated CBAM Cost (€)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${v.toLocaleString()}`, "Cost"]} />
                <Line type="monotone" dataKey="cost" stroke="hsl(220, 60%, 50%)" strokeWidth={2} dot={{ fill: "hsl(220, 60%, 50%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
