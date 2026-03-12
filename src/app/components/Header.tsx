import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
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
        </div>
      </div>
    </header>
  );
}
