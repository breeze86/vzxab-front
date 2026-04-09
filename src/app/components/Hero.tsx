"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { heroBannersFallback, type HeroBannerItem } from "../content";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "@/app/i18n";

type ApiHeroBannerItem = {
  id: string;
  title: string;
  titleEn: string | null;
  summary: string;
  summaryEn: string | null;
  mediaType: "image" | "video";
  videoPlayMode?: "hover" | "auto";
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoPosterUrl?: string | null;
  linkUrl: string;
  linkUrlEn: string | null;
};

type SlideDirection = "next" | "prev";

const AUTO_SWITCH_MS = 5000;
const ANIMATION_MS = 480;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const normalizeBanner = (item: ApiHeroBannerItem, language: string): HeroBannerItem | null => {
  // 根据语言选择对应字段
  const title = language === "en" ? item.titleEn : item.title;
  const summary = language === "en" ? item.summaryEn : item.summary;
  const linkUrl = language === "en" ? item.linkUrlEn : item.linkUrl;

  // 完整性校验：英文模式下必须所有英文字段都存在
  if (language === "en") {
    if (!item.titleEn?.trim() || !item.summaryEn?.trim() || !item.linkUrlEn?.trim()) {
      return null;
    }
  }

  // 中文模式下检查中文字段
  if (!item.title?.trim() || !item.summary?.trim() || !item.linkUrl?.trim()) {
    return null;
  }

  return {
    id: item.id,
    title: title!,
    summary: summary!,
    mediaType: item.mediaType,
    videoPlayMode: item.videoPlayMode === "auto" ? "auto" : "hover",
    imageUrl: item.imageUrl ?? undefined,
    videoUrl: item.videoUrl ?? undefined,
    videoPosterUrl: item.videoPosterUrl ?? undefined,
    linkUrl: linkUrl!,
  };
};

const isValidBanner = (item: Partial<ApiHeroBannerItem>) => {
  if (!item.id || !item.title || !item.summary || !item.linkUrl) {
    return false;
  }
  if (item.mediaType === "video") {
    return Boolean(item.videoUrl || item.videoPosterUrl || item.imageUrl);
  }
  return Boolean(item.imageUrl || item.videoPosterUrl);
};

export default function Hero() {
  const { t, language } = useTranslation();
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("next");
  const [isSlideActive, setIsSlideActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleVideos, setVisibleVideos] = useState<Record<number, boolean>>({});
  const [capturedVideoPosters, setCapturedVideoPosters] = useState<Record<number, string>>({});
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const syncBanners = (nextBanners: HeroBannerItem[]) => {
    setBanners(nextBanners);
    setCurrentIndex(0);
    setPreviousIndex(null);
    setIsSlideActive(false);
    setVisibleVideos({});
    setCapturedVideoPosters({});
  };

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const response = await fetch("/api/hero-banners", { cache: "no-store" });
        if (!response.ok) {
          syncBanners(heroBannersFallback[language]);
          return;
        }
        const data: ApiHeroBannerItem[] = await response.json();
        if (!Array.isArray(data)) {
          syncBanners(heroBannersFallback[language]);
          return;
        }
        const normalized = data
          .filter((item) => isValidBanner(item))
          .map((item) => normalizeBanner(item, language))
          .filter((item): item is HeroBannerItem => item !== null);
        syncBanners(normalized.length ? normalized : heroBannersFallback[language]);
      } catch {
        syncBanners(heroBannersFallback[language]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroBanners();
  }, [language]);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setIsSlideActive(true);
    });

    const timer = setTimeout(() => {
      setPreviousIndex(null);
      setIsSlideActive(false);
    }, ANIMATION_MS + 32);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [previousIndex]);

  useEffect(() => {
    if (banners.length <= 1 || isHovering || previousIndex !== null) {
      return;
    }

    const timer = setInterval(() => {
      changeSlide((currentIndex + 1) % banners.length, "next");
    }, AUTO_SWITCH_MS);

    return () => clearInterval(timer);
  }, [banners.length, currentIndex, isHovering, previousIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video || index === currentIndex) {
        return;
      }
      video.pause();
      video.currentTime = 0;
    });

    setVisibleVideos({});

    const currentBanner = banners[currentIndex];
    if (!currentBanner || currentBanner.mediaType !== "video") {
      return;
    }

    const currentVideo = videoRefs.current[currentIndex];
    if (!currentVideo) {
      return;
    }

    const mode = currentBanner.videoPlayMode ?? "hover";
    if (mode === "auto") {
      currentVideo.play().catch(() => undefined);
      return;
    }

    currentVideo.pause();
    currentVideo.currentTime = 0;
  }, [banners, currentIndex]);

  const setVideoVisibility = (index: number, visible: boolean) => {
    setVisibleVideos((prev) => {
      if (prev[index] === visible) {
        return prev;
      }
      return { ...prev, [index]: visible };
    });
  };

  const tryCaptureVideoPoster = (index: number) => {
    const banner = banners[index];
    if (!banner || banner.mediaType !== "video" || banner.videoPosterUrl) {
      return;
    }

    if (capturedVideoPosters[index]) {
      return;
    }

    const video = videoRefs.current[index];
    if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      if (!dataUrl) {
        return;
      }
      setCapturedVideoPosters((prev) => {
        if (prev[index]) {
          return prev;
        }
        return { ...prev, [index]: dataUrl };
      });
    } catch {
      // Cross-origin videos may block canvas extraction.
    }
  };

  const changeSlide = (nextIndex: number, direction: SlideDirection) => {
    if (nextIndex === currentIndex) {
      return;
    }

    setSlideDirection(direction);
    setIsSlideActive(false);
    setPreviousIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (banners.length <= 1) {
      return;
    }
    changeSlide((currentIndex - 1 + banners.length) % banners.length, "prev");
  };

  const handleNext = () => {
    if (banners.length <= 1) {
      return;
    }
    changeSlide((currentIndex + 1) % banners.length, "next");
  };

  const handleVideoHover = (index: number, playing: boolean) => {
    if (index !== currentIndex || banners[index]?.mediaType !== "video") {
      return;
    }

    const mode = banners[index]?.videoPlayMode ?? "hover";
    if (mode !== "hover") {
      return;
    }

    const video = videoRefs.current[index];
    if (!video) {
      return;
    }

    if (playing) {
      video.play().catch(() => undefined);
      return;
    }

    video.pause();
    video.currentTime = 0;
    setVideoVisibility(index, false);
  };

  const getSlideStyle = (isCurrent: boolean, isPrevious: boolean): CSSProperties => {
    if (previousIndex === null) {
      return {
        transform: "translate3d(0%, 0, 0)",
        opacity: 1,
      };
    }

    const transition = `transform ${ANIMATION_MS}ms ${EASING}, opacity ${ANIMATION_MS}ms ${EASING}`;

    if (isCurrent) {
      const startX = slideDirection === "next" ? "100%" : "-100%";
      return {
        transform: `translate3d(${isSlideActive ? "0%" : startX}, 0, 0)`,
        opacity: 1,
        transition,
      };
    }

    if (isPrevious) {
      const endX = slideDirection === "next" ? "-100%" : "100%";
      return {
        transform: `translate3d(${isSlideActive ? endX : "0%"}, 0, 0)`,
        opacity: isSlideActive ? 0.92 : 1,
        transition,
      };
    }

    return {
      transform: "translate3d(0%, 0, 0)",
      opacity: 1,
    };
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-14 lg:py-20">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-soft">
            <div className="relative h-[420px] w-full overflow-hidden sm:h-[500px] lg:h-[560px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.22),_transparent_34%),linear-gradient(135deg,_#08101c,_#102341_58%,_#0a1320)]" />
              <div className="absolute -right-10 top-1/2 h-[240px] w-[240px] -translate-y-1/2 rounded-full border border-white/10 bg-white/5 blur-[1px]" />
              <div className="absolute -right-2 top-1/2 h-[168px] w-[168px] -translate-y-1/2 rounded-full border border-white/10 bg-slate-950/60" />
              <div className="absolute left-0 top-0 flex h-full w-full items-end p-6 sm:p-10 lg:p-14">
                <div className="w-full max-w-[620px] animate-pulse">
                  <div className="h-4 w-28 rounded-full bg-white/20" />
                  <div className="mt-6 h-12 w-full max-w-[520px] rounded-2xl bg-white/16 sm:h-14" />
                  <div className="mt-4 h-12 w-full max-w-[460px] rounded-2xl bg-white/12 sm:h-14" />
                  <div className="mt-6 h-5 w-full max-w-[560px] rounded-full bg-white/14" />
                  <div className="mt-3 h-5 w-full max-w-[480px] rounded-full bg-white/10" />
                  <div className="mt-8 h-12 w-36 rounded-pill bg-blue-500/60" />
                </div>
              </div>
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-pill bg-black/25 px-4 py-2 backdrop-blur sm:bottom-8 lg:bottom-10">
                <span className="h-2.5 w-8 rounded-full bg-white/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-14 lg:py-20">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-soft"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {banners.map((banner, index) => {
            const isCurrent = index === currentIndex;
            const isPrevious = index === previousIndex;

            if (!isCurrent && !isPrevious) {
              return null;
            }

            const isVideoBanner = banner.mediaType === "video" && Boolean(banner.videoUrl);
            const configuredCover = banner.videoPosterUrl || banner.imageUrl;
            const capturedCover = capturedVideoPosters[index];
            const mediaCover = isVideoBanner
              ? configuredCover || capturedCover
              : banner.imageUrl || banner.videoPosterUrl || "/assets/images/hero-cooling-fan.jpg";
            const isVideoVisible = visibleVideos[index] === true;

            return (
              <a
                className={`absolute inset-0 block will-change-transform ${
                  isPrevious ? "z-30 pointer-events-none" : "z-20 pointer-events-auto"
                }`}
                style={getSlideStyle(isCurrent, isPrevious)}
                href={banner.linkUrl}
                key={banner.id}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => handleVideoHover(index, true)}
                onMouseLeave={() => handleVideoHover(index, false)}
              >
                <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
                  {isVideoBanner ? (
                    <>
                      <video
                        ref={(node) => {
                          videoRefs.current[index] = node;
                        }}
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isVideoVisible ? "scale-100 opacity-100" : "scale-[1.01] opacity-0"
                        }`}
                        src={banner.videoUrl}
                        poster={banner.videoPosterUrl || undefined}
                        muted
                        loop
                        playsInline
                        preload={isCurrent && index === 0 ? "auto" : "metadata"}
                        crossOrigin="anonymous"
                        onLoadedData={() => tryCaptureVideoPoster(index)}
                        onPlaying={() => setVideoVisibility(index, true)}
                        onPause={() => setVideoVisibility(index, false)}
                      />

                      {mediaCover ? (
                        <ImageWithFallback
                          src={mediaCover}
                          alt={banner.title}
                          fill
                          className={`object-cover transition-all duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isVideoVisible ? "scale-[1.02] opacity-0" : "scale-100 opacity-100"
                          }`}
                          sizes="100vw"
                          priority={isCurrent && index === 0}
                          loading={isCurrent && index === 0 ? "eager" : "lazy"}
                          fetchPriority={isCurrent && index === 0 ? "high" : "auto"}
                        />
                      ) : (
                        <div
                          className={`absolute inset-0 bg-slate-900 transition-all duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isVideoVisible ? "scale-[1.02] opacity-0" : "scale-100 opacity-100"
                          }`}
                        />
                      )}
                    </>
                  ) : (
                    <ImageWithFallback
                      src={mediaCover || "/assets/images/hero-cooling-fan.jpg"}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={isCurrent && index === 0}
                      loading={isCurrent && index === 0 ? "eager" : "lazy"}
                      fetchPriority={isCurrent && index === 0 ? "high" : "auto"}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/75 via-[#0f172a]/45 to-transparent" />

                  <div className="absolute left-0 top-0 flex h-full w-full items-end p-6 sm:p-10 lg:p-14">
                    <div className="max-w-[620px] text-white">
                      <h1 className="font-heading text-[34px] leading-[1.15] sm:text-[46px] lg:text-[58px]">
                        {banner.title}
                      </h1>
                      <p className="mt-4 text-[15px] leading-[1.7] text-blue-50 sm:text-[18px]">
                        {banner.summary}
                      </p>
                      <span className="mt-7 inline-flex rounded-pill bg-blue-600 px-7 py-3 text-[16px] font-semibold text-white shadow-[0_18px_30px_-18px_rgba(21,93,252,0.9)]">
                        {t.hero.learnMore}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}

          <div className="pointer-events-none absolute inset-0 z-40 flex items-stretch justify-between">
            <button
              type="button"
              aria-label={t.hero.prevBanner}
              onClick={handlePrevious}
              disabled={banners.length <= 1}
              className="pointer-events-auto group inline-flex h-full w-14 items-center justify-center bg-gradient-to-r from-black/10 to-transparent text-white/45 transition-all duration-300 hover:from-black/35 hover:text-white focus-visible:from-black/35 disabled:cursor-not-allowed disabled:opacity-20 sm:w-16 lg:w-20"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/15 opacity-60 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-white/70 group-hover:bg-black/35 group-hover:opacity-100">
                <ChevronLeft
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
            <button
              type="button"
              aria-label={t.hero.nextBanner}
              onClick={handleNext}
              disabled={banners.length <= 1}
              className="pointer-events-auto group inline-flex h-full w-14 items-center justify-center bg-gradient-to-l from-black/10 to-transparent text-white/45 transition-all duration-300 hover:from-black/35 hover:text-white focus-visible:from-black/35 disabled:cursor-not-allowed disabled:opacity-20 sm:w-16 lg:w-20"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/15 opacity-60 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-white/70 group-hover:bg-black/35 group-hover:opacity-100">
                <ChevronRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>

          <div className="pointer-events-none relative z-30 flex h-[420px] w-full items-end justify-center pb-6 sm:h-[500px] sm:pb-8 lg:h-[560px] lg:pb-10">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-pill bg-black/25 px-4 py-2 backdrop-blur">
              {banners.map((banner, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    aria-label={t.hero.goToBanner.replace('{n}', String(index + 1)).replace('{title}', banner.title)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/85"
                    }`}
                    key={banner.id}
                    type="button"
                    onClick={() => {
                      if (index === currentIndex) {
                        return;
                      }
                      const offset = (index - currentIndex + banners.length) % banners.length;
                      const direction =
                        offset === 0 ? "next" : offset <= banners.length / 2 ? "next" : "prev";
                      changeSlide(index, direction);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
