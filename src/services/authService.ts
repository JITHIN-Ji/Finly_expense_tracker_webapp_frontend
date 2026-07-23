// src/services/authService.ts
import { apiRequest, setToken, removeToken } from "./api";

export async function registerUser(name: string, email: string, password: string) {
  const res = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
  await setToken(res.data.token);
  return res.data.user;
}

export async function loginUser(email: string, password: string) {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  await setToken(res.data.token);
  return res.data.user;
}

export async function getCurrentUser() {
  const res = await apiRequest("/auth/me", { method: "GET" });
  return res.data.user;
}

export async function updateUserCurrency(currency: string) {
  const user = await getCurrentUser();
  const res = await apiRequest("/auth/profile", {
    method: "PUT",
    body: {
      name: user.name,
      avatar: user.avatar,
      preferences: { ...user.preferences, currency },
    },
  });
  return res.data.user;
}

export async function logoutUser() {
  await removeToken();
}

export async function updateProfile(name: string, avatar?: string) {
  const user = await getCurrentUser();
  const res = await apiRequest("/auth/profile", {
    method: "PUT",
    body: {
      name,
      avatar: avatar || user.avatar,
      preferences: user.preferences,
    },
  });
  return res.data.user;
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const res = await apiRequest("/auth/change-password", {
    method: "PUT",
    body: { currentPassword, newPassword },
  });
  return res;
}

export async function completeOnboarding(occupation: string, budgetNotifications: boolean) {
  const user = await getCurrentUser();
  const res = await apiRequest("/auth/profile", {
    method: "PUT",
    body: {
      name: user.name,
      avatar: user.avatar,
      occupation,
      preferences: {
        ...user.preferences,
        budgetNotifications,
        onboardingCompleted: true,
      },
    },
  });
  return res.data.user;
}