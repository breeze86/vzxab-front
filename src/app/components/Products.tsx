import { products } from "../content";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Products() {
  return (
    <section id="products" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-center font-heading text-[36px] font-semibold leading-[40px] tracking-[0.4px] text-gray-900">
            主打产品
          </h2>
          <p className="mt-3 text-center text-[20px] leading-[28px] text-gray-600">
            专注机箱风扇与CPU散热器，为您的电脑提供全方位散热解决方案
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <article
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              key={product.name}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <ImageWithFallback 
                    src={product.image}
                    alt="电脑风扇"
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                <span className="absolute left-4 top-4 inline-flex items-center rounded-pill bg-blue-600 px-4 py-1 text-[14px] leading-[20px] text-white">
                  {product.tag}
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-heading text-[24px] font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-[16px] leading-[24px] text-gray-600">
                  {product.desc}
                </p>
                <div className="mt-3 text-[30px] font-semibold text-blue-600">
                  {product.price}
                </div>
                <div className="mt-5 grid gap-3">
                  {product.specs.map(([label, value]) => (
                    <div
                      className="flex justify-between border-b border-gray-100 py-2 text-[14px]"
                      key={label}
                    >
                      <span>{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[14px] text-gray-600">
                  产品特点：
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[14px] text-gray-900">
                  {product.features.map((feature) => (
                    <div className="flex items-center gap-2" key={feature}>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {feature}
                    </div>
                  ))}
                </div>
                <a
                  className="mt-5 block w-full rounded-pill bg-blue-600 py-3 text-center text-[16px] font-semibold text-white"
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  立即购买
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
