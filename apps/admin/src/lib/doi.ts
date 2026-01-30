/**
 * Generates a DOI in the format: 10.ISUFST.CICT/[YEAR].[SERIAL]
 * Example: 10.ISUFST.CICT/2024.00001
 */
export function generateDOI(year: number, serialNumber: number): string {
  const paddedSerial = serialNumber.toString().padStart(5, "0");
  return `10.ISUFST.CICT/${year}.${paddedSerial}`;
}

/**
 * Parses a DOI to extract year and serial number
 */
export function parseDOI(doi: string): { year: number; serial: number } | null {
  const match = doi.match(/^10\.ISUFST\.CICT\/(\d{4})\.(\d{5})$/);
  if (!match) return null;

  return {
    year: parseInt(match[1]!, 10),
    serial: parseInt(match[2]!, 10),
  };
}

/**
 * Validates if a DOI follows the ICTIRC format
 */
export function isValidDOI(doi: string): boolean {
  return /^10\.ISUFST\.CICT\/\d{4}\.\d{5}$/.test(doi);
}
