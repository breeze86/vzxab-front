import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl">
              机箱风扇·CPU散热器
              <br />
              <span className="text-blue-600">专业散热方案</span>
            </h1>
            <p className="text-xl text-gray-600">
              专注打造高性能机箱风扇和CPU散热器，采用先进的液态轴承技术和智能温控系统，为您的电脑提供全方位散热保护。
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
                立即购买
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition">
                了解更多
              </button>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl text-blue-600">2000+</div>
                <div className="text-gray-600">用户好评</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600">5年</div>
                <div className="text-gray-600">质保期限</div>
              </div>
              <div>
                <div className="text-3xl text-blue-600">22dB</div>
                <div className="text-gray-600">超低噪音</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
            <ImageWithFallback 
              src="/assets/images/hero-cooling-fan.jpg"
              alt="电脑风扇"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
