import React, { useState } from 'react';
import { GitCompare, ArrowRight, Check, Sparkles, Flame, Wallet, MapPin, Dumbbell } from 'lucide-react';
import { Sport } from '../types';

interface SportCompareProps {
  sports: Sport[];
  initialSportA?: Sport | null;
  initialSportB?: Sport | null;
  onSelectSport: (sport: Sport) => void;
  onStartQuiz: () => void;
}

export const SportCompare: React.FC<SportCompareProps> = ({
  sports,
  initialSportA,
  initialSportB,
  onSelectSport,
  onStartQuiz,
}) => {
  const [sportAId, setSportAId] = useState<string>(initialSportA?.id || sports[0]?.id || 'running');
  const [sportBId, setSportBId] = useState<string>(
    initialSportB?.id || (initialSportA?.id === 'health' ? 'running' : 'health')
  );

  const sportA = sports.find((s) => s.id === sportAId) || sports[0];
  const sportB = sports.find((s) => s.id === sportBId) || sports[1];

  const presets = [
    { title: '러닝 vs 헬스', desc: '가장 흔한 대학생의 고민!', idA: 'running', idB: 'health' },
    { title: '요가 vs 필라테스', desc: '자세 교정과 체형 정렬의 승자?', idA: 'yoga', idB: 'pilates' },
    { title: '클라이밍 vs 테니스', desc: '트렌디한 20대 대세 액티비티', idA: 'climbing', idB: 'tennis' },
    { title: '수영 vs 복싱', desc: '시원한 전신 유산소 vs 폭발적 타격', idA: 'swimming', idB: 'boxing' },
  ];

  const handleApplyPreset = (idA: string, idB: string) => {
    setSportAId(idA);
    setSportBId(idB);
  };

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#7C6EE6] text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>1:1 종목 맞비교</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          운동 비교하기
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          두 운동 사이에서 갈팡질팡 고민 중인가요? 난이도, 실제 지출 비용, 효과를 나란히 비교해보세요.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 mr-1">추천 비교 조합:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset.idA, preset.idB)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#F4F2FF] border border-gray-200 hover:border-[#8B7FE8] text-gray-700 hover:text-[#6C5CE7] transition-all cursor-pointer shadow-2xs"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Comparison Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Sport A Selector */}
        <div className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-sm">
          <label className="block text-xs font-bold text-[#6C5CE7] mb-2 uppercase tracking-wide">
            운동 A 선택
          </label>
          <select
            value={sportAId}
            onChange={(e) => setSportAId(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-200 bg-white font-bold text-gray-900 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20"
          >
            {sports.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === sportBId}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>

        {/* Sport B Selector */}
        <div className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-sm">
          <label className="block text-xs font-bold text-[#8B7FE8] mb-2 uppercase tracking-wide">
            운동 B 선택
          </label>
          <select
            value={sportBId}
            onChange={(e) => setSportBId(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-200 bg-white font-bold text-gray-900 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20"
          >
            {sports.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === sportAId}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table / Grid */}
      <div className="bg-white rounded-3xl border border-[#ECE7FA] shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-[#FAF9FF] border-b border-[#ECE7FA] p-4 font-bold text-xs sm:text-sm text-gray-500">
          <div className="col-span-4 sm:col-span-3">비교 항목</div>
          <div className="col-span-4 sm:col-span-4 text-[#6C5CE7] text-center sm:text-left font-black">
            {sportA.name.split(' ')[0]}
          </div>
          <div className="col-span-4 sm:col-span-5 text-gray-800 text-center sm:text-left font-black">
            {sportB.name.split(' ')[0]}
          </div>
        </div>

        <div className="divide-y divide-gray-100 text-xs sm:text-sm">
          {/* Category & Location */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold">
              카테고리 / 장소
            </div>
            <div className="col-span-4 sm:col-span-4 font-semibold text-gray-800">
              <span className="px-2 py-0.5 rounded-md bg-[#F4F2FF] text-[#6C5CE7] mr-1">
                {sportA.category}
              </span>
              <span className="text-gray-500 text-xs">({sportA.location})</span>
            </div>
            <div className="col-span-4 sm:col-span-5 font-semibold text-gray-800">
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 mr-1">
                {sportB.category}
              </span>
              <span className="text-gray-500 text-xs">({sportB.location})</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold">
              입문 난이도
            </div>
            <div className="col-span-4 sm:col-span-4 font-extrabold text-amber-500">
              {'★'.repeat(sportA.difficulty)}
              <span className="text-gray-300">{'★'.repeat(5 - sportA.difficulty)}</span>
            </div>
            <div className="col-span-4 sm:col-span-5 font-extrabold text-amber-500">
              {'★'.repeat(sportB.difficulty)}
              <span className="text-gray-300">{'★'.repeat(5 - sportB.difficulty)}</span>
            </div>
          </div>

          {/* Monthly Cost */}
          <div className="grid grid-cols-12 p-4 items-start">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-[#7C6EE6]" />
              <span>예상 한 달 비용</span>
            </div>
            <div className="col-span-4 sm:col-span-4 font-bold text-gray-800 leading-snug">
              {sportA.estimatedCost}
            </div>
            <div className="col-span-4 sm:col-span-5 font-bold text-gray-800 leading-snug">
              {sportB.estimatedCost}
            </div>
          </div>

          {/* Calories */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>1시간 소모 칼로리</span>
            </div>
            <div className="col-span-4 sm:col-span-4 font-bold text-gray-800">
              약 {sportA.caloriesPerHour} kcal
            </div>
            <div className="col-span-4 sm:col-span-5 font-bold text-gray-800">
              약 {sportB.caloriesPerHour} kcal
            </div>
          </div>

          {/* Core Effects */}
          <div className="grid grid-cols-12 p-4 items-start">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold">
              주요 운동 효과
            </div>
            <div className="col-span-4 sm:col-span-4 text-gray-700 leading-relaxed pr-2">
              {sportA.effects}
            </div>
            <div className="col-span-4 sm:col-span-5 text-gray-700 leading-relaxed">
              {sportB.effects}
            </div>
          </div>

          {/* Items needed */}
          <div className="grid grid-cols-12 p-4 items-start">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold">
              필수 준비물
            </div>
            <div className="col-span-4 sm:col-span-4 text-gray-700 leading-relaxed pr-2">
              {sportA.items}
            </div>
            <div className="col-span-4 sm:col-span-5 text-gray-700 leading-relaxed">
              {sportB.items}
            </div>
          </div>

          {/* Target students */}
          <div className="grid grid-cols-12 p-4 items-start">
            <div className="col-span-4 sm:col-span-3 text-gray-400 font-semibold">
              추천 대상
            </div>
            <div className="col-span-4 sm:col-span-4 text-gray-700 leading-relaxed pr-2">
              {sportA.targetGroup}
            </div>
            <div className="col-span-4 sm:col-span-5 text-gray-700 leading-relaxed">
              {sportB.targetGroup}
            </div>
          </div>

          {/* College student tips */}
          <div className="grid grid-cols-12 p-4 items-start bg-[#FEFDF0]">
            <div className="col-span-4 sm:col-span-3 text-amber-700 font-bold">
              대학생 초보자 꿀팁
            </div>
            <div className="col-span-4 sm:col-span-4 text-amber-900 leading-relaxed pr-2 text-xs">
              {sportA.beginnerTip}
            </div>
            <div className="col-span-4 sm:col-span-5 text-amber-900 leading-relaxed text-xs">
              {sportB.beginnerTip}
            </div>
          </div>
        </div>

        {/* Card Footer actions */}
        <div className="grid grid-cols-12 p-4 bg-[#FCFBFF] border-t border-gray-100 gap-4">
          <div className="col-span-4 sm:col-span-3" />
          <div className="col-span-4 sm:col-span-4">
            <button
              onClick={() => onSelectSport(sportA)}
              className="w-full py-2 px-3 rounded-xl bg-[#6C5CE7] text-white text-xs font-bold text-center hover:bg-[#5E4EE0] transition-colors cursor-pointer"
            >
              {sportA.name.split(' ')[0]} 상세보기
            </button>
          </div>
          <div className="col-span-4 sm:col-span-5">
            <button
              onClick={() => onSelectSport(sportB)}
              className="w-full py-2 px-3 rounded-xl bg-gray-800 text-white text-xs font-bold text-center hover:bg-black transition-colors cursor-pointer"
            >
              {sportB.name.split(' ')[0]} 상세보기
            </button>
          </div>
        </div>
      </div>

      {/* Decision Helper Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F4F2FF] to-[#FAF8FF] border border-[#E4DFFC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            여전히 두 운동 중 어떤 게 나에게 맞을지 헷갈리시나요?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            운동 목적과 시간표, 한 달 예산 질문으로 3분 만에 딱 정해드립니다.
          </p>
        </div>
        <button
          onClick={onStartQuiz}
          className="px-5 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#6C5CE7]/25 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>성향 테스트로 결정하기</span>
        </button>
      </div>
    </div>
  );
};
