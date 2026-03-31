import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Iron & Steel", value: 18060, color: "hsl(174, 62%, 42%)" },
  { name: "Cement", value: 9600, color: "hsl(220, 60%, 50%)" },
  { name: "Aluminium", value: 10920, color: "hsl(38, 92%, 50%)" },
  { name: "Fertilizers", value: 4200, color: "hsl(160, 60%, 40%)" },
];

export function EmissionsByCategory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]"
    >
      <h2 className="font-display font-semibold text-card-foreground mb-4">Emissions by Sector</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 25%, 12%)",
                border: "1px solid hsl(220, 20%, 18%)",
                borderRadius: "8px",
                color: "hsl(220, 10%, 92%)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} tCO₂e`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-mono text-card-foreground">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
