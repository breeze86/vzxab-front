"use client";

import Image from "next/image";
import { scrollToSection } from "@/lib/scroll";
import { useTranslation } from "@/app/i18n";

export default function Header() {
  const { t, language, setLanguage } = useTranslation();

  const navItems = [
    { label: t.nav.products, targetId: "products" },
    { label: t.nav.specs, targetId: "specs" },
    { label: t.nav.reviews, targetId: "reviews" },
    { label: t.nav.support, targetId: "support" },
  ];

  const handleNavigate = (targetId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(targetId);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          className="flex cursor-pointer items-center hover:opacity-85"
          href="#top"
          aria-label="返回顶部"
          onClick={handleNavigate("top")}
        >
          <Image
            src="/assets/images/vzxab_logo.png"
            alt="VZXAB logo"
            width={1024}
            height={286}
            className="h-9 w-32 object-contain"
            priority
          />
        </a>
        <nav className="hidden items-center gap-8 text-[16px] text-gray-700 sm:flex font-semibold">
          {navItems.map((item) => (
            <a key={item.targetId} href={`#${item.targetId}`} onClick={handleNavigate(item.targetId)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center">
          <button
            onClick={() => setLanguage("zh")}
            className={`cursor-pointer px-1.5 py-1 text-[14px] font-medium transition-colors duration-200 ${
              language === "zh"
                ? "text-blue-600 font-semibold"
                : "text-gray-400 hover:text-blue-500"
            }`}
            aria-label="切换到中文"
          >
            中
          </button>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => setLanguage("en")}
            className={`cursor-pointer px-1.5 py-1 text-[14px] font-medium transition-colors duration-200 ${
              language === "en"
                ? "text-blue-600 font-semibold"
                : "text-gray-400 hover:text-blue-500"
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
