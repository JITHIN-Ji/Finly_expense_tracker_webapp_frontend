// src/services/financeService.ts
import { apiRequest } from "./api";

export async function getFinanceSummary(period: "day" | "week" | "month" | "year" | "all" = "month") {
  const res = await apiRequest(`/finance/summary?period=${period}`, { method: "GET" });
  return res.data;
}

export async function getFinanceTransactions(period?: "day" | "week" | "month" | "year" | "all") {
  const query = period ? `?period=${period}` : "";
  const res = await apiRequest(`/finance/transactions${query}`, { method: "GET" });
  return res.data.transactions;
}

export async function getIncome(month?: string) {
  const query = month ? `?month=${month}` : "";
  const res = await apiRequest(`/finance/income${query}`, { method: "GET" });
  return res.data; // { income, month, hasIncome }
}

export async function getYearlyIncome(year?: string) {
  const query = year ? `?year=${year}` : "";
  const res = await apiRequest(`/finance/income/year${query}`, { method: "GET" });
  return res.data;
}

export async function setIncome(amount: number, month?: string) {
  const res = await apiRequest("/finance/income", {
    method: "POST",
    body: month ? { amount, month } : { amount },
  });
  return res.data;
}

export async function getInsights() {
  const res = await apiRequest("/finance/insights", { method: "GET" });
  return res.data;
}