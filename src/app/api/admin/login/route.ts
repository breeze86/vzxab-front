import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { verifyPassword } from "@/lib/passwords";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = String(body.account ?? "").trim();
  const password = String(body.password ?? "").trim();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Missing credentials" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !admin.isActive) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { token, expiresAt } = await createAdminSession(admin.id);
  const response = NextResponse.json({
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });

  return response;
}
