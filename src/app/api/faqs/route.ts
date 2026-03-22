import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return NextResponse.json(
    items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
