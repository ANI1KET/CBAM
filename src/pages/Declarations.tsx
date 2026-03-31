import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { generatedData } from "@/lib/mock-generator";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DeclarationWizard } from "@/components/declarations/DeclarationWizard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, FileCode, AlertTriangle } from "lucide-react";
import { exportDeclarationsToExcel, downloadXML } from "@/lib/export-service";
import { validateDeclaration, getValidationSummary } from "@/lib/validation-engine";
import { toast } from "@/hooks/use-toast";
import type { ColumnDef } from "@tanstack/react-table";
import type { EmissionDeclaration } from "@/lib/types";

const importerMap = Object.fromEntries(generatedData.importers.map((i) => [i.id, i]));
const installationMap = Object.fromEntries(generatedData.installations.map((i) => [i.id, i]));

const columns: ColumnDef<EmissionDeclaration, any>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>, size: 80 },
  { accessorKey: "reportingPeriod", header: "Period", size: 90 },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => value === row.getValue(id),
    size: 100,
  },
  {
    id: "importer",
    header: "Importer",
    accessorFn: (row) => importerMap[row.importerId]?.name ?? row.importerId,
  },
  {
    id: "installation",
    header: "Installation",
    accessorFn: (row) => installationMap[row.installationId]?.name ?? row.installationId,
    cell: ({ getValue }) => <span className="truncate max-w-[180px] block">{getValue() as string}</span>,
  },
  {
    accessorKey: "totalEmissions",
    header: "Emissions (tCO₂e)",
    cell: ({ row }) => <span className="font-mono">{row.original.totalEmissions.toLocaleString()}</span>,
  },
  {
    accessorKey: "estimatedCost",
    header: "Est. Cost (€)",
    cell: ({ row }) => <span className="font-mono">€{row.original.estimatedCost.toLocaleString()}</span>,
  },
  {
    accessorKey: "goods",
    header: "Goods",
    cell: ({ row }) => <Badge variant="secondary" className="text-xs">{row.original.goods.length}</Badge>,
    enableSorting: false,
    size: 60,
  },
  {
    id: "validation",
    header: "Validation",
    cell: ({ row }) => {
      const errors = validateDeclaration(row.original);
      const errCount = errors.filter((e) => e.severity === "error").length;
      const warnCount = errors.filter((e) => e.severity === "warning").length;
      if (!errCount && !warnCount) return <Badge variant="secondary" className="text-xs bg-success/10 text-success">OK</Badge>;
      return (
        <div className="flex items-center gap-1">
          {errCount > 0 && <Badge variant="destructive" className="text-xs">{errCount} err</Badge>}
          {warnCount > 0 && <Badge variant="outline" className="text-xs text-warning border-warning">{warnCount} warn</Badge>}
        </div>
      );
    },
    enableSorting: false,
    size: 120,
  },
];

export default function Declarations() {
  const [showWizard, setShowWizard] = useState(false);
  const declarations = generatedData.declarations;
  const summary = getValidationSummary(declarations);

  const handleExportExcel = () => {
    exportDeclarationsToExcel(declarations);
    toast({ title: "Export complete", description: `Exported ${declarations.length} declarations to Excel.` });
  };

  const handleExportXML = () => {
    downloadXML(declarations);
    toast({ title: "XML exported", description: "CBAM XML report downloaded." });
  };

  return (
    <DashboardLayout title="Declarations" subtitle={`${declarations.length} declarations · ${summary.totalErrors} errors · ${summary.totalWarnings} warnings`}>
      {showWizard ? (
        <DeclarationWizard onClose={() => setShowWizard(false)} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button onClick={() => setShowWizard(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Declaration
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-1" /> Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportXML}>
              <FileCode className="h-4 w-4 mr-1" /> Export XML
            </Button>
            {summary.totalErrors > 0 && (
              <div className="ml-auto flex items-center gap-1 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {summary.totalErrors} validation errors across all declarations
              </div>
            )}
          </div>

          <DataTable
            data={declarations}
            columns={columns}
            searchPlaceholder="Search declarations..."
            enableSelection
            filterOptions={[{
              column: "status",
              label: "Status",
              options: [
                { label: "Draft", value: "draft" },
                { label: "Submitted", value: "submitted" },
                { label: "Verified", value: "verified" },
                { label: "Rejected", value: "rejected" },
              ],
            }]}
            batchActions={
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" /> Export Selected
              </Button>
            }
          />
        </>
      )}
    </DashboardLayout>
  );
}
