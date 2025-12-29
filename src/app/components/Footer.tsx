import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-12 text-white">
      <div className="mx-auto max-w-page px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2 font-heading text-[20px] font-semibold">
              <span>VZXAB</span>
            </div>
            <p className="text-[16px] leading-[24px] text-gray-400">
              专注于提供高性能散热解决方案，让您的设备始终保持最佳状态。
            </p>
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              产品系列
            </div>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#products">
              机箱风扇
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#products">
              CPU散热器
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#products">
              配件耗材
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#support">
              定制方案
            </a>
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              客户支持
            </div>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#support">
              安装指南
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#support">
              常见问题
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#support">
              保修政策
            </a>
            <a className="block text-[16px] leading-[24px] text-gray-400" href="#support">
              联系我们
            </a>
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              联系方式
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Phone className="h-4 w-4 text-blue-300" aria-hidden="true" />
              400-888-8888
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Mail className="h-4 w-4 text-blue-300" aria-hidden="true" />
              support@coolflow.com
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <MapPin className="h-4 w-4 text-blue-300" aria-hidden="true" />
              中国深圳市南山区科技园
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-[#1e2939] pt-4 text-[14px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 CoolFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <span>隐私政策</span>
            <span>使用条款</span>
            <span>Cookie 政策</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
