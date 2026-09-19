import React, { useState } from 'react';
import { X, Sparkles, Share2, RotateCcw, ArrowRight, Check, Heart, Trophy, Zap, Shield, Flame } from 'lucide-react';
import { UserTestResult, Sport } from '../types';

interface TestResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: UserTestResult | null;
  onRetest: () => void;
  onViewSportDetail: (sport: Sport) => void;
  onViewProducts: (sportId: string) => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onRetest,
  onViewSportDetail,
  onViewProducts,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSportIndex, setActiveSportIndex] = useState(0);

  if (!isOpen || !result) return null;

  const currentRecommendation = result.topSports[activeSportIndex] || result.topSports[0];
  const primarySport = result.topSports[0]?.sport;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FAF8FF] to-white">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#F4F2FF] text-[#6C5CE7]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              나의 운명(運動命) 매칭 결과
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Persona Card */}
          <div className="bg-gradient-to-br from-[#F5F3FF] via-[#FAF9FF] to-white p-6 rounded-3xl border border-[#E4DFFC] text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-2xs border border-white/60 bg-white text-[#6C5CE7]">
              <span>🎓 대학생 운동 성향 캐릭터</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              &quot;{result.persona.title}&quot;
            </h2>
            <p className="text-sm font-semibold text-[#6C5CE7] mt-1">
              {result.persona.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
              {result.persona.description}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-gray-500 bg-white/70 px-3 py-1 rounded-full border border-gray-100">
              <span>운명 궁합 1위 :</span>
              <span className="text-[#6C5CE7] font-bold">{primarySport.name}</span>
            </div>
          </div>

          {/* TOP 3 Ranking Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>나와 가장 잘 맞는 운동 TOP 3</span>
              </h3>
              <span className="text-xs text-gray-400">클릭하여 세부 분석 확인</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {result.topSports.map((item, idx) => {
                const isActive = activeSportIndex === idx;
                return (
                  <button
                    key={item.sport.id}
                    onClick={() => setActiveSportIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#F4F2FF] border-[#8B7FE8] ring-2 ring-[#8B7FE8]/20 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800'
                            : idx === 1
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}
                      >
                        TOP {idx + 1}
                      </span>
                      <span className="text-xs font-black text-[#6C5CE7]">
                        {item.matchPercent}%
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-[#5E4EE0]' : 'text-gray-800'}`}>
                      {item.sport.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {item.sport.category}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Card for Selected Recommended Sport */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9E4FC] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2.5 py-0.5 rounded-full">
                    적합도 {currentRecommendation.matchPercent}%
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {currentRecommendation.sport.category} · {currentRecommendation.sport.location}
                  </span>
                </div>
                <h4 className="text-xl font-black text-gray-900 mt-1.5">
                  {currentRecommendation.sport.name}
                </h4>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => onViewSportDetail(currentRecommendation.sport)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  상세 가이드 보기
                </button>
                <button
                  onClick={() => onViewProducts(currentRecommendation.sport.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>시작 아이템</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Why this is destiny */}
            <div>
              <p className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wide mb-1">
                왜 이 운동이 나의 운명일까요?
              </p>
              <p className="text-sm text-gray-700 leading-relaxed font-medium bg-[#FAF9FF] p-3.5 rounded-2xl border border-[#ECE7FA]">
                💡 {currentRecommendation.matchReason}
              </p>
            </div>

            {/* Key Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[11px]">예상 한 달 비용</span>
                <span className="font-bold text-gray-800 line-clamp-1 mt-0.5">
                  {currentRecommendation.sport.estimatedCost.split('(')[0]}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[11px]">초보자 난이도</span>
                <span className="font-bold text-amber-600 mt-0.5 block">
                  {'★'.repeat(currentRecommendation.sport.difficulty)}
                  <span className="text-gray-300">
                    {'★'.repeat(5 - currentRecommendation.sport.difficulty)}
                  </span>
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 col-span-2 sm:col-span-1">
                <span className="text-gray-400 block text-[11px]">1시간 소모 칼로리</span>
                <span className="font-bold text-gray-800 mt-0.5 block">
                  약 {currentRecommendation.sport.caloriesPerHour} kcal
                </span>
              </div>
            </div>

            {/* Student Tip */}
            <div className="bg-[#FEFCE8] p-3 rounded-2xl border border-[#FEF08A] text-xs text-[#854D0E] leading-relaxed">
              <span className="font-bold">🏫 대학생 꿀팁: </span>
              {currentRecommendation.sport.beginnerTip}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#FCFBFF] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onRetest}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>테스트 다시하기</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">링크 복사 완료!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gray-500" />
                  <span>결과 공유하기</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              확인 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
