"use client";

import { useEffect, useMemo, useState } from "react";
import { sha256 } from "js-sha256";
import { BadgeCheck, MessageCircle, Send, Star, Trash2, User } from "lucide-react";
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

type AdminSession = {
  authenticated: boolean;
  displayName?: string;
};

const hashPasswordDigest = async (value: string) => {
  if (crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return sha256(value);
};

const ADMIN_TOKEN_KEY = "coolflow_admin_token";

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
  const [adminSession, setAdminSession] = useState<AdminSession>({
    authenticated: false,
  });
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ account: "", password: "" });
  const [adminError, setAdminError] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = async () => {
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

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    const fetchAdminSession = async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        return;
      }
      setAdminToken(token);
      try {
        const response = await fetch("/api/admin/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (data?.authenticated) {
          setAdminSession({
            authenticated: true,
            displayName: data.admin?.displayName,
          });
        }
      } catch {
        // ignore session errors
      }
    };
    fetchAdminSession();
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
        await loadReviews();
        setFormState({ name: "", email: "", rating: 5, content: "" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminForm.account || !adminForm.password) {
      setAdminError("请输入管理员账号和密码");
      return;
    }
    setAdminError("");
    setIsAdminLoading(true);
    try {
      const passwordDigest = await hashPasswordDigest(adminForm.password);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: adminForm.account,
          passwordDigest,
        }),
      });
      if (!response.ok) {
        setAdminError("账号或密码错误");
        return;
      }
      const data = await response.json();
      if (data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setAdminToken(data.token);
      }
      setAdminSession({
        authenticated: true,
        displayName: data.displayName,
      });
      setIsAdminOpen(false);
      setAdminForm({ account: "", password: "" });
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    const token = adminToken;
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } finally {
      setAdminSession({ authenticated: false });
      setAdminToken(null);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  const handleReplySubmit = async (reviewId?: number) => {
    if (!reviewId) {
      return;
    }
    const content = replyDrafts[reviewId]?.trim();
    if (!content) {
      return;
    }
    setReplyingId(reviewId);
    try {
      const token = adminToken;
      const response = await fetch(`/api/reviews/${reviewId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
        setActiveReplyId(null);
        await loadReviews();
      }
    } finally {
      setReplyingId(null);
    }
  };

  const handleDeleteClick = (reviewId?: number) => {
    if (!reviewId) {
      return;
    }
    setDeleteTargetId(reviewId);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) {
      return;
    }
    setIsDeleting(true);
    try {
      const token = adminToken;
      const response = await fetch(`/api/reviews/${deleteTargetId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (response.ok) {
        await loadReviews();
      }
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
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
            {adminSession.authenticated ? (
              <div className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-4 py-1 text-[14px] leading-[20px] text-gray-900">
                  <BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  管理员已登录
                </span>
                <button
                  className="rounded-pill border border-gray-200 px-4 py-1 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-100"
                  type="button"
                  onClick={handleAdminLogout}
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-4 py-1 text-[14px] leading-[20px] text-gray-900 transition hover:bg-gray-200"
                type="button"
                onClick={() => setIsAdminOpen(true)}
                aria-label="管理员登录"
              >
                <BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                管理员
              </button>
            )}
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
                      {adminSession.authenticated ? (
                        review.id ? (
                          <>
                          <div className="mt-2 flex justify-end gap-1">
                            <button
                              className="inline-flex cursor-pointer items-center rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                              type="button"
                              onClick={() => handleDeleteClick(review.id)}
                              title="删除评论"
                              aria-label="删除评论"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              className="inline-flex cursor-pointer items-center rounded-full p-1 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                              type="button"
                              onClick={() =>
                                  setActiveReplyId((prev) =>
                                    prev === review.id ? null : review.id ?? null
                                  )
                                }
                                title="回复消息"
                                aria-label="回复消息"
                              >
                                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                            {activeReplyId === review.id ? (
                              <div className="mt-3 rounded-[12px] border border-gray-200 bg-white p-4">
                                <div className="text-[14px] font-semibold text-gray-900">
                                  管理员回复
                                </div>
                                <textarea
                                  className="mt-2 min-h-[96px] w-full rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[14px]"
                                  placeholder="输入回复内容..."
                                  value={replyDrafts[review.id] ?? ""}
                                  onChange={(event) =>
                                    setReplyDrafts((prev) => ({
                                      ...prev,
                                      [review.id as number]: event.target.value,
                                    }))
                                  }
                                />
                                <div className="mt-3 flex justify-end">
                                  <button
                                    className="rounded-pill bg-blue-600 px-5 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                                    type="button"
                                    disabled={replyingId === review.id}
                                    onClick={() => handleReplySubmit(review.id)}
                                  >
                                    {replyingId === review.id ? "提交中..." : "提交回复"}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <div className="mt-4 text-[14px] text-gray-500">
                            示例评论无法回复
                          </div>
                        )
                      ) : null}
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
      {isAdminOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="管理员登录"
          onClick={() => setIsAdminOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[18px] font-semibold text-gray-900">
                  管理员登录
                </div>
                <div className="text-[13px] text-gray-500">
                  仅限授权管理员使用
                </div>
              </div>
              <button
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                type="button"
                onClick={() => setIsAdminOpen(false)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleAdminLogin}>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-gray-900">
                  管理员账号
                </label>
                <input
                  className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[15px]"
                  placeholder="请输入管理员账号"
                  value={adminForm.account}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, account: event.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-gray-900">
                  登录密码
                </label>
                <input
                  type="password"
                  className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[15px]"
                  placeholder="请输入密码"
                  value={adminForm.password}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
              {adminError ? (
                <div className="text-[13px] text-red-500">{adminError}</div>
              ) : null}
              <div className="mt-2 flex gap-3">
                <button
                  className="flex-1 rounded-pill border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 hover:bg-gray-50"
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  disabled={isAdminLoading}
                >
                  取消
                </button>
                <button
                  className="flex-1 rounded-pill bg-blue-600 px-4 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isAdminLoading}
                >
                  {isAdminLoading ? "登录中..." : "登录"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {isDeleteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="删除评论确认"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 text-[18px] font-semibold text-gray-900">
              确认删除评论
            </div>
            <p className="text-[14px] leading-[22px] text-gray-600">
              删除后将无法恢复，确定要继续吗？
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-pill border border-gray-200 px-4 py-2 text-[14px] font-semibold text-gray-700 hover:bg-gray-50"
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                className="flex-1 rounded-pill bg-red-600 px-4 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
