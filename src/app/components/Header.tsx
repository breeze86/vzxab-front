import { Fan } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          className="flex cursor-pointer items-center gap-2 font-heading text-[20px] font-semibold hover:opacity-85"
          href="#top"
          aria-label="返回顶部"
        >
          <Fan className="h-8 w-8 text-blue-600" aria-hidden="true" />
          <span>CoolFlow</span>
        </a>
        <nav className="hidden items-center gap-8 text-[16px] text-gray-700 sm:flex">
          <a href="#products">产品</a>
          <a href="#features">特性</a>
          <a href="#specs">规格</a>
          <a href="#reviews">评价</a>
          <a href="#support">支持</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="rounded-pill bg-blue-600 px-7 py-2 text-[16px] font-semibold text-white shadow-[0_12px_20px_-15px_rgba(21,93,252,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_24px_-18px_rgba(21,93,252,0.6)]">
            购买
          </button>
        </div>
      </div>
    </header>
  );
}
