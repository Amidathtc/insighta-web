import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const WEB_PORTAL_URL =
  process.env.WEB_PORTAL_URL || process.env.NEXT_PUBLIC_WEB_PORTAL_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");

  if (!code || !returnedState) {
    return NextResponse.redirect(new URL("/?error=missing_code_or_state", request.url));
  }

  // Read bundled auth session
  const authSessionStr = request.cookies.get("auth_session")?.value;
  let storedState: string | undefined;
  let codeVerifier: string | undefined;

  if (authSessionStr) {
    try {
      const parsed = JSON.parse(authSessionStr);
      storedState = parsed.state;
      codeVerifier = parsed.codeVerifier;
    } catch {
      // Ignore parse errors
    }
  }

  if (!storedState) {
    return NextResponse.redirect(new URL("/?error=missing_auth_session", request.url));
  }

  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/?error=missing_pkce_verifier", request.url));
  }

  if (returnedState !== storedState) {
    return NextResponse.redirect(new URL("/?error=state_mismatch", request.url));
  }

  try {
    const cleanWebUrl = WEB_PORTAL_URL.replace(/\/$/, "");
    const redirectUri = `${cleanWebUrl}/api/auth/callback`;

    // Exchange code with the backend — mode=web tells backend to return JSON
    // (instead of redirecting). We also pass the redirect_uri so GitHub can
    // verify it matches the one used in the authorization request.
    const params = new URLSearchParams({
      code,
      state: returnedState || "",
      code_verifier: codeVerifier || "",
      mode: "web",
      redirect_uri: redirectUri,
    });

    const backendRes = await fetch(
      `${BACKEND_URL}/auth/github/callback?${params.toString()}`,
      { method: "GET" }
    );

    const body = await backendRes.json().catch(() => null);

    if (!body || body.status !== "success") {
      const msg = body?.message ?? "auth_failed";
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(msg)}`, request.url)
      );
    }

    const { access_token, refresh_token } = body;
    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    const cookieOpts = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      maxAge: 600,
      path: "/",
    };

    response.cookies.set("access_token", access_token, {
      ...cookieOpts,
      maxAge: 180, // 3 minutes
    });
    response.cookies.set("refresh_token", refresh_token, {
      ...cookieOpts,
      maxAge: 300, // 5 minutes
    });

    // Clear auth session cookie
    response.cookies.delete("auth_session");

    return response;
  } catch (err: any) {
    console.error("OAuth callback error:", err?.message);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
