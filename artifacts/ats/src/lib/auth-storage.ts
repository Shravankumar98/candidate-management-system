export const AUTH_TOKEN_KEY = "ats.token";
export const AUTH_USER_KEY = "ats.user";

export function getStoredAuthToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuthToken(token: string | null): void {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  window.dispatchEvent(new Event("auth:change"));
}

export function getStoredAuthUser<T = unknown>(): T | null {
  const stored = window.localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

export function setStoredAuthUser(user: unknown): void {
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function clearStoredAuth(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event("auth:change"));
}

export function buildApiUrl(path: string): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  const base = basePath
    ? `${basePath}/${normalizedPath}`
    : `/${normalizedPath}`;
  return new URL(base, window.location.origin).toString();
}
