import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// The web portal goes DIRECTLY to GitHub OAuth — not through the backend.
// This ensures GitHub redirects back to the WEB PORTAL, allowing us to
// set HTTP-only cookies on the web portal's own domain.
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const WEB_PORTAL_URL =
  process.env.WEB_PORTAL_URL || process.env.NEXT_PUBLIC_WEB_PORTAL_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // const redirectUri = `${WEB_PORTAL_URL}/api/auth/callback`;
  const redirectUri = `${WEB_PORTAL_URL.replace(/\/$/, '')}/api/auth/callback`;

  const githubUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("read:user user:email")}` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${encodeURIComponent(codeChallenge)}` +
    `&code_challenge_method=S256`;

  const cookieOpts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };

  const response = NextResponse.redirect(githubUrl);
  // Bundle both into one cookie to avoid multi-cookie redirect issues
  response.cookies.set("auth_session", JSON.stringify({ state, codeVerifier }), cookieOpts);

  return response;
}
