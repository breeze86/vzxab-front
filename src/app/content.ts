export const features = [
  {
    title: "强劲风量",
    desc: "最高可达 120 CFM 的超强风量，快速带走设备热量。",
  },
  {
    title: "超静音设计",
    desc: "创新的降噪技术，运行噪音低至 22dB，安静如图书馆。",
  },
  {
    title: "智能温控",
    desc: "根据温度自动调节转速，节能省电的同时保持最佳散热。",
  },
  {
    title: "高速轴承",
    desc: "液态轴承设计，转速可达 2000 RPM，寿命长达 50,000 小时。",
  },
  {
    title: "防尘防水",
    desc: "IP55 防护等级，有效防止灰尘和液体侵入。",
  },
  {
    title: "RGB 灯效",
    desc: "可编程 RGB 灯光系统，1600 万色彩随心定制。",
  },
];

export const products = [
  {
    tag: "机箱风扇",
    name: "CoolFlow Case 120",
    desc: "高性能机箱散热风扇，提供强劲风量与静音表现的完美平衡",
    price: "¥199",
    specs: [
      ["尺寸", "120mm x 25mm"],
      ["转速", "800-2000 RPM"],
      ["噪音", "18-22 dB"],
      ["风量", "120 CFM"],
    ],
    features: ["PWM 智能调速", "RGB 灯效", "液态轴承", "防震设计"],
    image: "/assets/images/products-fan.jpg"
  },
  {
    tag: "CPU散热器",
    name: "CoolFlow CPU Tower",
    desc: "塔式CPU散热器，6热管直触设计，轻松压制高性能处理器",
    price: "¥399",
    specs: [
      ["尺寸", "125mm x 158mm x 73mm"],
      ["转速", "600-1800 RPM"],
      ["噪音", "16-24 dB"],
      ["风量", "95 CFM"],
    ],
    features: ["6根纯铜热管", "铝制鳍片", "一体式扣具", "多平台兼容"],
    image: "/assets/images/products-cpu-fan.jpg"
  },
];

export const specs = [
  ["尺寸范围", "92mm - 140mm"],
  ["转速范围", "800 - 2000 RPM"],
  ["风量", "最高 120 CFM"],
  ["噪音水平", "20 - 25 dB(A)"],
  ["轴承类型", "液态轴承"],
  ["使用寿命", "50,000 小时"],
  ["供电接口", "4-Pin PWM"],
  ["额定电压", "12V DC"],
  ["额定功率", "1.2 - 3.6W"],
  ["防护等级", "IP55"],
  ["RGB 灯效", "ARGB 可编程"],
  ["质保期限", "5 年"],
];

export const reviews = [
  {
    name: "张伟",
    email: "zhang***@gmail.com",
    date: "2024-12-20",
    rating: 5,
    text: "机箱风扇真的很静音，RGB灯效也非常漂亮，散热效果超出预期！",
    reply: {
      date: "2024-12-21",
      text: "感谢您的好评！我们很高兴您喜欢这款产品。如有任何问题，欢迎随时联系我们的客服团队。",
    },
  },
  {
    name: "李娜",
    email: "lina***@163.com",
    date: "2024-12-18",
    rating: 5,
    text: "CPU散热器性能强大，安装也很方便，温度降了10度，非常满意！",
  },
  {
    name: "王强",
    email: "wangq***@qq.com",
    date: "2024-12-15",
    rating: 4,
    text: "质量不错，价格合理，客服服务也很好，推荐购买。",
  },
];

export const faqs = [
  {
    id: 1,
    question: "产品保修期是多久？",
    answer:
      "所有CoolFlow产品均享有2年质保服务。在保修期内，如产品出现非人为损坏的质量问题，我们将提供免费维修或更换服务。",
  },
  {
    id: 2,
    question: "如何安装机箱风扇？",
    answer:
      "机箱风扇安装非常简单：1) 确定风扇安装位置；2) 使用附带的螺丝固定风扇；3) 连接风扇电源线到主板或风扇集线器；4) 如需RGB灯效，连接RGB线缆。详细安装视频请查看下方的用户手册。",
  },
  {
    id: 3,
    question: "CPU散热器支持哪些平台？",
    answer:
      "CoolFlow CPU Tower支持主流平台：Intel LGA 1700/1200/1151/1150以及AMD AM5/AM4。产品包装内附带所有必要的安装扣具和说明书。",
  },
  {
    id: 4,
    question: "风扇噪音大吗？",
    answer:
      "我们的产品采用液压轴承技术，即使在高转速下也能保持低噪音运行。机箱风扇噪音低至18dBA，CPU散热器噪音低至22dBA。",
  },
  {
    id: 5,
    question: "RGB灯效如何控制？",
    answer:
      "RGB灯效支持主板同步控制（需连接到主板RGB接口）或使用独立控制器。兼容主流RGB软件如ASUS Aura、MSI Mystic Light、Gigabyte RGB Fusion等。",
  },
  {
    id: 6,
    question: "可以退换货吗？",
    answer:
      "购买后7天内，如产品未使用且包装完好，支持无理由退货。30天内如有质量问题，支持免费换货服务。",
  },
];

export const downloads = [
  ["机箱风扇用户手册", "PDF · 2.3 MB"],
  ["CPU散热器安装指南", "PDF · 3.1 MB"],
  ["RGB控制软件", "EXE · 15.8 MB"],
  ["产品规格表", "PDF · 1.2 MB"],
];
