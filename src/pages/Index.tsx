import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentDeclarations } from "@/components/dashboard/RecentDeclarations";
import { EmissionsByCategory } from "@/components/dashboard/EmissionsByCategory";
import { Activity, FileText, Factory, DollarSign, Users, AlertTriangle } from "lucide-react";
import { generatedData } from "@/lib/mock-generator";
import { getValidationSummary } from "@/lib/validation-engine";
import { useMemo } from "react";

const Index = () => {
  const { declarations, installations, suppliers, importers } = generatedData;

  const stats = useMemo(() => {
    const totalEmissions = declarations.reduce((s, d) => s + d.totalEmissions, 0);
    const totalCost = declarations.reduce((s, d) => s + d.estimatedCost, 0);
    const validation = getValidationSummary(declarations);
    const criticalSuppliers = suppliers.filter((s) => s.riskLevel === "critical" || s.riskLevel === "high").length;
    return { totalEmissions, totalCost, validation, criticalSuppliers };
  }, []);

  return (
    <DashboardLayout title="Dashboard" subtitle="CBAM Management Overview — All Periods">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Total Emissions"
          value={`${(stats.totalEmissions / 1000).toFixed(0)}k tCO₂e`}
          change={`${declarations.length} declarations`}
          changeType="neutral"
          icon={<Activity className="w-5 h-5" />}
          subtitle="Across all periods"
        />
        <KPICard
          title="Declarations"
          value={String(declarations.length)}
          change={`${declarations.filter((d) => d.status === "draft").length} drafts`}
          changeType="neutral"
          icon={<FileText className="w-5 h-5" />}
          subtitle={`${declarations.filter((d) => d.status === "submitted").length} pending`}
        />
        <KPICard
          title="Installations"
          value={String(installations.length)}
          change={`${new Set(installations.map((i) => i.country)).size} countries`}
          changeType="positive"
          icon={<Factory className="w-5 h-5" />}
          subtitle="Global coverage"
        />
        <KPICard
          title="Suppliers"
          value={String(suppliers.length)}
          change={`${stats.criticalSuppliers} at risk`}
          changeType={stats.criticalSuppliers > 5 ? "negative" : "neutral"}
          icon={<Users className="w-5 h-5" />}
          subtitle={`${importers.length} importers`}
        />
        <KPICard
          title="CBAM Liability"
          value={`€${(stats.totalCost / 1000000).toFixed(1)}M`}
          change="Estimated"
          changeType="neutral"
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="All declarations"
        />
        <KPICard
          title="Validation Issues"
          value={String(stats.validation.totalErrors)}
          change={`${stats.validation.totalWarnings} warnings`}
          changeType={stats.validation.totalErrors > 0 ? "negative" : "positive"}
          icon={<AlertTriangle className="w-5 h-5" />}
          subtitle="Across all data"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDeclarations />
        </div>
        <div>
          <EmissionsByCategory />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
