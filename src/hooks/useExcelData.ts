import { useState, useCallback, useMemo } from "react";
import type { MetricRow } from "../types";
import { getAvailableMonths, getRowsByMonth } from "../utils/excelParser";
import iiflData from "../data/iiflData.json";

// Map JSON objects back to TypeScript MetricRow instances with valid JS Dates
const parsedRows: MetricRow[] = (iiflData as any[]).map((r) => ({
  ...r,
  monthDate: new Date(r.monthDate),
}));

interface UseExcelDataReturn {
  allRows: MetricRow[];
  availableMonths: string[];
  selectedMonth: string | null;
  rowsForMonth: MetricRow[];
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  loadDefaultData: () => Promise<void>;
  setSelectedMonth: (month: string) => void;
}

export function useExcelData(): UseExcelDataReturn {
  const availableMonths = useMemo(() => {
    return getAvailableMonths(parsedRows);
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(() => {
    return availableMonths[0] ?? null;
  });

  const rowsForMonth = useMemo(() => {
    return selectedMonth ? getRowsByMonth(parsedRows, selectedMonth) : [];
  }, [selectedMonth, availableMonths]);

  const loadDefaultData = useCallback(async () => {
    // No-op as data is loaded synchronously
  }, []);

  return {
    allRows: parsedRows,
    availableMonths,
    selectedMonth,
    rowsForMonth,
    fileName: "iiflData.json",
    isLoading: false,
    error: null,
    loadDefaultData,
    setSelectedMonth,
  };
}
