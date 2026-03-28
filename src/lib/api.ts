/**
 * API 클라이언트
 * 개발: Vite proxy → /api/* → http://localhost:8080/api/*
 * 프로덕션: 환경변수 VITE_API_BASE_URL 설정
 */

import { authStorage } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = authStorage.getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    // 토큰 만료 → 로그아웃 처리
    authStorage.removeToken();
    window.location.href = "/login";
    throw new Error("로그인이 필요합니다");
  }

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`[${res.status}] ${path} — ${message}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
