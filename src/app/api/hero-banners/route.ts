import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const banners = await prisma.heroBanner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const data = banners.map((item) => ({
    id: String(item.id),
    title: item.title,
    summary: item.summary,
    mediaType: item.mediaType === "VIDEO" ? "video" : "image",
    videoPlayMode: item.videoPlayMode === "AUTO" ? "auto" : "hover",
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    videoPosterUrl: item.videoPosterUrl,
    linkUrl: item.linkUrl,
  }));

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
