"use client";

import { ArrowDown, CircleHelp, Download, FileText, Headset, Send } from "lucide-react";
import { useState } from "react";
import { downloads, faqs } from "../content";

export default function Support() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  return (
    <section id="support" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-page px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <CircleHelp className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h3 className="font-heading text-[30px] leading-[36px] text-gray-900">
                常见问题
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {faqs.map((item) => {
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
                      <span className="font-semibold pr-4">{item.question}</span>
                      <span className="text-2xl text-blue-600">
                        {isOpen ? "−" : "+"}
                      </span>
                    </div>
                    {isOpen ? (
                      <p className="text-[14px] leading-[28px] text-gray-600">
                        {item.answer}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <Download className="h-7 w-7 text-blue-600" aria-hidden="true" />
                <h4 className="text-[24px] font-semibold text-gray-900">下载中心</h4>
              </div>
              <div className="flex flex-col gap-3">
                {downloads.map(([title, size]) => (
                  <div
                    className="flex items-center justify-between rounded-[14px] border border-gray-200 bg-white px-4 py-4"
                    key={title}
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-[10px] bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{title}</div>
                        <div className="text-[14px] text-gray-500">{size}</div>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2 text-[16px] text-white">
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      下载
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <Headset className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h3 className="font-heading text-[30px] leading-[36px] text-gray-900">
                联系我们
              </h3>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-[33px]">
              <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    邮箱地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    主题 <span className="text-red-500">*</span>
                  </label>
                  <select className="rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]">
                    <option>请选择咨询主题</option>
                    <option>产品咨询</option>
                    <option>技术支持</option>
                    <option>售后保修</option>
                    <option>购买咨询</option>
                    <option>其他问题</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-gray-900">
                    详细描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="min-h-[170px] rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-[16px]"
                    placeholder="请详细描述您的问题..."
                  />
                </div>
                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-pill bg-blue-600 py-3 text-[16px] font-semibold text-white"
                  type="button"
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  发送消息
                </button>
              </form>
            </div>

            <div className="mt-8 rounded-xl border border-[#bedbff] bg-[linear-gradient(160deg,#eff6ff,#eef2ff)] p-[25px]">
              <h4 className="mb-3 text-[18px] font-semibold text-gray-900">
                保修政策
              </h4>
              <div className="grid gap-2 text-[14px] text-gray-700">
                <span>• 所有产品享有2年质保服务</span>
                <span>• 7天无理由退货（未使用）</span>
                <span>• 30天内质量问题免费换货</span>
                <span>• 终身技术支持服务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
