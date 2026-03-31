import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { generatedData } from "@/lib/mock-generator";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Supplier } from "@/lib/types";

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-destructive-foreground",
};

const columns: ColumnDef<Supplier, any>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>, size: 70 },
  { accessorKey: "name", header: "Supplier Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "country", header: "Country" },
  {
    accessorKey: "reliabilityScore",
    header: "Reliability",
    cell: ({ row }) => {
      const score = row.original.reliabilityScore;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive"}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="font-mono text-xs">{score}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "riskLevel",
    header: "Risk",
    cell: ({ row }) => (
      <Badge variant="outline" className={`text-xs ${riskColors[row.original.riskLevel] || ""}`}>
        {row.original.riskLevel}
      </Badge>
    ),
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: "certifications",
    header: "Certifications",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.certifications.slice(0, 2).map((c) => (
          <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
        ))}
        {row.original.certifications.length > 2 && (
          <Badge variant="secondary" className="text-[10px]">+{row.original.certifications.length - 2}</Badge>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "installationIds",
    header: "Installations",
    cell: ({ row }) => <span className="text-sm">{row.original.installationIds.length}</span>,
    size: 90,
  },
  {
    accessorKey: "contactEmail",
    header: "Contact",
    cell: ({ row }) => <span className="text-xs text-muted-foreground truncate max-w-[160px] block">{row.original.contactEmail}</span>,
  },
];

export default function Suppliers() {
  return (
    <DashboardLayout title="Suppliers" subtitle={`${generatedData.suppliers.length} supply chain partners`}>
      <DataTable
        data={generatedData.suppliers}
        columns={columns}
        searchPlaceholder="Search suppliers..."
        enableSelection
        filterOptions={[
          {
            column: "riskLevel",
            label: "Risk Level",
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ],
          },
        ]}
      />
    </DashboardLayout>
  );
}
