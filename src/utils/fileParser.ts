import type { ParsedFileRow } from "../types/import";
import type { ParseResult } from "papaparse";

export async function parseImportFile(file: File): Promise<ParsedFileRow[]> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCsvFile(file);
  }

  if (extension === "xlsx" || extension === "xls") {
    return parseExcelFile(file);
  }

  throw new Error("Unsupported file format");
}

function parseCsvFile(file: File) {
  return new Promise<ParsedFileRow[]>((resolve, reject) => {
    import("papaparse").then(({ default: Papa }) =>
    Papa.parse<ParsedFileRow>(file, {
      header: true,
      skipEmptyLines: false,
      complete: (results: ParseResult<ParsedFileRow>) => resolve(results.data ?? []),
      error: (error: Error) => reject(error),
      }),
    );
  });
}

async function parseExcelFile(file: File) {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<ParsedFileRow>(worksheet, {
    defval: "",
    raw: false,
  });
}
