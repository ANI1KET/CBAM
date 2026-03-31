import { useDeclarationStore } from "@/store/declaration-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generatedData } from "@/lib/mock-generator";
import { DEFAULT_EMISSION_FACTORS } from "@/lib/cbam-calculations";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const STEPS = [
  { id: "importer", title: "Select Importer", description: "Choose the importing entity" },
  { id: "installation", title: "Installation", description: "Select the production installation" },
  { id: "goods", title: "Declare Goods", description: "Add imported goods and emissions" },
  { id: "review", title: "Review & Submit", description: "Verify all information" },
];

interface DeclarationWizardProps {
  onClose: () => void;
}

export function DeclarationWizard({ onClose }: DeclarationWizardProps) {
  const store = useDeclarationStore();
  const step = store.currentStep;

  return (
    <div className="bg-card rounded-lg border border-border shadow-[var(--shadow-elevated)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-lg text-card-foreground">New Emission Declaration</h2>
        <Button variant="ghost" size="icon" onClick={() => { store.reset(); onClose(); }}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-0 px-6 py-4 border-b border-border bg-muted/30">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  i < step && "bg-accent text-accent-foreground",
                  i === step && "bg-primary text-primary-foreground animate-pulse-glow",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <p className={cn("text-xs font-medium", i <= step ? "text-card-foreground" : "text-muted-foreground")}>{s.title}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-3", i < step ? "bg-accent" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepImporter />}
            {step === 1 && <StepInstallation />}
            {step === 2 && <StepGoods />}
            {step === 3 && <StepReview />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (step === 0 ? (store.reset(), onClose()) : store.prevStep())}
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={store.nextStep}>
            Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        ) : (
          <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => { store.reset(); onClose(); }}>
            <Check className="w-3.5 h-3.5 mr-1.5" /> Submit Declaration
          </Button>
        )}
      </div>
    </div>
  );
}

function StepImporter() {
  const { importerId, setImporter, reportingPeriod, setReportingPeriod } = useDeclarationStore();
  return (
    <div className="space-y-5 max-w-lg">
      <div className="space-y-2">
        <Label>Importer</Label>
        <Select value={importerId} onValueChange={setImporter}>
          <SelectTrigger><SelectValue placeholder="Select importer..." /></SelectTrigger>
          <SelectContent>
            {generatedData.importers.map((imp) => (
              <SelectItem key={imp.id} value={imp.id}>
                {imp.name} — {imp.eoriNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Reporting Period</Label>
        <Select value={reportingPeriod} onValueChange={setReportingPeriod}>
          <SelectTrigger><SelectValue placeholder="Select period..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2025-Q1">2025 — Q1</SelectItem>
            <SelectItem value="2025-Q2">2025 — Q2</SelectItem>
            <SelectItem value="2025-Q3">2025 — Q3</SelectItem>
            <SelectItem value="2025-Q4">2025 — Q4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StepInstallation() {
  const { installationId, setInstallation } = useDeclarationStore();
  return (
    <div className="space-y-5 max-w-lg">
      <div className="space-y-2">
        <Label>Production Installation</Label>
        <Select value={installationId} onValueChange={setInstallation}>
          <SelectTrigger><SelectValue placeholder="Select installation..." /></SelectTrigger>
          <SelectContent>
            {generatedData.installations.slice(0, 30).map((inst) => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name} — {inst.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {installationId && (() => {
        const inst = generatedData.installations.find((i) => i.id === installationId);
        if (!inst) return null;
        return (
          <div className="bg-muted/50 rounded-md p-4 space-y-1 text-sm">
            <p><span className="text-muted-foreground">Operator:</span> <span className="font-medium text-card-foreground">{inst.operator}</span></p>
            <p><span className="text-muted-foreground">Country:</span> <span className="font-medium text-card-foreground">{inst.country}</span></p>
            <p><span className="text-muted-foreground">Activity:</span> <span className="font-medium text-card-foreground">{inst.economicActivity}</span></p>
            <p><span className="text-muted-foreground">UN/LOCODE:</span> <span className="font-mono text-card-foreground">{inst.unLocode}</span></p>
          </div>
        );
      })()}
    </div>
  );
}

function StepGoods() {
  const { goods, addGood } = useDeclarationStore();
  const [cnCode, setCnCode] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [directEm, setDirectEm] = useState("");
  const [indirectEm, setIndirectEm] = useState("");

  const handleAdd = () => {
    if (!cnCode || !qty) return;
    addGood({
      id: `g-${Date.now()}`,
      cnCode,
      description: desc,
      quantity: parseFloat(qty),
      unit: "tonnes",
      directEmissions: parseFloat(directEm) || 0,
      indirectEmissions: parseFloat(indirectEm) || 0,
      carbonPricePaid: 0,
      countryOfOrigin: "",
    });
    setCnCode(""); setDesc(""); setQty(""); setDirectEm(""); setIndirectEm("");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">CN Code</Label>
          <Select value={cnCode} onValueChange={setCnCode}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Code" /></SelectTrigger>
            <SelectContent>
              {Object.keys(DEFAULT_EMISSION_FACTORS).map((code) => (
                <SelectItem key={code} value={code}>{code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Input className="h-9" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Product" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Quantity (t)</Label>
          <Input className="h-9" type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Direct (tCO₂)</Label>
          <Input className="h-9" type="number" value={directEm} onChange={(e) => setDirectEm(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Indirect (tCO₂)</Label>
          <Input className="h-9" type="number" value={indirectEm} onChange={(e) => setIndirectEm(e.target.value)} placeholder="0" />
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleAdd}>+ Add Good</Button>

      {goods.length > 0 && (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 text-muted-foreground">
              <th className="text-left px-3 py-2 text-xs font-medium">CN</th>
              <th className="text-left px-3 py-2 text-xs font-medium">Description</th>
              <th className="text-right px-3 py-2 text-xs font-medium">Qty</th>
              <th className="text-right px-3 py-2 text-xs font-medium">Direct</th>
              <th className="text-right px-3 py-2 text-xs font-medium">Indirect</th>
            </tr></thead>
            <tbody>
              {goods.map((g) => (
                <tr key={g.id} className="border-t border-border/50">
                  <td className="px-3 py-2 font-mono text-xs">{g.cnCode}</td>
                  <td className="px-3 py-2">{g.description}</td>
                  <td className="px-3 py-2 text-right font-mono">{g.quantity}</td>
                  <td className="px-3 py-2 text-right font-mono">{g.directEmissions}</td>
                  <td className="px-3 py-2 text-right font-mono">{g.indirectEmissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StepReview() {
  const { importerId, installationId, reportingPeriod, goods } = useDeclarationStore();
  const importer = generatedData.importers.find((i) => i.id === importerId);
  const installation = generatedData.installations.find((i) => i.id === installationId);
  const totalDirect = goods.reduce((s, g) => s + g.directEmissions, 0);
  const totalIndirect = goods.reduce((s, g) => s + g.indirectEmissions, 0);

  return (
    <div className="space-y-4 max-w-lg">
      <h3 className="font-display font-semibold text-card-foreground">Declaration Summary</h3>
      <div className="bg-muted/50 rounded-md p-4 space-y-2 text-sm">
        <p><span className="text-muted-foreground">Importer:</span> <span className="font-medium">{importer?.name ?? "—"}</span></p>
        <p><span className="text-muted-foreground">Installation:</span> <span className="font-medium">{installation?.name ?? "—"}</span></p>
        <p><span className="text-muted-foreground">Period:</span> <span className="font-medium">{reportingPeriod || "—"}</span></p>
        <p><span className="text-muted-foreground">Goods:</span> <span className="font-medium">{goods.length} item(s)</span></p>
        <div className="border-t border-border pt-2 mt-2">
          <p><span className="text-muted-foreground">Total Direct:</span> <span className="font-mono font-medium">{totalDirect.toLocaleString()} tCO₂</span></p>
          <p><span className="text-muted-foreground">Total Indirect:</span> <span className="font-mono font-medium">{totalIndirect.toLocaleString()} tCO₂</span></p>
          <p className="font-semibold text-accent mt-1">
            Total: {(totalDirect + totalIndirect).toLocaleString()} tCO₂e
          </p>
        </div>
      </div>
    </div>
  );
}
