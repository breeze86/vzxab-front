import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";
const SESSION_DAYS = 7;

export const createAdminSession = async (adminId: number) => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: {
      adminId,
      token,
      expiresAt,
    },
  });

  return { token, expiresAt };
};

export const getTokenFromRequest = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }
  return null;
};

export const getAdminFromRequest = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session || !session.admin.isActive) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    return null;
  }

  return session.admin;
};

export const revokeAdminSession = async (token: string | undefined) => {
  if (!token) {
    return;
  }
  await prisma.adminSession.deleteMany({ where: { token } });
};
