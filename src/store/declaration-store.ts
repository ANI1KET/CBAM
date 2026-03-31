import { create } from "zustand";
import type { DeclaredGood } from "@/lib/types";

interface DeclarationFormState {
  currentStep: number;
  importerId: string;
  installationId: string;
  reportingPeriod: string;
  goods: DeclaredGood[];
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setImporter: (id: string) => void;
  setInstallation: (id: string) => void;
  setReportingPeriod: (period: string) => void;
  addGood: (good: DeclaredGood) => void;
  removeGood: (id: string) => void;
  updateGood: (id: string, updates: Partial<DeclaredGood>) => void;
  reset: () => void;
}

const TOTAL_STEPS = 4;

export const useDeclarationStore = create<DeclarationFormState>((set) => ({
  currentStep: 0,
  importerId: "",
  installationId: "",
  reportingPeriod: "",
  goods: [],
  setStep: (step) => set({ currentStep: Math.min(Math.max(0, step), TOTAL_STEPS - 1) }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
  setImporter: (importerId) => set({ importerId }),
  setInstallation: (installationId) => set({ installationId }),
  setReportingPeriod: (reportingPeriod) => set({ reportingPeriod }),
  addGood: (good) => set((s) => ({ goods: [...s.goods, good] })),
  removeGood: (id) => set((s) => ({ goods: s.goods.filter((g) => g.id !== id) })),
  updateGood: (id, updates) =>
    set((s) => ({
      goods: s.goods.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  reset: () =>
    set({
      currentStep: 0,
      importerId: "",
      installationId: "",
      reportingPeriod: "",
      goods: [],
    }),
}));
