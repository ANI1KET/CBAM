import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { generatedData } from "@/lib/mock-generator";
import { calculateCBAMCost } from "@/lib/cbam-calculations";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FlaskConical, TrendingDown, TrendingUp, DollarSign, Leaf } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "hsl(220, 25%, 12%)",
  border: "1px solid hsl(220, 20%, 18%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
  fontSize: "12px",
};

export default function WhatIfSimulator() {
  const { declarations, suppliers, installations } = generatedData;

  // Controls
  const [directReduction, setDirectReduction] = useState(0);
  const [indirectReduction, setIndirectReduction] = useState(0);
  const [carbonPrice, setCarbonPrice] = useState(65);
  const [selectedSupplier, setSelectedSupplier] = useState("__all__");

  // Compute baseline and scenario
  const results = useMemo(() => {
    let filteredDecs = declarations;
    if (selectedSupplier !== "__all__") {
      filteredDecs = declarations.filter((d) => d.supplierId === selectedSupplier);
    }

    let baselineEmissions = 0;
    let baselineCost = 0;
    let scenarioEmissions = 0;
    let scenarioCost = 0;
    let baselineDeductions = 0;
    let scenarioDeductions = 0;

    filteredDecs.forEach((d) => {
      d.goods.forEach((g) => {
        const baseResult = calculateCBAMCost({
          cnCode: g.cnCode, quantity: g.quantity,
          directEmissions: g.directEmissions, indirectEmissions: g.indirectEmissions,
          carbonPricePaid: g.carbonPricePaid,
        }, 65);

        baselineEmissions += baseResult.totalEmissions;
        baselineCost += baseResult.netCost;
        baselineDeductions += baseResult.deduction;

        const adjDirect = g.directEmissions * (1 - directReduction / 100);
        const adjIndirect = g.indirectEmissions * (1 - indirectReduction / 100);
        const scenResult = calculateCBAMCost({
          cnCode: g.cnCode, quantity: g.quantity,
          directEmissions: adjDirect, indirectEmissions: adjIndirect,
          carbonPricePaid: g.carbonPricePaid,
        }, carbonPrice);

        scenarioEmissions += scenResult.totalEmissions;
        scenarioCost += scenResult.netCost;
        scenarioDeductions += scenResult.deduction;
      });
    });

    return {
      baselineEmissions, baselineCost, baselineDeductions,
      scenarioEmissions, scenarioCost, scenarioDeductions,
      emissionsDelta: scenarioEmissions - baselineEmissions,
      costDelta: scenarioCost - baselineCost,
      declarationCount: filteredDecs.length,
    };
  }, [declarations, directReduction, indirectReduction, carbonPrice, selectedSupplier]);

  const comparisonData = [
    { metric: "Total Emissions (tCO₂e)", baseline: Math.round(results.baselineEmissions), scenario: Math.round(results.scenarioEmissions) },
    { metric: "Net Cost (€k)", baseline: Math.round(results.baselineCost / 1000), scenario: Math.round(results.scenarioCost / 1000) },
  ];

  const formatNum = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toFixed(0);

  return (
    <DashboardLayout title="What-If Simulator" subtitle="Adjust variables to model CBAM liability scenarios">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-accent" />
            <h2 className="font-display font-semibold text-card-foreground">Scenario Controls</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Supplier Filter</Label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Suppliers ({declarations.length} declarations)</SelectItem>
                {suppliers.slice(0, 20).map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Direct Emissions Reduction: {directReduction}%</Label>
            <Slider value={[directReduction]} onValueChange={([v]) => setDirectReduction(v)} max={80} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Indirect Emissions Reduction: {indirectReduction}%</Label>
            <Slider value={[indirectReduction]} onValueChange={([v]) => setIndirectReduction(v)} max={80} step={1} className="py-2" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">EU Carbon Price: €{carbonPrice}/tCO₂</Label>
            <Slider value={[carbonPrice]} onValueChange={([v]) => setCarbonPrice(v)} min={30} max={150} step={1} className="py-2" />
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Analyzing {results.declarationCount} declarations</p>
          </div>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delta cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Baseline Emissions", value: `${formatNum(results.baselineEmissions)} tCO₂e`, icon: Leaf },
              { label: "Scenario Emissions", value: `${formatNum(results.scenarioEmissions)} tCO₂e`, icon: Leaf },
              { label: "Cost Δ", value: `€${formatNum(Math.abs(results.costDelta))}`, icon: results.costDelta <= 0 ? TrendingDown : TrendingUp, delta: results.costDelta },
              { label: "Emissions Δ", value: `${formatNum(Math.abs(results.emissionsDelta))} tCO₂e`, icon: results.emissionsDelta <= 0 ? TrendingDown : TrendingUp, delta: results.emissionsDelta },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-lg border border-border p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  <card.icon className={`h-4 w-4 ${card.delta !== undefined ? (card.delta <= 0 ? "text-success" : "text-destructive") : "text-muted-foreground"}`} />
                </div>
                <p className="text-lg font-display font-bold text-card-foreground">{card.value}</p>
                {card.delta !== undefined && (
                  <Badge variant={card.delta <= 0 ? "secondary" : "destructive"} className="mt-1 text-xs">
                    {card.delta <= 0 ? "↓" : "↑"} {((Math.abs(card.delta) / (card.label.includes("Cost") ? results.baselineCost : results.baselineEmissions)) * 100).toFixed(1)}%
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>

          {/* Comparison chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-lg border border-border p-5 shadow-[var(--shadow-card)]">
            <h2 className="font-display font-semibold text-card-foreground mb-4">Baseline vs Scenario</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="baseline" fill="hsl(220, 60%, 50%)" radius={[4, 4, 0, 0]} name="Baseline" />
                  <Bar dataKey="scenario" fill="hsl(174, 62%, 42%)" radius={[4, 4, 0, 0]} name="Scenario" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
