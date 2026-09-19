import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Sparkles, Tag, Check, ArrowRight } from 'lucide-react';
import { ProductItem, Sport } from '../types';
import { recordProductClick } from '../lib/firebase';

interface ProductsSectionProps {
  products: ProductItem[];
  sports: Sport[];
  filterSportId?: string | null;
  onClearFilter?: () => void;
  onOpenSponsor: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  sports,
  filterSportId,
  onClearFilter,
  onOpenSponsor,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(filterSportId || 'all');
  const [clickedId, setClickedId] = useState<string | null>(null);

  const sportTabs = [{ id: 'all', name: '전체 상품' }, ...sports];

  const filteredProducts = products.filter((p) => {
    if (selectedSport === 'all') return true;
    return p.sportId === selectedSport;
  });

  const handleProductClick = async (product: ProductItem) => {
    setClickedId(product.id);
    try {
      await recordProductClick(product.id);
    } catch {
      // non-blocking
    }
    // Open product link in new window or simulate
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setClickedId(null), 1500);
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#7C6EE6] text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>운동 시작 필수템</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            대학생 운동 시작 아이템 추천
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            장비병 걸리지 않고 딱 필요한 알짜배기 가성비 필수템만 모았습니다.
          </p>
        </div>

        {/* Brand Banner Link */}
        <button
          onClick={onOpenSponsor}
          className="self-start md:self-auto px-4 py-2 rounded-2xl bg-white border border-[#D8D2F8] hover:border-[#8B7FE8] text-[#6C5CE7] hover:bg-[#F5F3FF] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>브랜드 입점 및 제휴 문의</span>
        </button>
      </div>

      {/* Sport Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {sportTabs.map((tab) => {
          const isSelected = selectedSport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSport(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Notice info */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span>
          💡 제휴 마케팅 안내: 일부 상품은 제휴 링크를 통해 일정 수수료를 제공받을 수 있으며, 이는 대학생 맞춤 서비스 운영에 쓰입니다.
        </span>
        <span className="font-semibold text-gray-600 shrink-0 hidden sm:inline">
          총 {filteredProducts.length}개 상품
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const associatedSport = sports.find((s) => s.id === product.sportId);
          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#EDE9FE] hover:border-[#8B7FE8] p-5 flex flex-col justify-between shadow-2xs hover:shadow-lg hover:shadow-[#8B7FE8]/10 transition-all duration-200 group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[11px] font-semibold text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded-md">
                    {associatedSport ? associatedSport.name.split(' ')[0] : '스포츠'}
                  </span>

                  {product.isSponsored ? (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                      SPONSORED
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-400">
                      추천장비
                    </span>
                  )}
                </div>

                {/* Brand & Name */}
                <p className="text-xs text-gray-400 font-medium">
                  {product.brand}
                </p>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#6C5CE7] transition-colors line-clamp-2 mt-0.5">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Badge if available */}
                {product.badgeText && (
                  <div className="mt-2.5 inline-block text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                    {product.badgeText}
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">판매가</span>
                  <span className="text-base font-black text-gray-900">
                    {product.price}
                  </span>
                </div>

                <button
                  onClick={() => handleProductClick(product)}
                  className="px-3 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <span>구매 링크</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sponsor Callout Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FAF8FF] via-white to-[#F5F3FF] border border-[#E2DCF9] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
            FOR BRANDS & SPONSORS
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
            운명(運動命)과 함께할 운동 브랜드를 찾습니다
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg">
            스포츠웨어, 피트니스 센터, 암벽장, 영양제 등 20대 대학생 타깃의 건강한 파트너십을 환영합니다.
          </p>
        </div>

        <button
          onClick={onOpenSponsor}
          className="px-6 py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer shrink-0"
        >
          제휴 및 협찬 제안하기
        </button>
      </div>
    </div>
  );
};
