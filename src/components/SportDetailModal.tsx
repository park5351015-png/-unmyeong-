import React from 'react';
import { X, Sparkles, Dumbbell, Wallet, HeartPulse, CheckSquare, Lightbulb, Users, MapPin, Flame, ArrowRight, GitCompare } from 'lucide-react';
import { Sport, ProductItem } from '../types';

interface SportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport: Sport | null;
  onCompareWith: (sport: Sport) => void;
  onViewProducts: (sportId: string) => void;
  products: ProductItem[];
}

export const SportDetailModal: React.FC<SportDetailModalProps> = ({
  isOpen,
  onClose,
  sport,
  onCompareWith,
  onViewProducts,
  products,
}) => {
  if (!isOpen || !sport) return null;

  const relevantProducts = products.filter((p) => p.sportId === sport.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FAF8FF] to-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2.5 py-0.5 rounded-full border border-[#E4DFFC]">
              {sport.category}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {sport.englishName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Main Title & Intro */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {sport.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold">
                {sport.location}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed pt-1">
              {sport.intro}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3">
              {sport.tagList.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F5F3FF] text-[#7C6EE6]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[11px] font-medium">초보 난이도</span>
              <span className="font-extrabold text-amber-500 text-sm mt-0.5 block">
                {'★'.repeat(sport.difficulty)}
                <span className="text-gray-300">{'★'.repeat(5 - sport.difficulty)}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[11px] font-medium">비용 부담도</span>
              <span className="font-extrabold text-[#6C5CE7] text-sm mt-0.5 block">
                {sport.costLevel === 1 ? '가성비 최고 (★☆☆)' : sport.costLevel === 2 ? '보통 수준 (★★☆)' : '다소 투자 (★★★)'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[11px] font-medium">1시간 소모 칼로리</span>
              <span className="font-extrabold text-gray-800 text-sm mt-0.5 block flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {sport.caloriesPerHour} kcal
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[11px] font-medium">운동 장소</span>
              <span className="font-extrabold text-gray-800 text-sm mt-0.5 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                {sport.location}
              </span>
            </div>
          </div>

          {/* Detailed Info Sections */}
          <div className="space-y-4 pt-1">
            {/* 1. 예상 비용 */}
            <div className="p-4 rounded-2xl bg-[#FAFAFD] border border-[#ECE7FA]">
              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-900">
                <Wallet className="w-4 h-4 text-[#6C5CE7]" />
                <span>예상 한 달 비용 & 대학생 팁</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                {sport.estimatedCost}
              </p>
            </div>

            {/* 2. 주요 운동 효과 */}
            <div className="p-4 rounded-2xl bg-[#FAFAFD] border border-[#ECE7FA]">
              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-900">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>주요 운동 효과</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {sport.effects}
              </p>
            </div>

            {/* 3. 준비물 */}
            <div className="p-4 rounded-2xl bg-[#FAFAFD] border border-[#ECE7FA]">
              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-900">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>필요한 준비물 & 복장</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {sport.items}
              </p>
            </div>

            {/* 4. 추천 대상 */}
            <div className="p-4 rounded-2xl bg-[#FAFAFD] border border-[#ECE7FA]">
              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-900">
                <Users className="w-4 h-4 text-sky-600" />
                <span>이런 대학생에게 딱 맞아요!</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {sport.targetGroup}
              </p>
            </div>

            {/* 5. 초보자 꿀팁 (Highlight) */}
            <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A]">
              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-[#854D0E]">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>선배가 알려주는 초보자 핵심 TIP</span>
              </div>
              <p className="text-xs sm:text-sm text-[#713F12] leading-relaxed">
                {sport.beginnerTip}
              </p>
            </div>
          </div>

          {/* Recommended Starter Gear Preview */}
          {relevantProducts.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900">
                  {sport.name.split(' ')[0]} 시작 아이템 & 추천 장비
                </h4>
                <button
                  onClick={() => onViewProducts(sport.id)}
                  className="text-xs font-semibold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>전체보기</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relevantProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      {prod.isSponsored && (
                        <span className="text-[10px] font-bold text-[#6C5CE7] bg-[#F4F2FF] px-1.5 py-0.5 rounded-md mr-1">
                          SPONSORED
                        </span>
                      )}
                      <p className="font-bold text-gray-800 line-clamp-1">{prod.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{prod.brand} · {prod.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#FCFBFF] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onCompareWith(sport)}
            className="px-4 py-2.5 rounded-xl border border-[#D5CFF9] hover:border-[#8B7FE8] bg-white text-xs sm:text-sm font-semibold text-[#6C5CE7] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <GitCompare className="w-4 h-4" />
            <span>다른 운동과 비교하기</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProducts(sport.id)}
              className="px-4 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>시작 장비 추천</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
