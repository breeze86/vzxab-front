"use client";

import { specs } from "../content";
import { useTranslation } from "@/app/i18n";

export default function Specs() {
  const { t, language } = useTranslation();
  const currentSpecs = specs[language as keyof typeof specs];

  return (
    <section id="specs" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <h2 className="text-center font-heading text-[36px] font-semibold leading-[40px] tracking-[0.4px] text-gray-900">
          {t.specs.title}
        </h2>
        <p className="mt-3 text-center text-[20px] leading-[28px] text-gray-600">
          {t.specs.subtitle}
        </p>
        <div className="mx-auto mt-14 max-w-[896px] rounded-xl bg-[linear-gradient(148deg,#eff6ff,#eef2ff)] p-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentSpecs.map(([label, value]) => (
              <div
                className="flex items-center justify-between rounded-[14px] bg-white px-4 py-4 text-[16px] text-gray-600"
                key={label}
              >
                <span>{label}</span>
                <strong className="text-gray-900">{value}</strong>
              </div>
            ))}
          </div>
        </div>
        {/* <button className="mx-auto mt-12 block w-[176px] rounded-pill bg-blue-600 py-3 text-[16px] font-semibold text-white">
          下载完整规格书
        </button> */}
      </div>
    </section>
  );
}
