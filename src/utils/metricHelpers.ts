import type { MetricRow, ParsedMetric, SignalColor, TrendDirection } from "../types";

// Metrics where LOWER value = BETTER outcome
const LOWER_BETTER_METRICS = new Set([
  "Roll Forward%",
  "B.1-30 DPD %",
  "C.31-60 DPD %",
  "D.61-90 DPD %",
  "E.90+ DPD %",
  "PL Bounce%",
  "BL Bounce%",
]);

// Metrics displayed as plain percent (value already in %)
const PLAIN_PERCENT = new Set([
  "Wt LTV%",
  "CIBIL 750+ Share%",
  "Wt ROI%",
  "% Total AUM",
  "Roll Back (Stab)%",
  "Roll Forward%",
  "A.0 DPD %",
  "B.1-30 DPD %",
  "C.31-60 DPD %",
  "D.61-90 DPD %",
  "E.90+ DPD %",
  "PL Bounce%",
  "BL Bounce%",
  "Yield Vendor SCF",
  "Yield Xtracap",
  "Wt ROI (Jan'26)",
  "PF% (Jan'26)",
]);

const CR_METRICS = new Set([
  "Disb Amt (Cr)",
  "Closing AUM (Cr)",
  "Disbursement",
  "Disb",
  "CGTMSE & CGFMU Total POS (Cr)",
  "Xtracap",
]);

const COUNT_METRICS = new Set([
  "Total Unique Disb",
  "Tranch Disb Count",
  "CGTMSE & CGFMU Total Count",
  "CGTMSE Eligible",
]);

const LAKH_METRICS = new Set(["ATS (Jan'26)"]);

export function getUnit(metricName: string): string {
  if (PLAIN_PERCENT.has(metricName)) return "%";
  if (CR_METRICS.has(metricName)) return "Cr";
  if (COUNT_METRICS.has(metricName)) return "";
  if (LAKH_METRICS.has(metricName)) return "L";
  return "";
}

export function formatValue(value: number | null, metricName: string): string {
  if (value === null || value === undefined || isNaN(value)) return "—";

  if (PLAIN_PERCENT.has(metricName)) {
    return value.toFixed(2) + "%";
  }
  if (CR_METRICS.has(metricName)) {
    return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Cr";
  }
  if (COUNT_METRICS.has(metricName)) {
    return value.toLocaleString("en-IN");
  }
  if (LAKH_METRICS.has(metricName)) {
    return "₹" + value.toFixed(2) + "L";
  }
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function computeSignal(
  metricName: string,
  current: number | null,
  previous: number | null
): SignalColor {
  const pctChange = computePctChange(current, previous);
  if (pctChange === null) return "neutral";

  const isLower = LOWER_BETTER_METRICS.has(metricName);

  if (isLower) {
    if (pctChange < -1) return "green";
    if (pctChange > 1) return "red";
    return "amber";
  } else {
    if (pctChange > 1) return "green";
    if (pctChange < -1) return "red";
    return "amber";
  }
}

export function computeTrend(
  current: number | null,
  previous: number | null
): TrendDirection {
  if (current === null || previous === null) return "flat";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

export function computePctChange(
  current: number | null,
  previous: number | null
): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatPctChange(pct: number | null): string {
  if (pct === null) return "—";
  const sign = pct > 0 ? "+" : "";
  return sign + pct.toFixed(1) + "%";
}

export function buildParsedMetrics(
  rows: MetricRow[],
  allRows: MetricRow[] = []
): ParsedMetric[] {
  return rows.map((r) => {
    let previousValue: number | null = null;
    let previousMonthLabel = "Prev Month";

    if (allRows.length > 0 && r.monthDate) {
      const targetDate = new Date(r.monthDate.getTime());
      targetDate.setMonth(targetDate.getMonth() - 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      const previousRow = allRows.find(
        (item) =>
          item.metricName === r.metricName &&
          item.category === r.category &&
          item.metrics === r.metrics &&
          item.monthDate.getFullYear() === targetYear &&
          item.monthDate.getMonth() === targetMonth
      );

      if (previousRow) {
        previousValue = previousRow.currentValue;
        previousMonthLabel = previousRow.monthYear;
      }
    } else {
      previousValue = r.previousValue;
    }

    const signal = computeSignal(r.metricName, r.currentValue, previousValue);
    const trend = computeTrend(r.currentValue, previousValue);
    const pctChange = computePctChange(r.currentValue, previousValue);
    const isLowerBetter = LOWER_BETTER_METRICS.has(r.metricName);

    return {
      metricName: r.metricName,
      category: r.category,
      metrics: r.metrics,
      currentValue: r.currentValue,
      previousValue,
      currentMonthLabel: r.monthYear,
      previousMonthLabel,
      signal,
      trend,
      pctChange,
      formattedCurrent: formatValue(r.currentValue, r.metricName),
      formattedPrevious: formatValue(previousValue, r.metricName),
      unit: getUnit(r.metricName),
      isLowerBetter,
    };
  });
}
