import { faker } from "@faker-js/faker";
import type {
  Installation, Importer, Supplier, EmissionDeclaration,
  DeclaredGood, QuarterlyReport, CarbonPriceHistory, ProductCategory,
  DeclarationStatus, RiskLevel, CBAMSector, ValidationError,
} from "./types";
import { DEFAULT_EMISSION_FACTORS } from "./cbam-calculations";

faker.seed(42);

// ── Product Categories (CN Codes) ──
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { cnCode: "7201", description: "Pig iron", sector: "iron_steel", defaultEmissionFactor: 1.6, unit: "tonnes" },
  { cnCode: "7202", description: "Ferro-alloys", sector: "iron_steel", defaultEmissionFactor: 2.1, unit: "tonnes" },
  { cnCode: "7206", description: "Iron ingots", sector: "iron_steel", defaultEmissionFactor: 1.85, unit: "tonnes" },
  { cnCode: "7207", description: "Semi-finished steel billets", sector: "iron_steel", defaultEmissionFactor: 1.9, unit: "tonnes" },
  { cnCode: "7208", description: "Hot-rolled steel coils", sector: "iron_steel", defaultEmissionFactor: 2.05, unit: "tonnes" },
  { cnCode: "7209", description: "Cold-rolled steel sheets", sector: "iron_steel", defaultEmissionFactor: 2.2, unit: "tonnes" },
  { cnCode: "7210", description: "Coated steel sheets", sector: "iron_steel", defaultEmissionFactor: 2.3, unit: "tonnes" },
  { cnCode: "7211", description: "Flat-rolled iron narrow strip", sector: "iron_steel", defaultEmissionFactor: 2.0, unit: "tonnes" },
  { cnCode: "7213", description: "Hot-rolled steel bars", sector: "iron_steel", defaultEmissionFactor: 1.95, unit: "tonnes" },
  { cnCode: "7214", description: "Forged steel bars", sector: "iron_steel", defaultEmissionFactor: 2.15, unit: "tonnes" },
  { cnCode: "2523", description: "Portland cement", sector: "cement", defaultEmissionFactor: 0.72, unit: "tonnes" },
  { cnCode: "2521", description: "Limestone flux", sector: "cement", defaultEmissionFactor: 0.45, unit: "tonnes" },
  { cnCode: "2814", description: "Anhydrous ammonia", sector: "fertilizers", defaultEmissionFactor: 2.3, unit: "tonnes" },
  { cnCode: "3102", description: "Nitrogen fertilizers", sector: "fertilizers", defaultEmissionFactor: 3.1, unit: "tonnes" },
  { cnCode: "3105", description: "NPK fertilizers", sector: "fertilizers", defaultEmissionFactor: 2.8, unit: "tonnes" },
  { cnCode: "7601", description: "Unwrought aluminium ingots", sector: "aluminium", defaultEmissionFactor: 8.4, unit: "tonnes" },
  { cnCode: "7602", description: "Aluminium waste/scrap", sector: "aluminium", defaultEmissionFactor: 0.6, unit: "tonnes" },
  { cnCode: "7604", description: "Aluminium bars/profiles", sector: "aluminium", defaultEmissionFactor: 9.1, unit: "tonnes" },
  { cnCode: "7606", description: "Aluminium plates/sheets", sector: "aluminium", defaultEmissionFactor: 9.5, unit: "tonnes" },
  { cnCode: "2716", description: "Electrical energy", sector: "electricity", defaultEmissionFactor: 0.4, unit: "MWh" },
  { cnCode: "2804", description: "Hydrogen gas", sector: "hydrogen", defaultEmissionFactor: 9.0, unit: "tonnes" },
];

const COUNTRIES = ["India", "China", "Turkey", "Russia", "South Korea", "Brazil", "Indonesia", "Vietnam", "Egypt", "South Africa", "Ukraine", "Serbia", "Bosnia", "Morocco", "Tunisia", "Thailand", "Malaysia", "Pakistan", "Bangladesh", "Mexico"];
const EU_COUNTRIES = ["Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Poland", "Sweden", "Austria", "Czech Republic", "Denmark", "Finland", "Portugal", "Ireland", "Greece"];
const CERTIFICATIONS = ["ISO 14001", "ISO 50001", "EU ETS Verified", "CDP Reporting", "SBTi Approved", "ISCC Plus"];
const OPERATORS = ["Tata Steel", "ArcelorMittal", "RUSAL", "POSCO", "Heidelberg Materials", "LafargeHolcim", "Yara International", "BASF", "Emirates Steel", "JSW Steel", "Norsk Hydro", "Alcoa", "China Baowu", "Nippon Steel", "Nucor", "thyssenkrupp", "Acerinox", "Outokumpu"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateInstallations(count: number): Installation[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `inst-${i + 1}`,
    name: `${pickRandom(OPERATORS)} ${pickRandom(COUNTRIES)} Plant ${faker.number.int({ min: 1, max: 9 })}`,
    country: pickRandom(COUNTRIES),
    operator: pickRandom(OPERATORS),
    unLocode: faker.string.alpha({ length: 2, casing: "upper" }) + faker.string.alpha({ length: 3, casing: "upper" }),
    economicActivity: pickRandom(["Iron & Steel", "Cement", "Aluminium", "Fertilizers", "Electricity", "Hydrogen"]),
    organizationId: "org-1",
    latitude: faker.location.latitude({ min: -35, max: 60 }),
    longitude: faker.location.longitude({ min: -120, max: 140 }),
    capacity: faker.number.int({ min: 50000, max: 2000000 }),
    capacityUnit: "tonnes/year",
  }));
}

function generateImporters(count: number): Importer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `imp-${i + 1}`,
    name: faker.company.name(),
    eoriNumber: pickRandom(EU_COUNTRIES).substring(0, 2).toUpperCase() + faker.string.numeric(12),
    country: pickRandom(EU_COUNTRIES),
    organizationId: "org-1",
  }));
}

function generateSuppliers(count: number, installations: Installation[]): Supplier[] {
  return Array.from({ length: count }, (_, i) => {
    const score = faker.number.int({ min: 20, max: 98 });
    const riskLevel: RiskLevel = score >= 80 ? "low" : score >= 60 ? "medium" : score >= 40 ? "high" : "critical";
    const instCount = faker.number.int({ min: 1, max: 3 });
    const instIds = Array.from({ length: instCount }, () => pickRandom(installations).id);
    return {
      id: `sup-${i + 1}`,
      name: faker.company.name(),
      country: pickRandom(COUNTRIES),
      contactEmail: faker.internet.email(),
      reliabilityScore: score,
      installationIds: [...new Set(instIds)],
      organizationId: "org-1",
      riskLevel,
      lastAuditDate: faker.date.past({ years: 2 }).toISOString(),
      certifications: faker.helpers.arrayElements(CERTIFICATIONS, faker.number.int({ min: 0, max: 4 })),
    };
  });
}

function generateGoods(count: number): DeclaredGood[] {
  return Array.from({ length: count }, (_, i) => {
    const cat = pickRandom(PRODUCT_CATEGORIES);
    const qty = faker.number.int({ min: 100, max: 20000 });
    const directFactor = cat.defaultEmissionFactor * faker.number.float({ min: 0.7, max: 1.3 });
    const direct = Math.round(qty * directFactor);
    const indirect = Math.round(direct * faker.number.float({ min: 0.05, max: 0.25 }));
    return {
      id: `g-${faker.string.nanoid(6)}`,
      cnCode: cat.cnCode,
      description: cat.description,
      quantity: qty,
      unit: cat.unit,
      directEmissions: direct,
      indirectEmissions: indirect,
      carbonPricePaid: faker.number.int({ min: 0, max: Math.round(direct * 20) }),
      countryOfOrigin: pickRandom(COUNTRIES),
    };
  });
}

function generateDeclarations(
  count: number,
  importers: Importer[],
  installations: Installation[],
  suppliers: Supplier[]
): EmissionDeclaration[] {
  const statuses: DeclarationStatus[] = ["draft", "submitted", "verified", "rejected"];
  const periods = ["2023-Q1", "2023-Q2", "2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1"];

  return Array.from({ length: count }, (_, i) => {
    const goods = generateGoods(faker.number.int({ min: 1, max: 4 }));
    const totalEmissions = goods.reduce((s, g) => s + g.directEmissions + g.indirectEmissions, 0);
    const estimatedCost = totalEmissions * faker.number.float({ min: 55, max: 85 });
    const status = pickRandom(statuses);
    const validationErrors: ValidationError[] = [];

    if (status === "rejected") {
      validationErrors.push({
        field: "directEmissions",
        code: "MISSING_DIRECT",
        message: "Direct emission data incomplete for one or more goods",
        severity: "error",
      });
    }
    if (Math.random() > 0.7) {
      validationErrors.push({
        field: "carbonPricePaid",
        code: "UNVERIFIED_PRICE",
        message: "Carbon price paid not verified by third party",
        severity: "warning",
      });
    }

    return {
      id: `dec-${i + 1}`,
      importerId: pickRandom(importers).id,
      installationId: pickRandom(installations).id,
      supplierId: pickRandom(suppliers).id,
      reportingPeriod: pickRandom(periods),
      status,
      goods,
      totalEmissions,
      estimatedCost: Math.round(estimatedCost),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 90 }).toISOString(),
      validationErrors: validationErrors.length ? validationErrors : undefined,
    };
  });
}

function generateCarbonPriceHistory(): CarbonPriceHistory[] {
  const points: CarbonPriceHistory[] = [];
  let price = 45;
  const startDate = new Date("2023-01-01");
  for (let i = 0; i < 120; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i * 7);
    price += faker.number.float({ min: -4, max: 4.5 });
    price = Math.max(30, Math.min(110, price));
    points.push({
      date: d.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      source: d > new Date("2025-01-01") ? "forecast" : "EU_ETS",
    });
  }
  return points;
}

function generateQuarterlyReports(declarations: EmissionDeclaration[]): QuarterlyReport[] {
  const periods = ["2023-Q1", "2023-Q2", "2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4", "2025-Q1"];
  return periods.map((period, i) => {
    const periodDecs = declarations.filter((d) => d.reportingPeriod === period);
    const totalEmissions = periodDecs.reduce((s, d) => s + d.totalEmissions, 0);
    const totalCost = periodDecs.reduce((s, d) => s + d.estimatedCost, 0);

    const bySector: Record<CBAMSector, number> = {
      iron_steel: 0, cement: 0, aluminium: 0, fertilizers: 0, electricity: 0, hydrogen: 0,
    };
    periodDecs.forEach((d) => {
      d.goods.forEach((g) => {
        const cat = PRODUCT_CATEGORIES.find((c) => c.cnCode === g.cnCode);
        if (cat) bySector[cat.sector] += g.directEmissions + g.indirectEmissions;
      });
    });

    return {
      id: `qr-${i + 1}`,
      period,
      year: parseInt(period.split("-")[0]),
      quarter: parseInt(period.split("Q")[1]),
      totalEmissions,
      totalCost: Math.round(totalCost),
      declarationCount: periodDecs.length,
      avgCarbonPrice: faker.number.float({ min: 50, max: 90 }),
      emissionsByCategory: bySector,
      status: i < 7 ? "finalized" as const : "pending" as const,
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    };
  });
}

// ── Generate & export all data ──
const installations = generateInstallations(60);
const importers = generateImporters(40);
const suppliers = generateSuppliers(50, installations);
const declarations = generateDeclarations(350, importers, installations, suppliers);
const quarterlyReports = generateQuarterlyReports(declarations);
const carbonPriceHistory = generateCarbonPriceHistory();

export const generatedData = {
  installations,
  importers,
  suppliers,
  declarations,
  quarterlyReports,
  carbonPriceHistory,
  productCategories: PRODUCT_CATEGORIES,
};

export type GeneratedData = typeof generatedData;
