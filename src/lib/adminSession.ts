import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "coolflow_admin_session";
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

export const getAdminFromRequest = async (request: NextRequest) => {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: { token: cookie },
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
