// src/services/api.ts
// Web port of the React Native api.ts — same shape, swapping AsyncStorage for localStorage.

const BASE_URL = "https://expense-backend-53424889866.asia-south1.run.app/api";

const TOKEN_KEY = "auth_token";

export const setToken = async (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  localStorage.removeItem(TOKEN_KEY);
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  auth?: boolean; // whether to attach JWT
};

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}