import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { generatedData } from "@/lib/mock-generator";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Installation } from "@/lib/types";

const columns: ColumnDef<Installation, any>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>, size: 80 },
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium truncate max-w-[200px] block">{row.original.name}</span> },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "operator", header: "Operator" },
  { accessorKey: "unLocode", header: "UN/LOCODE", cell: ({ row }) => <span className="font-mono text-xs">{row.original.unLocode}</span>, size: 100 },
  { accessorKey: "economicActivity", header: "Sector", cell: ({ row }) => <Badge variant="secondary" className="text-xs">{row.original.economicActivity}</Badge> },
  { accessorKey: "capacity", header: "Capacity", cell: ({ row }) => row.original.capacity ? <span className="font-mono text-xs">{(row.original.capacity / 1000).toFixed(0)}k t/yr</span> : "—" },
];

export default function Installations() {
  return (
    <DashboardLayout title="Installations" subtitle={`${generatedData.installations.length} installations tracked globally`}>
      <DataTable
        data={generatedData.installations}
        columns={columns}
        searchPlaceholder="Search installations..."
        filterOptions={[{
          column: "economicActivity",
          label: "Sector",
          options: [
            { label: "Iron & Steel", value: "Iron & Steel" },
            { label: "Cement", value: "Cement" },
            { label: "Aluminium", value: "Aluminium" },
            { label: "Fertilizers", value: "Fertilizers" },
            { label: "Electricity", value: "Electricity" },
            { label: "Hydrogen", value: "Hydrogen" },
          ],
        }]}
      />
    </DashboardLayout>
  );
}
