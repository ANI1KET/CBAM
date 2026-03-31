import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/DataTable";
import { generatedData } from "@/lib/mock-generator";
import type { ColumnDef } from "@tanstack/react-table";
import type { Importer } from "@/lib/types";

const columns: ColumnDef<Importer, any>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.id}</span>, size: 80 },
  { accessorKey: "name", header: "Company Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "eoriNumber", header: "EORI Number", cell: ({ row }) => <span className="font-mono text-xs">{row.original.eoriNumber}</span> },
  { accessorKey: "country", header: "Country" },
];

export default function Importers() {
  return (
    <DashboardLayout title="Importers" subtitle={`${generatedData.importers.length} registered EU importers`}>
      <DataTable
        data={generatedData.importers}
        columns={columns}
        searchPlaceholder="Search importers..."
        filterOptions={[{
          column: "country",
          label: "Country",
          options: ["Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Poland", "Sweden"].map((c) => ({ label: c, value: c })),
        }]}
      />
    </DashboardLayout>
  );
}
