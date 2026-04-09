import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.companyProfile.findUnique({
    where: { singletonKey: "default" },
  });

  return NextResponse.json(
    {
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
      address: profile?.address ?? "",
      addressEn: profile?.addressEn,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
