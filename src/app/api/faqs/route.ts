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
      questionEn: item.questionEn,
      answer: item.answer,
      answerEn: item.answerEn,
    })),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
