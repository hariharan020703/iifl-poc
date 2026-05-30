import type { Section } from "../types";

export const SECTIONS: Section[] = [
  {
    id: "loan-products",
    label: "Loan Products",
    icon: "",
    categories: ["Loan Products"],
    accentColor: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  {
    id: "risk",
    label: "Risk",
    icon: "",
    categories: ["Risk"],
    accentColor: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  {
    id: "kpis",
    label: "KPIs",
    icon: "",
    categories: ["BL KPI", "SCF KPI"],
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
];

// Category → accent color map
export const CATEGORY_COLORS: Record<string, string> = {
  "Loan Products": "#2563EB",
  Risk:            "#DC2626",
  "BL KPI":        "#7C3AED",
  "SCF KPI":       "#6366F1",
  "Other Income":  "#059669",
  "HR Data":       "#0369A1",
};
