// src/services/chatService.ts
import { apiRequest } from "./api";

export async function sendChatMessage(message: string, currency?: string) {
  const res = await apiRequest("/chat/process", {
    method: "POST",
    body: { message, currency },
  });
  return res.data;
}

export async function logExpenseDirect(payload: {
  item: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  date: string; // YYYY-MM-DD
}) {
  const res = await apiRequest("/finance/expense", {
    method: "POST",
    body: payload,
  });
  return res.data;
}