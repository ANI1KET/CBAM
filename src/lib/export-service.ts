import * as XLSX from "xlsx";
import type { EmissionDeclaration, DeclaredGood } from "./types";
import { generatedData } from "./mock-generator";
import { formatCurrency } from "./cbam-calculations";

export function exportDeclarationsToExcel(declarations: EmissionDeclaration[], filename = "cbam-declarations.xlsx") {
  const importerMap = Object.fromEntries(generatedData.importers.map((i) => [i.id, i]));
  const installationMap = Object.fromEntries(generatedData.installations.map((i) => [i.id, i]));

  // Declarations sheet
  const decRows = declarations.map((d) => ({
    "Declaration ID": d.id,
    "Reporting Period": d.reportingPeriod,
    Status: d.status.toUpperCase(),
    Importer: importerMap[d.importerId]?.name ?? d.importerId,
    "Importer EORI": importerMap[d.importerId]?.eoriNumber ?? "",
    Installation: installationMap[d.installationId]?.name ?? d.installationId,
    Country: installationMap[d.installationId]?.country ?? "",
    "Total Emissions (tCO₂e)": d.totalEmissions,
    "Estimated Cost (EUR)": d.estimatedCost,
    "# Goods": d.goods.length,
    "Created At": d.createdAt.split("T")[0],
    "Updated At": d.updatedAt.split("T")[0],
  }));

  // Goods sheet
  const goodRows: Record<string, unknown>[] = [];
  declarations.forEach((d) => {
    d.goods.forEach((g) => {
      goodRows.push({
        "Declaration ID": d.id,
        "CN Code": g.cnCode,
        Description: g.description,
        Quantity: g.quantity,
        Unit: g.unit,
        "Direct Emissions (tCO₂)": g.directEmissions,
        "Indirect Emissions (tCO₂)": g.indirectEmissions,
        "Total Emissions (tCO₂e)": g.directEmissions + g.indirectEmissions,
        "Carbon Price Paid (EUR)": g.carbonPricePaid,
        "Country of Origin": g.countryOfOrigin,
      });
    });
  });

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(decRows);
  const ws2 = XLSX.utils.json_to_sheet(goodRows);

  // Set column widths
  ws1["!cols"] = Object.keys(decRows[0] || {}).map(() => ({ wch: 20 }));
  ws2["!cols"] = Object.keys(goodRows[0] || {}).map(() => ({ wch: 18 }));

  XLSX.utils.book_append_sheet(wb, ws1, "Declarations");
  XLSX.utils.book_append_sheet(wb, ws2, "Declared Goods");

  XLSX.writeFile(wb, filename);
}

export function exportToXML(declarations: EmissionDeclaration[]): string {
  const importerMap = Object.fromEntries(generatedData.importers.map((i) => [i.id, i]));
  const installationMap = Object.fromEntries(generatedData.installations.map((i) => [i.id, i]));

  const escXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<CBAMReport xmlns="urn:eu:cbam:report:v1">\n`;

  declarations.forEach((d) => {
    const imp = importerMap[d.importerId];
    const inst = installationMap[d.installationId];
    xml += `  <Declaration id="${d.id}" period="${d.reportingPeriod}" status="${d.status}">\n`;
    xml += `    <Importer name="${escXml(imp?.name ?? "")}" eori="${imp?.eoriNumber ?? ""}" />\n`;
    xml += `    <Installation name="${escXml(inst?.name ?? "")}" country="${inst?.country ?? ""}" unLocode="${inst?.unLocode ?? ""}" />\n`;
    xml += `    <Goods>\n`;
    d.goods.forEach((g) => {
      xml += `      <Good cnCode="${g.cnCode}" quantity="${g.quantity}" unit="${g.unit}">\n`;
      xml += `        <DirectEmissions>${g.directEmissions}</DirectEmissions>\n`;
      xml += `        <IndirectEmissions>${g.indirectEmissions}</IndirectEmissions>\n`;
      xml += `        <CarbonPricePaid currency="EUR">${g.carbonPricePaid}</CarbonPricePaid>\n`;
      xml += `        <CountryOfOrigin>${g.countryOfOrigin}</CountryOfOrigin>\n`;
      xml += `      </Good>\n`;
    });
    xml += `    </Goods>\n`;
    xml += `    <TotalEmissions>${d.totalEmissions}</TotalEmissions>\n`;
    xml += `    <EstimatedCost currency="EUR">${d.estimatedCost}</EstimatedCost>\n`;
    xml += `  </Declaration>\n`;
  });

  xml += `</CBAMReport>`;
  return xml;
}

export function downloadXML(declarations: EmissionDeclaration[], filename = "cbam-report.xml") {
  const xml = exportToXML(declarations);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
