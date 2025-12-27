import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const reviewId = Number(params.id);
  if (!Number.isInteger(reviewId)) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const adminName = String(body.adminName ?? "").trim();
  const content = String(body.content ?? "").trim();

  if (!adminName || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const reply = await prisma.reviewReply.create({
    data: {
      reviewId,
      adminName,
      content,
    },
  });

  return NextResponse.json(reply, { status: 201 });
}
