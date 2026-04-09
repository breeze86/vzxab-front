"use client";

import {
  Gauge,
  Shield,
  Sparkles,
  Thermometer,
  Volume2,
  Wind,
} from "lucide-react";
import { features } from "../content";
import { useTranslation } from "@/app/i18n";

export default function Features() {
  const { language } = useTranslation();
  const currentFeatures = features[language as keyof typeof features];

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-page px-6">
        <h2 className="text-center font-heading text-[36px] font-semibold leading-[40px] tracking-[0.4px] text-gray-900">
          核心特性
        </h2>
        <p className="mt-3 text-center text-[20px] leading-[28px] text-gray-600">
          领先的技术创新，为您带来卓越的散热体验
        </p>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentFeatures.map((item, index) => {
            const icons = [
              Wind,
              Volume2,
              Thermometer,
              Gauge,
              Shield,
              Sparkles,
            ];
            const Icon = icons[index] ?? Wind;
            return (
            <div
              className="rounded-xl border border-gray-200 bg-white p-6"
              key={item.title}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-[20px] font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[16px] leading-[24px] text-gray-600">
                {item.desc}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
