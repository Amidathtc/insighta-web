import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // Forward query params
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams(searchParams);

  const backendRes = await fetch(
    `${BACKEND_URL}/api/profiles/export?${params.toString()}`,
    {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "X-API-Version": "1",
      },
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json({ error: "Export failed" }, { status: backendRes.status });
  }

  const csv = await backendRes.text();
  const disposition = backendRes.headers.get("content-disposition") || 
    `attachment; filename="profiles_${Date.now()}.csv"`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": disposition,
    },
  });
}
