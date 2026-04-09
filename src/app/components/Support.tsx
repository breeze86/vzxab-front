"use client";

import { ArrowDown, CircleHelp, Download, FileText, Headset, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";

type FaqItem = {
  id: number;
  question: string;
  questionEn: string | null;
  answer: string;
  answerEn: string | null;
};

type DownloadCenterItem = {
  id: number;
  name: string;
  nameEn: string | null;
  fileUrl: string;
  fileUrlEn: string | null;
  actionType: "preview" | "download";
  fileType: string;
  fileSize: string;
};

const faqSkeletonRows = Array.from({ length: 4 });
const downloadSkeletonRows = Array.from({ length: 3 });

export default function Support() {
  const { t, language } = useTranslation();
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isFaqsLoading, setIsFaqsLoading] = useState(true);
  const [downloadItems, setDownloadItems] = useState<DownloadCenterItem[]>([]);
  const [isDownloadsLoading, setIsDownloadsLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const messageMaxChars = 500;
  const contactName = formState.name.trim();
  const contactEmail = formState.email.trim();
  const contactSubject = formState.subject.trim();
  const isContactNameInvalid = contactName.length > 0 && contactName.length < 2;
  const isContactEmailInvalid =
    contactEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const isContactInvalid =
    !contactName ||
    !contactEmail ||
    !contactSubject ||
    !formState.message ||
    isContactNameInvalid ||
    isContactEmailInvalid ||
    formState.message.length > messageMaxChars;

  const inquiryTypes = t.support.inquiryTypes;

  useEffect(() => {
    const fetchFaqItems = async () => {
      try {
        const response = await fetch("/api/faqs", { cache: "no-store" });
        if (!response.ok) {
          setFaqItems([]);
          return;
        }

        const data: FaqItem[] = await response.json();
        if (!Array.isArray(data)) {
          setFaqItems([]);
          return;
        }

        // 根据语言过滤：英文模式下必须 questionEn 和 answerEn 都存在
        const filtered = data.filter((item) => {
          if (language === "en") {
            return item.questionEn?.trim() && item.answerEn?.trim();
          }
          return item.question?.trim() && item.answer?.trim();
        });

        setFaqItems(filtered);
      } catch {
        setFaqItems([]);
      } finally {
        setIsFaqsLoading(false);
      }
    };

    const fetchDownloadItems = async () => {
      try {
        const response = await fetch("/api/download-center", { cache: "no-store" });
        if (!response.ok) {
          setDownloadItems([]);
          return;
        }

        const data: DownloadCenterItem[] = await response.json();
        if (!Array.isArray(data)) {
          setDownloadItems([]);
          return;
        }

        // 根据语言过滤：英文模式下必须 nameEn 和 fileUrlEn 都存在
        const filtered = data.filter((item) => {
          if (language === "en") {
            return item.nameEn?.trim() && item.fileUrlEn?.trim();
          }
          return item.name?.trim() && item.fileUrl?.trim();
        });

        setDownloadItems(filtered);
      } catch {
        setDownloadItems([]);
      } finally {
        setIsDownloadsLoading(false);
      }
    };

    fetchFaqItems();
    fetchDownloadItems();
  }, [language]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !formState.name ||
      !formState.email ||
      !formState.subject ||
      !formState.message
    ) {
      setSubmitStatus("error");
      return;
    }
    if (formState.message.length > messageMaxChars) {
      setSubmitStatus("error");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        setSubmitStatus("error");
        return;
      }
      setSubmitStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="support" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-page px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <CircleHelp className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h3 className="font-heading text-[30px] leading-[36px] text-gray-900">
                {t.support.faq}
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {isFaqsLoading
                ? faqSkeletonRows.map((_, index) => (
                    <div
                      className="rounded-[24px] border border-gray-200 bg-white px-6 py-6"
                      key={`faq-skeleton-${index}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="h-7 w-[70%] animate-pulse rounded-full bg-gray-200" />
                        <div className="h-7 w-7 animate-pulse rounded-full bg-blue-100" />
                      </div>
                    </div>
                  ))
                : null}

              {!isFaqsLoading && faqItems.length > 0
                ? faqItems.map((item) => {
                    const isOpen = item.id === openFaqId;
                    return (
                      <button
                        className="flex w-full flex-col gap-3 rounded-[24px] border border-gray-200 bg-white px-6 py-6 text-left font-semibold"
                        key={item.id}
                        onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                        type="button"
                        aria-expanded={isOpen}
                      >
                        <div
                          className={`flex items-center justify-between ${
                            isOpen ? "border-b border-gray-200 pb-4" : ""
                          }`}
                        >
                          <span className="font-semibold pr-4">
                            {language === "en" ? item.questionEn : item.question}
                          </span>
                          <span className="text-2xl text-blue-600">
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                        {isOpen ? (
                          <p className="text-[14px] leading-[28px] text-gray-600">
                            {language === "en" ? item.answerEn : item.answer}
                          </p>
                        ) : null}
                      </button>
                    );
                  })
                : null}

              {!isFaqsLoading && faqItems.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-6 py-8 text-center text-[15px] text-gray-500">
                  {t.support.noFaq}
                </div>
              ) : null}
            </div>

            <div id="download-center" className="mt-8 scroll-mt-24">
              <div className="mb-4 flex items-center gap-3">
                <Download className="h-7 w-7 text-blue-600" aria-hidden="true" />
                <h4 className="text-[24px] font-semibold text-gray-900">{t.support.downloads}</h4>
              </div>
              <div className="flex flex-col gap-3">
                {isDownloadsLoading
                  ? downloadSkeletonRows.map((_, index) => (
                      <div
                        className="flex items-center justify-between rounded-[14px] border border-gray-200 bg-white px-4 py-4"
                        key={`download-skeleton-${index}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-[10px] bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-300" aria-hidden="true" />
                          </div>
                          <div className="animate-pulse">
                            <div className="h-4 w-48 rounded-full bg-gray-200" />
                            <div className="mt-2 h-3 w-24 rounded-full bg-gray-100" />
                          </div>
                        </div>
                        <div className="h-10 w-[92px] rounded-[10px] bg-blue-100 animate-pulse" />
                      </div>
                    ))
                  : null}

                {!isDownloadsLoading && downloadItems.length > 0
                  ? downloadItems.map((item) => (
                      <div
                        className="flex items-center justify-between rounded-[14px] border border-gray-200 bg-white px-4 py-4"
                        key={item.id}
                      >
                        <div className="flex items-center gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-[10px] bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {language === "en" ? item.nameEn : item.name}
                            </div>
                            <div className="text-[14px] text-gray-500">
                              {item.fileType} · {item.fileSize}
                            </div>
                          </div>
                        </div>
                        <a
                          className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2 text-[16px] text-white"
                          href={language === "en" ? item.fileUrlEn! : item.fileUrl}
                          target={item.actionType === "preview" ? "_blank" : undefined}
                          rel={item.actionType === "preview" ? "noopener noreferrer" : undefined}
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                          {t.support.downloads}
                        </a>
                      </div>
                    ))
                  : null}

                {!isDownloadsLoading && downloadItems.length === 0 ? (
                  <div className="rounded-[14px] border border-dashed border-gray-200 bg-white px-6 py-8 text-center text-[15px] text-gray-500">
                    {t.support.noDownloads}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <Headset className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h3 className="font-heading text-[30px] leading-[36px] text-gray-900">
                {t.support.contact}
              </h3>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-[33px]">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    {t.support.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder={t.support.namePlaceholder}
                    value={formState.name}
                    maxLength={50}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  {isContactNameInvalid ? (
                    <div className="text-[12px] text-red-500">
                      {t.support.nameError}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    {t.support.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder={t.support.emailPlaceholder}
                    value={formState.email}
                    maxLength={100}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                  {isContactEmailInvalid ? (
                    <div className="text-[12px] text-red-500">
                      {t.support.emailError}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    {t.support.subject} <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    value={formState.subject}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, subject: event.target.value }))
                    }
                  >
                    <option value="">{t.support.subjectPlaceholder}</option>
                    {inquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    {t.support.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="min-h-[170px] rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder={t.support.messagePlaceholder}
                    value={formState.message}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, message: event.target.value }))
                    }
                  />
                  <div
                    className={`text-[12px] ${
                      formState.message.length > messageMaxChars
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {t.reviews.charsLimit.replace("{current}", String(formState.message.length)).replace("{max}", String(messageMaxChars))}
                  </div>
                </div>
                {submitStatus === "success" ? (
                  <div className="text-[14px] text-green-600">
                    {t.support.successMessage}
                  </div>
                ) : null}
                {submitStatus === "error" ? (
                  <div className="text-[14px] text-red-500">
                    {t.support.errorMessage}
                  </div>
                ) : null}
                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-pill bg-blue-600 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting || isContactInvalid}
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  {isSubmitting ? t.support.sending : t.support.sendMessage}
                </button>
              </form>
            </div>

            <div id="warranty-policy" className="mt-8 scroll-mt-24 rounded-xl border border-[#bedbff] bg-[linear-gradient(160deg,#eff6ff,#eef2ff)] p-[25px]">
              <h4 className="mb-3 text-[18px] font-semibold text-gray-900">
                {t.support.warranty}
              </h4>
              <div className="grid gap-2 text-[14px] text-gray-700">
                {t.support.warrantyItems.map((item, index) => (
                  <span key={index}>• {item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
