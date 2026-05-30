import { useState, useCallback, useEffect } from "react";
import type { MetricRow } from "../types";
import { parseExcelFile, getAvailableMonths, getRowsByMonth } from "../utils/excelParser";

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
  const [allRows, setAllRows] = useState<MetricRow[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDefaultData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/IIFL-DLR Data.xlsx");
      if (!response.ok) {
        throw new Error(`Failed to fetch IIFL-DLR Data.xlsx: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      const rows = parseExcelFile(buffer);
      const months = getAvailableMonths(rows);

      setAllRows(rows);
      setAvailableMonths(months);
      setSelectedMonth(months[0] ?? null);
      setFileName("IIFL-DLR Data.xlsx");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load direct excel data."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDefaultData();
  }, [loadDefaultData]);

  const rowsForMonth = selectedMonth
    ? getRowsByMonth(allRows, selectedMonth)
    : [];

  return {
    allRows,
    availableMonths,
    selectedMonth,
    rowsForMonth,
    fileName,
    isLoading,
    error,
    loadDefaultData,
    setSelectedMonth,
  };
}
