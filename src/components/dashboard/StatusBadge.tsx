import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DeclarationStatus } from "@/lib/types";

const statusConfig: Record<DeclarationStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info" },
  verified: { label: "Verified", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

export function StatusBadge({ status }: { status: DeclarationStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium border-transparent", config.className)}>
      {config.label}
    </Badge>
  );
}
