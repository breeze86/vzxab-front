export const features = {
  zh: [
    { title: "强劲风量", desc: "最高可达 120 CFM 的超强风量，快速带走设备热量。" },
    { title: "超静音设计", desc: "创新的降噪技术，运行噪音低至 22dB，安静如图书馆。" },
    { title: "智能温控", desc: "根据温度自动调节转速，节能省电的同时保持最佳散热。" },
    { title: "高速轴承", desc: "液态轴承设计，转速可达 2000 RPM，寿命长达 50,000 小时。" },
    { title: "防尘防水", desc: "IP55 防护等级，有效防止灰尘和液体侵入。" },
    { title: "RGB 灯效", desc: "可编程 RGB 灯光系统，1600 万色彩随心定制。" },
  ],
  en: [
    { title: "Maximum Airflow", desc: "Up to 120 CFM for rapid heat dissipation." },
    { title: "Whisper Quiet", desc: "Advanced noise reduction down to 22dB — as quiet as a library." },
    { title: "Smart Control", desc: "Auto-adjusts speed based on temperature for optimal cooling." },
    { title: "Fluid Bearing", desc: "2000 RPM max speed with 50,000-hour lifespan." },
    { title: "Dust & Water Resistant", desc: "IP55 rated protection against dust and liquid." },
    { title: "RGB Lighting", desc: "Programmable 16.8 million colors to match your build." },
  ],
};

export type HeroBannerItem = {
  id: string;
  title: string;
  summary: string;
  mediaType: "image" | "video";
  videoPlayMode?: "hover" | "auto";
  imageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  linkUrl: string;
};

export const heroBannersFallback: Record<string, HeroBannerItem[]> = {
  zh: [
    {
      id: "hero-fallback",
      title: "VZXAB 高性能散热方案",
      summary:
        "精选机箱风扇与 CPU 散热器正在同步更新中，当前为默认展示内容。您可以先进入 VZXAB 品牌店铺查看已上架产品与最新动态。",
      mediaType: "image",
      imageUrl: "/assets/images/hero-placeholder-banner.webp",
      linkUrl: "https://www.amazon.com/s?me=A3A15XG0VENWMN&marketplaceID=ATVPDKIKX0DER",
    },
  ],
  en: [
    {
      id: "hero-fallback",
      title: "VZXAB High-Performance Cooling",
      summary:
        "Our curated selection of case fans and CPU coolers is being updated. Visit the VZXAB store to see available products and latest updates.",
      mediaType: "image",
      imageUrl: "/assets/images/hero-placeholder-banner.webp",
      linkUrl: "https://www.amazon.com/s?me=A3A15XG0VENWMN&marketplaceID=ATVPDKIKX0DER",
    },
  ],
};

export const products = [
  {
    tag: { zh: "机箱风扇", en: "Case Fan" },
    name: { zh: "VZXAB Case Fan 1", en: "VZXAB Case Fan 1" },
    desc: {
      zh: "高性能机箱散热风扇，提供强劲风量与静音表现的完美平衡",
      en: "High-performance case fan delivering the perfect balance of powerful airflow and whisper-quiet operation"
    },
    price: "¥199",
    buyLink:
      "https://www.amazon.com/Cooler-Cooling-Lighting-Dynamic-Multi-Graph/dp/B0FQHV7CWC/ref=sr_1_2?dib=eyJ2IjoiMSJ9.AL-TedRXzren6xUvXq-55UyyDJHjLaj8aW6tqZqtOJ7GjHj071QN20LucGBJIEps.qi9kH1HqI3RObu5FnEme4nAUtvpWMVQCNQH2z45M2gc&dib_tag=se&m=A3A15XG0VENWMN&marketplaceID=ATVPDKIKX0DER&nsdOptOutParam=true&qid=1766919428&s=merchant-items&sr=1-2",
    specs: {
      zh: [
        ["尺寸", "120mm"],
        ["转速", "1100 - 2000 RPM ±10%"],
        ["噪音", "≤35 db"],
        ["风量", "80 - 120 CFM"],
      ],
      en: [
        ["Size", "120mm"],
        ["Speed", "1100 - 2000 RPM ±10%"],
        ["Noise", "≤35 db"],
        ["Airflow", "80 - 120 CFM"],
      ],
    },
    features: {
      zh: ["PWM 智能调速", "RGB 灯效", "液态轴承", "防震设计", "扇叶无线传输供电", "多图形态同步闪灯"],
      en: ["PWM Smart Control", "RGB Lighting", "Fluid Bearing", "Anti-vibration", "Wireless Power", "Sync Lighting"]
    },
    image: "/assets/images/products-fan.jpg"
  },
  {
    tag: { zh: "CPU散热器", en: "CPU Cooler" },
    name: { zh: "VZXAB CPU Fan 1", en: "VZXAB CPU Cooler 1" },
    desc: {
      zh: "塔式CPU散热器，6热管直触设计，轻松压制高性能处理器",
      en: "Tower CPU cooler with 6 direct-contact heat pipes — handles high-performance processors with ease"
    },
    price: "¥399",
    buyLink:
      "https://www.amazon.com/Cooler-Cooling-Lighting-Dynamic-Multi-Graph/dp/B0D7BKQX44/ref=sr_1_3?dib=eyJ2IjoiMSJ9.AL-TedRXzren6xUvXq-55UyyDJHjLaj8aW6tqZqtOJ7GjHj071QN20LucGBJIEps.qi9kH1HqI3RObu5FnEme4nAUtvpWMVQCNQH2z45M2gc&dib_tag=se&m=A3A15XG0VENWMN&marketplaceID=ATVPDKIKX0DER&nsdOptOutParam=true&qid=1766919428&s=merchant-items&sr=1-3",
    specs: {
      zh: [
        ["管数", "6管"],
        ["转速", "1100 - 2000 RPM ±10%"],
        ["噪音", "≤35 db"],
        ["风量", "80 - 120 CFM"],
      ],
      en: [
        ["Heat Pipes", "6"],
        ["Speed", "1100 - 2000 RPM ±10%"],
        ["Noise", "≤35 db"],
        ["Airflow", "80 - 120 CFM"],
      ],
    },
    features: {
      zh: ["6根纯铜热管", "铝制鳍片", "一体式扣具", "多平台兼容", "扇叶无线传输供电", "多图形态同步闪灯"],
      en: ["6 Copper Heat Pipes", "Aluminum Fins", "Unified Mount", "Multi-platform", "Wireless Power", "Sync Lighting"]
    },
    image: "/assets/images/products-cpu-fan.jpg"
  },
];

export const specs = {
  zh: [
    ["尺寸", "120mm"],
    ["转速范围", "1100 - 2000 RPM ±10%"],
    ["风量", "最高 120 CFM"],
    ["噪音水平", "≤35 db"],
    ["轴承类型", "液态轴承"],
    ["使用寿命", "50,000 小时"],
    ["供电接口", "SATA、4-Pin PWM"],
    ["额定电压", "12V DC"],
    ["扇叶供电", "无线传输"],
    ["额定功率", "1.2 - 3.6W"],
    ["RGB 灯效", "多图形态同步闪灯"],
    ["质保期限", "1 年"],
  ],
  en: [
    ["Size", "120mm"],
    ["Speed Range", "1100 - 2000 RPM ±10%"],
    ["Airflow", "Up to 120 CFM"],
    ["Noise Level", "≤35 db"],
    ["Bearing Type", "Fluid Bearing"],
    ["Lifespan", "50,000 hours"],
    ["Power Connector", "SATA, 4-Pin PWM"],
    ["Rated Voltage", "12V DC"],
    ["Fan Power", "Wireless"],
    ["Power Consumption", "1.2 - 3.6W"],
    ["RGB Lighting", "Sync Lighting"],
    ["Warranty", "1 Year"],
  ],
};

export type SeedReview = {
  name: string;
  email: string;
  date: string;
  rating: number;
  text: string;
  reply?: {
    date: string;
    text: string;
  };
};

export const reviews: SeedReview[] = [];
// export const reviews = [
//   {
//     name: "张伟",
//     email: "zhang***@gmail.com",
//     date: "2024-12-20",
//     rating: 5,
//     text: "机箱风扇真的很静音，RGB灯效也非常漂亮，散热效果超出预期！",
//     reply: {
//       date: "2024-12-21",
//       text: "感谢您的好评！我们很高兴您喜欢这款产品。如有任何问题，欢迎随时联系我们的客服团队。",
//     },
//   },
//   {
//     name: "李娜",
//     email: "lina***@163.com",
//     date: "2024-12-18",
//     rating: 5,
//     text: "CPU散热器性能强大，安装也很方便，温度降了10度，非常满意！",
//   },
//   {
//     name: "王强",
//     email: "wangq***@qq.com",
//     date: "2024-12-15",
//     rating: 4,
//     text: "质量不错，价格合理，客服服务也很好，推荐购买。",
//   },
// ];

