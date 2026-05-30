export type SignalColor = "green" | "red" | "amber" | "neutral";
export type TrendDirection = "up" | "down" | "flat";

export interface MetricRow {
  monthYear: string;        // "Apr 2026", "May 2026" etc.
  monthDate: Date;
  category: string;         // "Loan Products" | "Risk" | "BL KPI" | "SCF KPI"
  metrics: string;          // "SBL" | "Flow Rate" etc.
  metricName: string;
  currentValue: number | null;
  previousValue: number | null;
}

export interface ParsedMetric {
  metricName: string;
  category: string;
  metrics: string;          // "SBL" | "Flow Rate" etc.
  currentValue: number | null;
  previousValue: number | null;
  currentMonthLabel: string;
  previousMonthLabel: string;
  signal: SignalColor;
  trend: TrendDirection;
  pctChange: number | null;
  formattedCurrent: string;
  formattedPrevious: string;
  unit: string;
  isLowerBetter: boolean;
}

export type SectionId = "loan-products" | "risk" | "kpis" | "income-people";

export interface Section {
  id: SectionId;
  label: string;
  icon: string;
  categories: string[];
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

export interface SelectedMonthData {
  monthLabel: string;
  metrics: ParsedMetric[];
}
