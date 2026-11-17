import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-token";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  if (req.headers.get("accept")?.includes("text/html")) {
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }
  return Response.json({ ok: true });
}
