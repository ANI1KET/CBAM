import { DashboardLayout } from "@/components/layout/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings" subtitle="Organization and account configuration">
      <div className="bg-card rounded-lg border border-border p-6 shadow-[var(--shadow-card)] max-w-2xl">
        <h2 className="font-display font-semibold text-card-foreground mb-4">Organization</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Organization Name</span>
            <span className="font-medium text-card-foreground">CBAMHub Demo Corp</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">EU Registration No.</span>
            <span className="font-mono text-card-foreground">EU-CBAM-2024-001234</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">EU Carbon Price (Current)</span>
            <span className="font-mono text-accent">€65.00 / tCO₂</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">User Role</span>
            <span className="font-medium text-card-foreground">Admin</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
