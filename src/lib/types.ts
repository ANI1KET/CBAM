export type UserRole = "admin" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  euRegistrationNumber: string;
  country: string;
}

export interface Installation {
  id: string;
  name: string;
  country: string;
  operator: string;
  unLocode: string;
  economicActivity: string;
  organizationId: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  capacityUnit?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contactEmail: string;
  reliabilityScore: number; // 0-100
  installationIds: string[];
  organizationId: string;
  riskLevel: RiskLevel;
  lastAuditDate: string;
  certifications: string[];
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface ProductCategory {
  cnCode: string;
  description: string;
  sector: CBAMSector;
  defaultEmissionFactor: number;
  unit: string;
}

export type CBAMSector = "iron_steel" | "cement" | "aluminium" | "fertilizers" | "electricity" | "hydrogen";

export interface Importer {
  id: string;
  name: string;
  eoriNumber: string;
  country: string;
  organizationId: string;
}

export type DeclarationStatus = "draft" | "submitted" | "verified" | "rejected";

export interface EmissionDeclaration {
  id: string;
  importerId: string;
  installationId: string;
  supplierId?: string;
  reportingPeriod: string;
  status: DeclarationStatus;
  goods: DeclaredGood[];
  totalEmissions: number;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
  validationErrors?: ValidationError[];
}

export interface DeclaredGood {
  id: string;
  cnCode: string;
  description: string;
  quantity: number;
  unit: string;
  directEmissions: number;
  indirectEmissions: number;
  carbonPricePaid: number;
  countryOfOrigin: string;
}

export interface QuarterlyReport {
  id: string;
  period: string;
  year: number;
  quarter: number;
  totalEmissions: number;
  totalCost: number;
  declarationCount: number;
  avgCarbonPrice: number;
  emissionsByCategory: Record<CBAMSector, number>;
  status: "pending" | "finalized";
  createdAt: string;
}

export interface CarbonPriceHistory {
  date: string;
  price: number; // EUR/tCO2
  source: "EU_ETS" | "forecast";
}

// Validation
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: "error" | "warning";
}

// Discriminated union for emission types
export type EmissionEntry =
  | { type: "direct"; value: number; source: "combustion" | "process"; methodology: string }
  | { type: "indirect"; value: number; source: "electricity" | "heat"; gridFactor: number }
  | { type: "precursor"; value: number; precursorCnCode: string; precursorQuantity: number };

// Wizard step types
export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

// What-If simulation
export interface WhatIfScenario {
  id: string;
  name: string;
  baseDeclarationId?: string;
  adjustments: WhatIfAdjustment[];
  resultEmissions: number;
  resultCost: number;
}

export type WhatIfAdjustment =
  | { type: "change_supplier"; fromSupplierId: string; toSupplierId: string }
  | { type: "reduce_direct_emissions"; reductionPercent: number }
  | { type: "reduce_indirect_emissions"; reductionPercent: number }
  | { type: "change_carbon_price"; newPrice: number }
  | { type: "change_quantity"; cnCode: string; newQuantity: number };
