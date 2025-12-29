import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          className="flex cursor-pointer items-center hover:opacity-85"
          href="#top"
          aria-label="返回顶部"
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
          <a href="#products">产品</a>
          <a href="#features">特性</a>
          <a href="#specs">规格</a>
          <a href="#reviews">评价</a>
          <a href="#support">支持</a>
        </nav>
        <div className="flex items-center gap-4">
          <a
            className="rounded-pill bg-blue-600 px-7 py-2 text-[16px] font-semibold text-white shadow-[0_12px_20px_-15px_rgba(21,93,252,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_24px_-18px_rgba(21,93,252,0.6)]"
            href="https://www.amazon.com/s?me=A3A15XG0VENWMN&marketplaceID=ATVPDKIKX0DER"
            target="_blank"
            rel="noopener noreferrer"
          >
            购买
          </a>
        </div>
      </div>
    </header>
  );
}
