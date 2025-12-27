import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/adminSession";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = String(body.account ?? "").trim();
  const passwordDigest = String(body.passwordDigest ?? "").trim().toLowerCase();

  if (!username || !passwordDigest) {
    return NextResponse.json(
      { error: "Missing credentials" },
      { status: 400 }
    );
  }

  if (!/^[a-f0-9]{64}$/.test(passwordDigest)) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !admin.isActive) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (passwordDigest !== admin.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { token, expiresAt } = await createAdminSession(admin.id);
  const response = NextResponse.json({
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
    token,
    expiresAt,
  });

  return response;
}
