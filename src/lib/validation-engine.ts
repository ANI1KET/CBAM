import type { EmissionDeclaration, DeclaredGood, ValidationError } from "./types";
import { PRODUCT_CATEGORIES } from "./mock-generator";

type Rule = (dec: EmissionDeclaration) => ValidationError[];

const rules: Rule[] = [
  // Missing direct emissions
  (dec) =>
    dec.goods
      .filter((g) => g.directEmissions <= 0)
      .map((g) => ({
        field: `goods.${g.id}.directEmissions`,
        code: "MISSING_DIRECT_EMISSIONS",
        message: `Good "${g.description}" (CN ${g.cnCode}) has no direct emissions reported`,
        severity: "error" as const,
      })),

  // Missing indirect emissions check
  (dec) =>
    dec.goods
      .filter((g) => g.indirectEmissions < 0)
      .map((g) => ({
        field: `goods.${g.id}.indirectEmissions`,
        code: "NEGATIVE_INDIRECT_EMISSIONS",
        message: `Good "${g.description}" has negative indirect emissions`,
        severity: "error" as const,
      })),

  // Invalid CN code
  (dec) =>
    dec.goods
      .filter((g) => !PRODUCT_CATEGORIES.some((c) => c.cnCode === g.cnCode))
      .map((g) => ({
        field: `goods.${g.id}.cnCode`,
        code: "INVALID_CN_CODE",
        message: `CN Code "${g.cnCode}" is not a recognized CBAM product category`,
        severity: "error" as const,
      })),

  // Zero quantity
  (dec) =>
    dec.goods
      .filter((g) => g.quantity <= 0)
      .map((g) => ({
        field: `goods.${g.id}.quantity`,
        code: "ZERO_QUANTITY",
        message: `Good "${g.description}" has zero or negative quantity`,
        severity: "error" as const,
      })),

  // Unusually high specific emissions
  (dec) =>
    dec.goods
      .filter((g) => {
        const cat = PRODUCT_CATEGORIES.find((c) => c.cnCode === g.cnCode);
        if (!cat || g.quantity <= 0) return false;
        const specific = (g.directEmissions + g.indirectEmissions) / g.quantity;
        return specific > cat.defaultEmissionFactor * 3;
      })
      .map((g) => ({
        field: `goods.${g.id}.directEmissions`,
        code: "HIGH_SPECIFIC_EMISSIONS",
        message: `Specific emissions for "${g.description}" are unusually high (>3x default factor)`,
        severity: "warning" as const,
      })),

  // Carbon price exceeds gross cost
  (dec) =>
    dec.goods
      .filter((g) => g.carbonPricePaid > (g.directEmissions + g.indirectEmissions) * 100)
      .map((g) => ({
        field: `goods.${g.id}.carbonPricePaid`,
        code: "CARBON_PRICE_EXCEEDS_COST",
        message: `Carbon price paid for "${g.description}" exceeds estimated gross CBAM cost`,
        severity: "warning" as const,
      })),

  // Missing reporting period
  (dec) => {
    if (!dec.reportingPeriod || !/^\d{4}-Q[1-4]$/.test(dec.reportingPeriod)) {
      return [{ field: "reportingPeriod", code: "INVALID_PERIOD", message: "Reporting period must be in YYYY-QN format", severity: "error" as const }];
    }
    return [];
  },

  // No goods declared
  (dec) => {
    if (!dec.goods.length) {
      return [{ field: "goods", code: "NO_GOODS", message: "Declaration must include at least one declared good", severity: "error" as const }];
    }
    return [];
  },
];

export function validateDeclaration(dec: EmissionDeclaration): ValidationError[] {
  return rules.flatMap((rule) => rule(dec));
}

export function getValidationSummary(declarations: EmissionDeclaration[]) {
  let totalErrors = 0;
  let totalWarnings = 0;
  const errorsByCode: Record<string, number> = {};

  declarations.forEach((dec) => {
    const errors = validateDeclaration(dec);
    errors.forEach((e) => {
      if (e.severity === "error") totalErrors++;
      else totalWarnings++;
      errorsByCode[e.code] = (errorsByCode[e.code] || 0) + 1;
    });
  });

  return { totalErrors, totalWarnings, errorsByCode, totalDeclarations: declarations.length };
}
