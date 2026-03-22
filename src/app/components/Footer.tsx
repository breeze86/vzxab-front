"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/scroll";

type CompanyProfile = {
  phone: string;
  email: string;
  address: string;
};

const emptyProfile: CompanyProfile = {
  phone: "",
  email: "",
  address: "",
};

const productLinks = [
  { label: "机箱风扇", targetId: "products" },
  { label: "CPU散热器", targetId: "products" },
];

const supportLinks = [
  { label: "安装指南", targetId: "download-center" },
  { label: "常见问题", targetId: "support" },
  { label: "保修政策", targetId: "warranty-policy" },
  { label: "联系我们", targetId: "support" },
];

function ContactValue({ value, isLoading }: { value: string; isLoading: boolean }) {
  if (isLoading) {
    return <span className="mt-1 block h-4 w-36 animate-pulse rounded-full bg-gray-700" />;
  }

  return <span>{value || "暂未配置"}</span>;
}

export default function Footer() {
  const [profile, setProfile] = useState<CompanyProfile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/company-profile", { cache: "no-store" });
        if (!response.ok) {
          setProfile(emptyProfile);
          return;
        }

        const data = (await response.json()) as Partial<CompanyProfile>;
        setProfile({
          phone: data.phone ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
        });
      } catch {
        setProfile(emptyProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleNavigate = (targetId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(targetId);
  };

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
            {productLinks.map((item) => (
              <a
                key={item.label}
                className="block text-[16px] leading-[24px] text-gray-400"
                href={`#${item.targetId}`}
                onClick={handleNavigate(item.targetId)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              客户支持
            </div>
            {supportLinks.map((item) => (
              <a
                key={item.label}
                className="block text-[16px] leading-[24px] text-gray-400"
                href={`#${item.targetId}`}
                onClick={handleNavigate(item.targetId)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              联系方式
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.phone} isLoading={isLoading} />
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.email} isLoading={isLoading} />
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.address} isLoading={isLoading} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-[#1e2939] pt-4 text-[14px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 VZXAB. All rights reserved.</span>
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
