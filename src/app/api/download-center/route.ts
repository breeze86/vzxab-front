import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.downloadCenterItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return NextResponse.json(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      nameEn: item.nameEn,
      fileUrl: "/api/download-center/" + item.id + "/file",
      fileUrlEn: item.downloadUrlEn,
      actionType: item.actionType.toLowerCase(),
      fileType: item.fileType,
      fileSize: item.fileSize,
    })),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
