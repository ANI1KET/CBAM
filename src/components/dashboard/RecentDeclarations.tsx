import { generatedData } from "@/lib/mock-generator";
import { formatCurrency, formatEmissions } from "@/lib/cbam-calculations";
import { StatusBadge } from "./StatusBadge";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const importerMap = Object.fromEntries(generatedData.importers.map((i) => [i.id, i]));
const installationMap = Object.fromEntries(generatedData.installations.map((i) => [i.id, i]));

export function RecentDeclarations() {
  const recent = generatedData.declarations.slice(0, 8);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-card rounded-lg border border-border shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-card-foreground">Recent Declarations</h2>
        <Link to="/declarations" className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
          View all ({generatedData.declarations.length}) <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">ID</th>
              <th className="text-left px-5 py-3 font-medium">Importer</th>
              <th className="text-left px-5 py-3 font-medium">Period</th>
              <th className="text-right px-5 py-3 font-medium">Emissions</th>
              <th className="text-right px-5 py-3 font-medium">Est. Cost</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((dec) => (
              <tr key={dec.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors last:border-0">
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{dec.id}</td>
                <td className="px-5 py-3 font-medium text-card-foreground">{importerMap[dec.importerId]?.name ?? dec.importerId}</td>
                <td className="px-5 py-3 text-muted-foreground">{dec.reportingPeriod}</td>
                <td className="px-5 py-3 text-right font-mono">{formatEmissions(dec.totalEmissions)}</td>
                <td className="px-5 py-3 text-right font-mono">{formatCurrency(dec.estimatedCost)}</td>
                <td className="px-5 py-3"><StatusBadge status={dec.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
