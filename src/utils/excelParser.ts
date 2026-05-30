import * as XLSX from "xlsx";
import type { MetricRow } from "../types";

// Convert Excel serial date number to JS Date
function excelSerialToDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

function parseMonthLabel(val: unknown): { date: Date; label: string } | null {
  if (!val) return null;

  // Already a JS Date (openpyxl-parsed)
  if (val instanceof Date) {
    const padded = new Date(val.getTime() + 12 * 60 * 60 * 1000);
    return {
      date: padded,
      label: padded.toLocaleString("en-IN", { month: "short", year: "numeric" }),
    };
  }

  // Excel date serial number
  if (typeof val === "number" && val > 40000 && val < 60000) {
    const d = excelSerialToDate(val);
    const padded = new Date(d.getTime() + 12 * 60 * 60 * 1000);
    return {
      date: padded,
      label: padded.toLocaleString("en-IN", { month: "short", year: "numeric" }),
    };
  }

  // String like "Apr 2026" or "2026-04-01"
  if (typeof val === "string") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const padded = new Date(d.getTime() + 12 * 60 * 60 * 1000);
      return {
        date: padded,
        label: padded.toLocaleString("en-IN", { month: "short", year: "numeric" }),
      };
    }
  }

  return null;
}

export function parseExcelFile(buffer: ArrayBuffer): MetricRow[] {
  const data = new Uint8Array(buffer);
  const wb = XLSX.read(data, { type: "array", cellDates: true });

  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    raw: false,
    dateNF: "yyyy-mm-dd",
  });

  // Find header row
  const headerIdx = (raw as unknown[][]).findIndex((r) =>
    r.some((v) => String(v).toLowerCase().includes("category"))
  );
  if (headerIdx === -1) throw new Error("Could not find header row");

  const headerRow = raw[headerIdx] as string[];
  const colIdx = {
    month: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("month")
    ),
    category: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("category")
    ),
    metrics: headerRow.findIndex((h) =>
      String(h).toLowerCase().trim() === "metrics"
    ),
    metric: headerRow.findIndex((h) => {
      const lower = String(h).toLowerCase().trim();
      return (lower.includes("metric name") || lower.includes("metric_name")) ||
             (lower.includes("metric") && lower !== "metrics");
    }),
    current: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("current")
    ),
    previous: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("previous")
    ),
  };

  const rows: MetricRow[] = [];

  // Also re-read with raw:true to get serial numbers
  const rawNums = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    raw: true,
  });

  for (let i = headerIdx + 1; i < rawNums.length; i++) {
    const r = rawNums[i] as unknown[];
    if (!r || (!r[colIdx.category] && !r[colIdx.metric])) continue;

    const monthRaw = r[colIdx.month];
    const parsed = parseMonthLabel(monthRaw);
    if (!parsed) continue;

    const currentRaw = r[colIdx.current];
    const previousRaw = r[colIdx.previous];

    const metricsVal = colIdx.metrics !== -1 && r[colIdx.metrics]
      ? String(r[colIdx.metrics]).trim()
      : String(r[colIdx.category] ?? "").trim();

    rows.push({
      monthYear: parsed.label,
      monthDate: parsed.date,
      category: String(r[colIdx.category] ?? "").trim(),
      metrics: metricsVal,
      metricName: String(r[colIdx.metric] ?? "").trim(),
      currentValue:
        currentRaw !== undefined && currentRaw !== "" && currentRaw !== null
          ? Number(currentRaw)
          : null,
      previousValue:
        previousRaw !== undefined && previousRaw !== "" && previousRaw !== null
          ? Number(previousRaw)
          : null,
    });
  }

  return rows;
}

export function getAvailableMonths(rows: MetricRow[]): string[] {
  const seen = new Set<string>();
  const months: { label: string; date: Date }[] = [];
  for (const r of rows) {
    if (!seen.has(r.monthYear)) {
      seen.add(r.monthYear);
      months.push({ label: r.monthYear, date: r.monthDate });
    }
  }
  months.sort((a, b) => b.date.getTime() - a.date.getTime());
  return months.map((m) => m.label);
}

export function getRowsByMonth(
  rows: MetricRow[],
  monthLabel: string
): MetricRow[] {
  return rows.filter((r) => r.monthYear === monthLabel);
}
