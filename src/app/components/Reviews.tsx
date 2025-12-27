"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, MessageCircle, Send, Star, User } from "lucide-react";
import { reviews as seedReviews } from "../content";

type ReviewReply = {
  id?: number;
  adminName: string;
  content: string;
  repliedAt: string;
};

type ReviewItem = {
  id?: number;
  name: string;
  email: string;
  rating: number;
  content: string;
  createdAt: string;
  replies?: ReviewReply[];
};

type ReviewSummary = {
  totalCount: number;
  averageRating: number;
};

const maskEmail = (email: string) => {
  const [user, domain] = email.split("@");
  if (!domain) {
    return email;
  }
  if (user.length <= 2) {
    return `${user[0]}***@${domain}`;
  }
  return `${user.slice(0, 2)}***@${domain}`;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
};

const mapSeedReviews = (): ReviewItem[] =>
  seedReviews.map((review, index) => ({
    id: index + 1,
    name: review.name,
    email: review.email,
    rating: review.rating,
    content: review.text,
    createdAt: review.date,
    replies: review.reply
      ? [
          {
            adminName: "管理员",
            repliedAt: review.reply.date,
            content: review.reply.text,
          },
        ]
      : [],
  }));

export default function Reviews() {
  const [items, setItems] = useState<ReviewItem[]>(mapSeedReviews());
  const [summary, setSummary] = useState<ReviewSummary>(() => {
    const total = seedReviews.reduce((sum, item) => sum + item.rating, 0);
    const count = seedReviews.length;
    return {
      totalCount: count,
      averageRating: count ? total / count : 0,
    };
  });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    rating: 5,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews?limit=3");
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setItems(data);
          return;
        }
        if (data?.items) {
          setItems(data.items);
        }
        if (data?.summary) {
          setSummary({
            totalCount: Number(data.summary.totalCount ?? 0),
            averageRating: Number(data.summary.averageRating ?? 0),
          });
        }
      } catch {
        // keep seed data on failure
      }
    };
    fetchReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (summary.totalCount) {
      return Math.round(summary.averageRating).toString();
    }
    if (!items.length) {
      return "0";
    }
    const total = items.reduce((sum, item) => sum + item.rating, 0);
    return Math.round(total / items.length).toString();
  }, [items, summary.averageRating, summary.totalCount]);

  const totalReviews = summary.totalCount || items.length;
  const ratingValue = Number(averageRating);
  const filledStars = Number.isFinite(ratingValue)
    ? Math.min(5, Math.max(0, ratingValue))
    : 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name || !formState.email || !formState.content) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (response.ok) {
        const latest = await fetch("/api/reviews?limit=3");
        if (latest.ok) {
          const data = await latest.json();
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            if (data?.items) {
              setItems(data.items);
            }
            if (data?.summary) {
              setSummary({
                totalCount: Number(data.summary.totalCount ?? 0),
                averageRating: Number(data.summary.averageRating ?? 0),
              });
            }
          }
        }
        setFormState({ name: "", email: "", rating: 5, content: "" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            <h2 className="font-heading text-[36px] font-semibold leading-[40px] tracking-[0.4px] text-gray-900">
              用户评价
            </h2>
            <span className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-4 py-1 text-[14px] leading-[20px] text-gray-900">
              <BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
              管理员
            </span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < filledStars;
              return (
                <Star
                  key={`rating-${index}`}
                  className={`h-6 w-6 ${isFilled ? "text-amber-400" : "text-gray-300"}`}
                  fill={isFilled ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              );
            })}
            <span className="text-[20px] leading-[28px] text-gray-900">
              {averageRating} / 5
            </span>
          </div>
          <p className="mt-2 text-[16px] text-gray-600">
            基于 {totalReviews} 条用户评价
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-[24px] font-semibold text-gray-900">
              用户评论
            </h3>
            <div className="flex flex-col gap-4">
              {items.map((review) => (
                <div className="rounded-[14px] bg-gray-50 p-6" key={review.id ?? review.name}>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[16px] font-semibold text-gray-900">
                            {review.name}
                          </div>
                          <div className="text-[14px] text-gray-500">
                            {maskEmail(review.email)}
                          </div>
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const isFilled = index < review.rating;
                          return (
                            <Star
                              key={`${review.name}-star-${index}`}
                              className={`h-4 w-4 ${isFilled ? "text-amber-400" : "text-gray-300"}`}
                              fill={isFilled ? "currentColor" : "none"}
                              aria-hidden="true"
                            />
                          );
                        })}
                      </div>
                      <p className="mt-2 text-[16px] leading-[24px] text-gray-700">
                        {review.content}
                      </p>
                      {review.replies?.length
                        ? review.replies.map((reply, replyIndex) => (
                            <div
                              className="mt-4 grid grid-cols-[20px_1fr] gap-3 rounded-[10px] border-l-4 border-blue-600 bg-blue-50 p-4"
                              key={`${review.id ?? review.name}-reply-${replyIndex}`}
                            >
                              <MessageCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
                              <div>
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-semibold text-blue-700">
                                    {reply.adminName}
                                  </span>
                                  <span className="text-[14px] text-gray-500">
                                    {formatDate(reply.repliedAt)}
                                  </span>
                                </div>
                                <p className="text-[16px] leading-[24px] text-gray-700">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[24px] font-semibold text-gray-900">
              发表评论
            </h3>
            <div className="rounded-xl bg-[linear-gradient(131deg,#eff6ff,#eef2ff)] p-8">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="请输入您的姓名"
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    邮箱地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="example@email.com"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                  <span className="text-[12px] text-gray-500">
                    您的邮箱地址不会被公开显示
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    评分 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={`form-star-${index}`}
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({ ...prev, rating: index + 1 }))
                        }
                        aria-label={`设置评分 ${index + 1}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            index < formState.rating ? "text-amber-400" : "text-gray-300"
                          }`}
                          fill={index < formState.rating ? "currentColor" : "none"}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    评论内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="min-h-[146px] rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="分享您的使用体验..."
                    value={formState.content}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, content: event.target.value }))
                    }
                  />
                </div>
                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-pill bg-blue-600 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  {isSubmitting ? "提交中..." : "提交评论"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
