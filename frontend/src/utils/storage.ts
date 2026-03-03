// src/utils/storage.ts

export type UserRole = "ADMIN" | "USER";

/**
 * TOKEN
 */
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

/**
 * ROLE
 */
export const setUserRole = (role: UserRole) => {
  localStorage.setItem("role", role);
};

export const getUserRole = (): UserRole | null => {
  const role = localStorage.getItem("role");
  return role as UserRole | null;
};

export const removeUserRole = () => {
  localStorage.removeItem("role");
};