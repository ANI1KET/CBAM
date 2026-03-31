import type { EmissionDeclaration, Installation, Importer } from "./types";

export const mockImporters: Importer[] = [
  { id: "imp-1", name: "SteelTrade GmbH", eoriNumber: "DE123456789012", country: "Germany", organizationId: "org-1" },
  { id: "imp-2", name: "CementCo S.r.l.", eoriNumber: "IT987654321098", country: "Italy", organizationId: "org-1" },
  { id: "imp-3", name: "NordAluminium AB", eoriNumber: "SE456789012345", country: "Sweden", organizationId: "org-1" },
];

export const mockInstallations: Installation[] = [
  { id: "inst-1", name: "Tata Steel Jamshedpur", country: "India", operator: "Tata Steel Ltd", unLocode: "INJDP", economicActivity: "Iron & Steel", organizationId: "org-1" },
  { id: "inst-2", name: "HeidelbergCement Türkiye", country: "Turkey", operator: "Heidelberg Materials", unLocode: "TRIST", economicActivity: "Cement", organizationId: "org-1" },
  { id: "inst-3", name: "RUSAL Bratsk", country: "Russia", operator: "RUSAL", unLocode: "RUBRA", economicActivity: "Aluminium", organizationId: "org-1" },
  { id: "inst-4", name: "POSCO Gwangyang", country: "South Korea", operator: "POSCO", unLocode: "KRKWA", economicActivity: "Iron & Steel", organizationId: "org-1" },
];

export const mockDeclarations: EmissionDeclaration[] = [
  {
    id: "dec-1",
    importerId: "imp-1",
    installationId: "inst-1",
    reportingPeriod: "2024-Q4",
    status: "verified",
    goods: [
      { id: "g-1", cnCode: "7207", description: "Semi-finished steel billets", quantity: 5000, unit: "tonnes", directEmissions: 9500, indirectEmissions: 1200, carbonPricePaid: 15000, countryOfOrigin: "India" },
    ],
    totalEmissions: 10700,
    estimatedCost: 680500,
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "dec-2",
    importerId: "imp-2",
    installationId: "inst-2",
    reportingPeriod: "2025-Q1",
    status: "submitted",
    goods: [
      { id: "g-2", cnCode: "2523", description: "Portland cement", quantity: 12000, unit: "tonnes", directEmissions: 8640, indirectEmissions: 960, carbonPricePaid: 0, countryOfOrigin: "Turkey" },
    ],
    totalEmissions: 9600,
    estimatedCost: 624000,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-02-05T11:15:00Z",
  },
  {
    id: "dec-3",
    importerId: "imp-3",
    installationId: "inst-3",
    reportingPeriod: "2025-Q1",
    status: "draft",
    goods: [
      { id: "g-3", cnCode: "7601", description: "Unwrought aluminium ingots", quantity: 800, unit: "tonnes", directEmissions: 6720, indirectEmissions: 4200, carbonPricePaid: 3200, countryOfOrigin: "Russia" },
    ],
    totalEmissions: 10920,
    estimatedCost: 706600,
    createdAt: "2025-02-20T09:00:00Z",
    updatedAt: "2025-02-20T09:00:00Z",
  },
  {
    id: "dec-4",
    importerId: "imp-1",
    installationId: "inst-4",
    reportingPeriod: "2025-Q1",
    status: "rejected",
    goods: [
      { id: "g-4", cnCode: "7208", description: "Hot-rolled steel coils", quantity: 3200, unit: "tonnes", directEmissions: 6560, indirectEmissions: 800, carbonPricePaid: 28000, countryOfOrigin: "South Korea" },
    ],
    totalEmissions: 7360,
    estimatedCost: 450400,
    createdAt: "2025-01-28T12:00:00Z",
    updatedAt: "2025-03-01T16:45:00Z",
  },
];
