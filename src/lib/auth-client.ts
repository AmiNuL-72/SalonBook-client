import { createAuthClient } from "better-auth/react";

const formatUrl = (url?: string): string => {
  if (!url) return "http://localhost:3000";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getClientBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const rawUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return formatUrl(rawUrl);
};

export const authClient = createAuthClient({
  baseURL: getClientBaseUrl(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
