import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Flame, MapPin, ArrowRight, GitCompare } from 'lucide-react';
import { Sport } from '../types';
import runnersPhoto from '../assets/images/college_running_photo_1789816975948.jpg';

interface SportsBrowseProps {
  sports: Sport[];
  onSelectSport: (sport: Sport) => void;
  onCompareSport: (sport: Sport) => void;
  onStartQuiz: () => void;
}

export const SportsBrowse: React.FC<SportsBrowseProps> = ({
  sports,
  onSelectSport,
  onCompareSport,
  onStartQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | '실내' | '실외'>('all');
  const [costFilter, setCostFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const categories = ['전체', '유산소', '근력', '라켓', '힐링/유연성', '이색/액티비티'];

  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      // Category filter
      if (selectedCategory !== '전체' && sport.category !== selectedCategory) {
        return false;
      }
      // Location filter
      if (locationFilter !== 'all') {
        if (locationFilter === '실내' && !sport.location.includes('실내')) return false;
        if (locationFilter === '실외' && !sport.location.includes('실외')) return false;
      }
      // Cost filter
      if (costFilter !== 'all' && sport.costLevel !== Number(costFilter)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = sport.name.toLowerCase().includes(query) || sport.englishName.toLowerCase().includes(query);
        const matchesIntro = sport.intro.toLowerCase().includes(query);
        const matchesTags = sport.tagList.some((t) => t.toLowerCase().includes(query));
        const matchesEffects = sport.effects.toLowerCase().includes(query);
        if (!matchesName && !matchesIntro && !matchesTags && !matchesEffects) {
          return false;
        }
      }
      return true;
    });
  }, [sports, selectedCategory, locationFilter, costFilter, searchTerm]);

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F2FF] text-[#7C6EE6] text-xs font-semibold mb-2">
            <span>운동 정보 백과</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            대학생 맞춤 운동 둘러보기
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            난이도, 한 달 실제 비용, 교내 시설 팁까지 10개 대표 종목을 한눈에 비교해보세요.
          </p>
        </div>

        {/* CTA Banner pill */}
        <button
          onClick={onStartQuiz}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-[#6C5CE7]/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>나만의 맞춤 운명 테스트하기</span>
        </button>
      </div>

      {/* Visual Header Banner with Real Running Photo */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E4DFFC] bg-gradient-to-r from-[#FAF9FF] via-white to-[#F5F2FF] shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD6FE] text-[#6C5CE7] text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Running & Sports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            “혼자 하면 작심삼일, 내게 맞는 운동이면 평생 습관”
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            실제 캠퍼스 트랙과 로드를 달리는 대학생 러너들처럼, 나의 성향과 지갑 사정에 꼭 맞는 운동을 시작해보세요.
            10가지 추천 종목의 현실적인 비용, 체감 효과, 교내 시설 팁을 확인하실 수 있습니다.
          </p>
        </div>
        <div className="w-full md:w-72 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-[#8B7FE8]/15 aspect-16/10">
          <img
            src={runnersPhoto}
            alt="야외 트랙을 함께 달리는 대학생 러너들의 실제 운동 모습"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#EDE9FE] shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input + Sub-filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="운동 이름, 키워드(가성비, 공강, 스트레스 등) 검색"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-xs sm:text-sm text-gray-800"
            />
          </div>

          {/* Location filter */}
          <div className="sm:col-span-3">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] text-xs sm:text-sm text-gray-700 bg-white"
            >
              <option value="all">장소: 전체</option>
              <option value="실내">실내 운동</option>
              <option value="실외">실외 운동</option>
            </select>
          </div>

          {/* Cost filter */}
          <div className="sm:col-span-3">
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] text-xs sm:text-sm text-gray-700 bg-white"
            >
              <option value="all">비용: 전체</option>
              <option value="1">가성비 최고 (0원~월 3만원)</option>
              <option value="2">적정 취미 (월 4~8만원)</option>
              <option value="3">투자/전문 레슨 (월 10만원+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sports Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            총 <span className="text-[#6C5CE7] font-bold">{filteredSports.length}개</span>의 운동
          </p>
        </div>

        {filteredSports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <p className="text-gray-400 text-sm">검색 조건에 일치하는 운동이 없습니다.</p>
            <button
              onClick={() => {
                setSelectedCategory('전체');
                setSearchTerm('');
                setLocationFilter('all');
                setCostFilter('all');
              }}
              className="text-xs font-semibold text-[#6C5CE7] hover:underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSports.map((sport) => (
              <div
                key={sport.id}
                className="bg-white rounded-3xl border border-[#ECE7FA] hover:border-[#8B7FE8] p-6 shadow-2xs hover:shadow-lg hover:shadow-[#8B7FE8]/10 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2.5 py-0.5 rounded-full border border-[#E4DFFC]">
                      {sport.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {sport.location}
                    </span>
                  </div>

                  {/* Sport Title */}
                  <h3
                    onClick={() => onSelectSport(sport)}
                    className="text-xl font-bold text-gray-900 group-hover:text-[#6C5CE7] transition-colors cursor-pointer"
                  >
                    {sport.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mb-3">
                    {sport.englishName}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {sport.intro}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sport.tagList.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF9FF] text-[#7C6EE6] border border-[#F0EDFC]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Specs Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">난이도</span>
                      <span className="font-extrabold text-amber-500 mt-0.5 block">
                        {'★'.repeat(sport.difficulty)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">비용</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">
                        {sport.costLevel === 1 ? '가성비 굿' : sport.costLevel === 2 ? '적당' : '투자필요'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">칼로리</span>
                      <span className="font-bold text-gray-700 mt-0.5 block flex items-center justify-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {sport.caloriesPerHour}
                      </span>
                    </div>
                  </div>

                  {/* Student Tip Preview */}
                  <div className="mt-3 text-[11px] text-gray-500 line-clamp-1">
                    <span className="font-semibold text-gray-700">추천: </span>
                    {sport.targetGroup}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => onSelectSport(sport)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold text-center transition-colors cursor-pointer"
                  >
                    상세 정보 보기
                  </button>
                  <button
                    onClick={() => onCompareSport(sport)}
                    title="다른 운동과 비교하기"
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-[#8B7FE8] hover:bg-[#F4F2FF] text-gray-600 hover:text-[#6C5CE7] transition-colors cursor-pointer"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
