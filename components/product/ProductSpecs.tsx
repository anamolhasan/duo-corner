'use client';

type ProductSpecsProps = {
  productAttributes: { label: string; value: string }[];
  productName: string;
  productDescription: string;
  productVideo: string;
};

export default function ProductSpecs({
  productAttributes,
  productName,
  productDescription,
  productVideo
}: ProductSpecsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-orange-500">⚡</span> PRODUCT SPECIFICATIONS
        </h3>
        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">100% ORIGINAL</span>
      </div>

      <div className="divide-y divide-gray-50 text-xs">
        {productAttributes.map((attr, idx) => (
          <div key={idx} className="py-2.5 grid grid-cols-3 gap-4 items-center">
            <span className="font-medium text-gray-500">{attr.label}</span>
            <span className="col-span-2 font-semibold text-gray-800">{attr.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <h4 className="text-xs font-bold text-gray-800 mb-1">{productName}</h4>
        <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
          {productDescription}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#f8931f] rounded-full"></span> Product Video Review (ভিডিও রিভিউ)
        </h3>
        <div className="rounded-xl overflow-hidden bg-black border border-gray-200 aspect-video flex items-center justify-center">
          <video src={productVideo} controls autoPlay muted loop className="w-full h-full object-cover" key={productVideo}>
            আপনার ব্রাউজার ভিডিও ট্যাগ সাপোর্ট করে না।
          </video>
        </div>
      </div>
    </div>
  );
}