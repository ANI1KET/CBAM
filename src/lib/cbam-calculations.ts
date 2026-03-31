/**
 * CBAM Cost Estimation & CO2 Equivalent Calculations
 * Based on EU CBAM Regulation (EU) 2023/956
 */

// Emission factors (tCO2/t product) - default values per CN code
export const DEFAULT_EMISSION_FACTORS: Record<string, number> = {
  "7201": 1.6,    // Pig iron
  "7202": 2.1,    // Ferro-alloys
  "7206": 1.85,   // Iron
  "7207": 1.9,    // Semi-finished iron/steel
  "7208": 2.05,   // Flat-rolled iron/steel
  "2523": 0.72,   // Cement
  "2814": 2.3,    // Ammonia
  "3102": 3.1,    // Nitrogen fertilizers
  "7601": 8.4,    // Unwrought aluminium
  "2716": 0.4,    // Electrical energy (tCO2/MWh)
  "2501": 0.05,   // Hydrogen
};

export interface EmissionInput {
  cnCode: string;
  quantity: number; // tonnes
  directEmissions: number; // tCO2
  indirectEmissions: number; // tCO2 (from electricity)
  carbonPricePaid?: number; // EUR - carbon price already paid in country of origin
}

export interface CBAMResult {
  totalEmissions: number; // tCO2e
  specificEmissions: number; // tCO2e/t product
  euCarbonPrice: number; // EUR/tCO2
  grossCost: number; // EUR
  deduction: number; // EUR (for carbon price paid abroad)
  netCost: number; // EUR
  certificatesRequired: number;
}

// EU ETS carbon price (updated periodically)
const DEFAULT_EU_CARBON_PRICE = 65; // EUR/tCO2 - approximate

/**
 * Calculate CO2 equivalent including GWP factors
 */
export function calculateCO2Equivalent(
  co2: number,
  n2o: number = 0,
  pfc: number = 0
): number {
  const GWP_N2O = 265; // AR5 value
  const GWP_CF4 = 6630;
  return co2 + n2o * GWP_N2O + pfc * GWP_CF4;
}

/**
 * Calculate specific embedded emissions per tonne of product
 */
export function calculateSpecificEmissions(
  totalEmissions: number,
  productionQuantity: number
): number {
  if (productionQuantity <= 0) return 0;
  return totalEmissions / productionQuantity;
}

/**
 * Calculate CBAM cost estimate for an import
 */
export function calculateCBAMCost(
  input: EmissionInput,
  euCarbonPrice: number = DEFAULT_EU_CARBON_PRICE
): CBAMResult {
  const totalEmissions = input.directEmissions + input.indirectEmissions;
  const specificEmissions = calculateSpecificEmissions(totalEmissions, input.quantity);
  const grossCost = totalEmissions * euCarbonPrice;
  const deduction = input.carbonPricePaid ?? 0;
  const netCost = Math.max(0, grossCost - deduction);
  const certificatesRequired = Math.ceil(totalEmissions);

  return {
    totalEmissions,
    specificEmissions,
    euCarbonPrice,
    grossCost,
    deduction,
    netCost,
    certificatesRequired,
  };
}

/**
 * Estimate emissions using default factors when actual data unavailable
 */
export function estimateEmissions(cnCode: string, quantity: number): number {
  const factor = DEFAULT_EMISSION_FACTORS[cnCode] ?? 1.0;
  return quantity * factor;
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format emissions for display
 */
export function formatEmissions(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k tCO₂e`;
  }
  return `${value.toFixed(1)} tCO₂e`;
}
