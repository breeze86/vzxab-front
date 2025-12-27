import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 3;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const take = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;

  const [reviews, summary] = await Promise.all([
    prisma.review.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        replies: {
          orderBy: { repliedAt: "asc" },
        },
      },
    }),
    prisma.review.aggregate({
      where: { isDeleted: false },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  return NextResponse.json({
    items: reviews,
    summary: {
      totalCount: summary._count._all,
      averageRating: summary._avg.rating ?? 0,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const content = String(body.content ?? "").trim();
  const rating = Number(body.rating);

  if (!name || !email || !content || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      name,
      email,
      rating,
      content,
    },
    include: {
      replies: true,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
