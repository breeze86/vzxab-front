"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { scrollToSection } from "@/lib/scroll";
import { useTranslation } from "@/app/i18n";

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

function ContactValue({ value, isLoading, notConfigured }: { value: string; isLoading: boolean; notConfigured: string }) {
  if (isLoading) {
    return <span className="mt-1 block h-4 w-36 animate-pulse rounded-full bg-gray-700" />;
  }

  return <span>{value || notConfigured}</span>;
}

export default function Footer() {
  const { t, language } = useTranslation();
  const [profile, setProfile] = useState<CompanyProfile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);

  const productLinks = [
    { label: language === "zh" ? "机箱风扇" : "Case Fans", targetId: "products" },
    { label: language === "zh" ? "CPU散热器" : "CPU Coolers", targetId: "products" },
  ];

  const supportLinks = [
    { label: language === "zh" ? "安装指南" : "Installation Guide", targetId: "download-center" },
    { label: language === "zh" ? "常见问题" : "FAQ", targetId: "support" },
    { label: language === "zh" ? "保修政策" : "Warranty", targetId: "warranty-policy" },
    { label: language === "zh" ? "联系我们" : "Contact", targetId: "support" },
  ];

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
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <div className="mb-3 font-heading text-[18px] font-semibold">
              {t.footer.products}
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
              {t.footer.support}
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
              {t.footer.contact}
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.phone} isLoading={isLoading} notConfigured={t.footer.notConfigured} />
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.email} isLoading={isLoading} notConfigured={t.footer.notConfigured} />
            </div>
            <div className="flex gap-2 text-[16px] leading-[24px] text-gray-400">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
              <ContactValue value={profile.address} isLoading={isLoading} notConfigured={t.footer.notConfigured} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-[#1e2939] pt-4 text-[14px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{t.footer.rights}</span>
          <div className="flex gap-6">
            <span>{t.footer.privacy}</span>
            <span>{t.footer.terms}</span>
            <span>{t.footer.cookies}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
