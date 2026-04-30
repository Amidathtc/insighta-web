// Shared server-side API helper — reads tokens from cookies
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export interface ApiUser {
  id: string;
  github_id: string;
  username: string;
  email: string;
  avatar_url: string;
  role: "admin" | "analyst";
}

export async function getServerUser(): Promise<ApiUser | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/auth/whoami`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as ApiUser;
  } catch {
    return null;
  }
}

export async function serverFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Version": "1",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });
}

export { BACKEND_URL };
