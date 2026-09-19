import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Users, GitCompare, HelpCircle, ChevronDown, ChevronUp, Folder, MessageSquare, Flame, Check, ExternalLink, Terminal } from 'lucide-react';
import { Sport } from '../types';
import skyBg from '../assets/images/sky_clouds_banner_1789817256135.jpg';

interface HowItWorksProps {
  onStartQuiz: () => void;
  sports: Sport[];
  onSelectSport: (sport: Sport) => void;
  onGoToCommunity?: () => void;
  onGoToCompare?: () => void;
  onGoToProducts?: () => void;
  onOpenSponsor?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onStartQuiz,
  sports,
  onSelectSport,
  onGoToCommunity,
  onGoToCompare,
  onGoToProducts,
  onOpenSponsor,
}) => {
  // Active sport index for interactive window demo
  const [activeSportIndex, setActiveSportIndex] = useState(0);
  const sampleSport = sports[activeSportIndex] || sports[0] || {
    id: 'running',
    name: '러닝 (Running)',
    englishName: 'Running',
    category: '유산소' as const,
    costLevel: 1 as const,
    estimatedCost: '월 0원 ~ 1만 원',
    difficulty: 1,
    location: '실외' as const,
    intro: '언제 어디서나 운동화만 있으면 달릴 수 있는 최고의 유산소 운동',
    effects: '심폐지구력 강화, 스트레스 해소',
    items: '러닝화, 편한 복장',
    beginnerTip: '처음엔 기록보다 15분 천천히 걷고 뛰기를 반복하세요.',
    studentSuitability: '교내 운동장 우레탄 트랙은 무릎 부상을 줄여주는 최고의 무료 코스입니다.',
    targetGroup: '모든 대학생',
    caloriesPerHour: 550,
    tagList: ['가성비', '혼자가능', '스트레스해소'],
    iconName: 'Footprints',
  };

  // Pricing Plan tab toggle
  const [pricingTab, setPricingTab] = useState<'student' | 'club' | 'sponsor'>('student');

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '운명(unmyeong)은 어떤 서비스인가요?',
      a: '운명(運動命)은 운동을 시작하고 싶지만 내 체력, 시간표, 예산에 맞는 운동이 무엇인지 모르는 대학생들을 위한 맞춤형 스포츠 추천 플랫폼입니다. 3분 성향 진단을 통해 대학생 선호 TOP 10 종목 중 궁합률이 가장 높은 운동과 교내 시설 팁을 알려드립니다.',
    },
    {
      q: '성향 테스트는 무료인가요? 얼마나 걸리나요?',
      a: '100% 무료이며 회원가입 없이도 누구나 3분 안에 8가지 간단한 질문에 답하고 나만의 맞춤 결과와 추천 캐릭터를 확인할 수 있습니다.',
    },
    {
      q: '용돈이 부족한 대학생도 할 수 있는 운동이 있나요?',
      a: '물론입니다! 월 비용 0원으로 시작할 수 있는 캠퍼스 트랙 러닝, 교내 학관 체력단련실 헬스, 맨몸 칼리스데닉스부터 한 달 3~5만원대 가성비 클라이밍·수영까지 지갑 사정에 최적화된 운동을 큐레이션해 드립니다.',
    },
    {
      q: '운동 메이트는 어떻게 구하나요?',
      a: '상단 [메이트 커뮤니티] 탭에서 학교별, 종목별(러닝, 헬스, 클라이밍, 테니스 등)로 함께 운동할 대학생 친구들을 자유롭게 모집하고 번개 모임에 참여할 수 있습니다.',
    },
    {
      q: '스포츠 브랜드나 시설 제휴는 어떻게 신청하나요?',
      a: '하단 [비즈니스 & 제휴] 버튼이나 스폰서 신청 모달을 통해 대학생 할인 프로모션, 장비 협찬, 팝업 이벤트 제휴를 간편하게 문의하실 수 있습니다.',
    },
  ];

  const studentReviews = [
    {
      name: '김준혁',
      handle: '@jh_runner',
      univ: '서울대 체육교육',
      sport: '캠퍼스 러닝',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      comment: '시험기간마다 무작정 헬스장 끊고 안 나갔는데, 운명 테스트로 야외 러닝 추천받고 벌써 6개월째 공강마다 뛰고 있어요. 진짜 갓생 루틴!',
      time: '2시간 전',
      likes: 48,
    },
    {
      name: '이지우',
      handle: '@jiwoo_boulder',
      univ: '연세대 경영',
      sport: '클라이밍 (볼더링)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      comment: '한 달 용돈 5만원 예산으로 볼더링 시작할 수 있을까 걱정했는데, 교내 동아리 암벽화 대여 팁 보고 입문 완료했습니다. 문제 풀 때 쾌감 대박!',
      time: '어제',
      likes: 62,
    },
    {
      name: '박민수',
      handle: '@minsoo_tennis',
      univ: '고려대 기계공학',
      sport: '테니스',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      comment: '테니스 라켓 가격이랑 레슨비 맞비교 기능 보고 감 잡았어요. 교내 코트 예약해서 동기랑 랠리 연습 중입니다.',
      time: '3일 전',
      likes: 35,
    },
    {
      name: '최수아',
      handle: '@suah_pilates',
      univ: '이화여대 영문',
      sport: '필라테스 & 요가',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      comment: '자세 교정이랑 멘탈 케어가 필요했는데 제 성향이랑 95% 일치하는 운동으로 딱 골라줘서 너무 신기했어요. 거북목 탈출!',
      time: '5일 전',
      likes: 54,
    },
    {
      name: '정현우',
      handle: '@hw_swim',
      univ: '성균관대 전자전기',
      sport: '수영',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      comment: '관절 무리 안 가고 땀 안 흘리는 운동 찾고 있었는데 구립 수영장 대학생 감면 혜택 꿀팁 덕분에 새벽반 등록했습니다.',
      time: '1주일 전',
      likes: 41,
    },
    {
      name: '강다은',
      handle: '@daeun_crossfit',
      univ: '카이스트 전산',
      sport: '크로스핏',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      comment: '운동 메이트 찾기 탭에서 학교 근처 박스 같이 다닐 크루 찾아서 매일 출석 도장 찍는 중입니다. 혼자 할 땐 절대 못 했을 듯!',
      time: '2주일 전',
      likes: 89,
    },
  ];

  return (
    <div className="bg-[#FBFBFE] text-gray-800">
      {/* =========================================================================
          FEATURE 1: "finally find your thing" (macOS Window + Chat Bubbles)
         ========================================================================= */}
      <section className="py-16 md:py-24 border-t border-gray-200/80 bg-dot-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Chat Bubble & Text */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Retro dot indicators like heyclicky */}
              <div className="flex items-center gap-1 text-gray-400 font-mono text-xs">
                <span>• • • • • • • •</span>
              </div>

              {/* Chat Bubble from User */}
              <div className="inline-block relative">
                <div className="px-5 py-3 rounded-2xl rounded-bl-xs bg-[#E0E7FF] border border-[#C7D2FE] text-gray-900 font-medium text-sm sm:text-base shadow-xs">
                  운명아, 오늘 공강 2시간인데 가볍게 할 운동 없을까?
                </div>
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight lowercase">
                  finally find your thing
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  비싼 헬스장 회원권 끊고 기부만 하셨나요? <br />
                  나의 체력 레벨, 주간 시간표 빈틈, 한 달 예산에 딱 맞는 현실적인 인생 운동을 3분 만에 찾아드립니다.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartQuiz}
                  className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3분 성향 진단 시작하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: macOS App Window (Interactive Sport Matrix) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-xl shadow-gray-200/50 overflow-hidden text-left">
                {/* Title Bar */}
                <div className="h-9 bg-gray-100/90 border-b border-gray-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 font-medium">
                    recommendation_engine.app
                  </span>
                  <div className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    98% MATCH
                  </div>
                </div>

                {/* Window Inner Content */}
                <div className="p-5 sm:p-7 space-y-6">
                  {/* Category switcher tabs inside window */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {sports.slice(0, 5).map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveSportIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          activeSportIndex === idx
                            ? 'bg-[#4F46E5] text-white shadow-xs font-semibold'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {s.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Sport Detail Card */}
                  <div className="bg-[#FAF9FD] rounded-2xl border border-gray-200/80 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/70 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {sampleSport.name}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {sampleSport.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {sampleSport.location} · 난이도: {'★'.repeat(sampleSport.difficulty)}{'☆'.repeat(5 - sampleSport.difficulty)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] font-mono text-gray-400">예상 월 비용</span>
                        <p className="text-sm font-bold text-indigo-600">{sampleSport.estimatedCost}</p>
                      </div>
                    </div>

                    {/* Campus Tip & Starter Advice */}
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="font-bold text-gray-800 mr-1.5">🏫 대학생 시설 팁:</span>
                        <span className="text-gray-600">{sampleSport.studentSuitability}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200/80">
                        <span className="font-bold text-gray-800 mr-1.5">💡 입문자 꿀팁:</span>
                        <span className="text-gray-600">{sampleSport.beginnerTip}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {sampleSport.tagList.map((tag, i) => (
                          <span key={i} className="text-[11px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => onSelectSport(sampleSport)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>자세히 보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 2: "use your campus as context" (macOS Window + Chat Bubbles)
         ========================================================================= */}
      <section className="py-16 md:py-24 border-t border-gray-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: macOS Window (Campus Facilities & Cost Breakdown) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-xl shadow-gray-200/50 overflow-hidden text-left">
                {/* Title Bar */}
                <div className="h-9 bg-gray-100/90 border-b border-gray-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 font-medium">
                    campus_cost_calculator.app
                  </span>
                  <div className="w-8" />
                </div>

                {/* Content: Real Campus Price Matrix */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-left">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                        월 0원 코스
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">캠퍼스 대운동장 트랙</h4>
                      <p className="text-[11px] text-gray-600 mt-1">
                        무료 개방, 우레탄 트랙 충격 흡수, 공강 시간 30분 러닝
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-left">
                      <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider">
                        학기당 2~3만원
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">학관 체력단련실</h4>
                      <p className="text-[11px] text-gray-600 mt-1">
                        사설 헬스장 대비 85% 저렴, 샤워실 완비, 학생증 출입
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] text-left">
                      <span className="text-[10px] font-mono font-bold text-purple-800 uppercase tracking-wider">
                        학생 할인 팁
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">학교 앞 볼더링 암장</h4>
                      <p className="text-[11px] text-gray-600 mt-1">
                        대학생 평일 낮 시간권 할인, 동아리 단체 제휴 암벽화 대여
                      </p>
                    </div>
                  </div>

                  {/* Starter Product Comparison Box */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-800">
                        초보자 가성비 스타터 아이템 가이드
                      </p>
                      <p className="text-[11px] text-gray-500">
                        처음부터 풀세트 사지 마세요! 꼭 필요한 입문 아이템 1~2개만 추천합니다.
                      </p>
                    </div>
                    {onGoToProducts && (
                      <button
                        onClick={onGoToProducts}
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        추천 장비 목록 보기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Chat Bubble & Text */}
            <div className="lg:col-span-5 space-y-6 text-left order-1 lg:order-2">
              <div className="flex items-center gap-1 text-gray-400 font-mono text-xs">
                <span>• • • • • • • •</span>
              </div>

              {/* Chat Bubble from User & Response */}
              <div className="space-y-2">
                <div className="inline-block px-5 py-3 rounded-2xl rounded-br-xs bg-[#E0E7FF] border border-[#C7D2FE] text-gray-900 font-medium text-sm shadow-xs">
                  운명아, 내 한 달 용돈 5만원으로 클라이밍 시작할 수 있어?
                </div>
                <div className="inline-block px-4 py-2 rounded-2xl rounded-tl-xs bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs shadow-xs">
                  on it. 🧗
                </div>
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight lowercase">
                  use your campus as context
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  학교 안팎에 숨어 있는 알짜 체육 시설과 대학생 할인 혜택을 100% 활용하세요.
                  교내 테니스 코트, 구립 수영장, 학생 할인 클라이밍짐까지 현실적인 가성비 동선을 설계해 드립니다.
                </p>
              </div>

              {onGoToCompare && (
                <div className="pt-2">
                  <button
                    onClick={onGoToCompare}
                    className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>운동 1:1 맞비교 분석해보기</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE 3: "spawn sport mates with no awkwardness" (Community & Mate Preview)
         ========================================================================= */}
      <section className="py-16 md:py-24 border-t border-gray-200/80 bg-dot-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Chat Bubble & Text */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="flex items-center gap-1 text-gray-400 font-mono text-xs">
                <span>• • • • • • • •</span>
              </div>

              {/* Chat Bubble */}
              <div className="inline-block px-5 py-3 rounded-2xl rounded-bl-xs bg-[#E0E7FF] border border-[#C7D2FE] text-gray-900 font-medium text-sm shadow-xs">
                운명아, 이번 주말 한강 5km 같이 달릴 페이스메이커 찾아줘
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight lowercase">
                  find mates with no pressure
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  혼자 하면 비 온다고 미루고, 피곤하다고 쉬게 되죠. <br />
                  같은 학교, 같은 페이스의 운동 메이트와 함께라면 작심삼일이 평생 즐거운 루틴으로 바뀝니다.
                </p>
              </div>

              {onGoToCommunity && (
                <div className="pt-2">
                  <button
                    onClick={onGoToCommunity}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>실시간 메이트 게시판 가기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: macOS Window with sample community mate feed */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-200/90 shadow-xl shadow-gray-200/50 overflow-hidden text-left">
                {/* Title Bar */}
                <div className="h-9 bg-gray-100/90 border-b border-gray-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 font-medium">
                    campus_mate_feed.app
                  </span>
                  <div className="w-8" />
                </div>

                {/* Sample Mate Posts */}
                <div className="p-5 space-y-3 bg-[#FAF9FD]">
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        🏃 야간 러닝 번개
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">오늘 저녁 8시</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      대운동장 트랙 5km 가볍게 페이스 630으로 달릴 분! (초보 환영)
                    </p>
                    <p className="text-[11px] text-gray-500">
                      혼자 뛰면 심심해서 가볍게 땀 흘리실 분 편하게 모여요 👟
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        🧗 볼더링 크루 모집
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">이번 주 토요일 오후 2시</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      학교 앞 클라이밍짐 빨강/파랑 난이도 같이 깰 파티원 구해요
                    </p>
                    <p className="text-[11px] text-gray-500">
                      첫 암벽화 대여 팁 공유해 드립니다!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: "THE DREAM" (The Philosophy in macOS Notes App + Folder Cascades)
         ========================================================================= */}
      <section className="py-20 md:py-28 border-t border-gray-200/80 bg-gradient-to-b from-[#FAF9FD] via-white to-[#FAF9FD] relative overflow-hidden text-center">
        {/* Decorative 3D Folder Cascades on Left & Right from reference */}
        <div className="hidden xl:block absolute left-4 top-1/2 -translate-y-1/2 opacity-75 pointer-events-none">
          <div className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-12 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 shadow-md border-t border-white/50 -rotate-12 translate-x-6"
                style={{ transform: `translateX(${i * 10}px) rotate(-15deg)` }}
              />
            ))}
          </div>
        </div>

        <div className="hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 opacity-75 pointer-events-none">
          <div className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-14 h-12 rounded-lg bg-gradient-to-r from-amber-300 to-emerald-400 shadow-md border-t border-white/50 rotate-12 -translate-x-6"
                style={{ transform: `translateX(-${i * 10}px) rotate(15deg)` }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Badge: THE DREAM */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-300 text-gray-500 text-[11px] font-mono uppercase tracking-widest mb-6 shadow-2xs">
            <span>THE PHILOSOPHY</span>
          </div>

          {/* macOS Notes Window */}
          <div className="rounded-3xl bg-[#FFFDF5] border border-[#E7E2C9] shadow-2xl shadow-amber-900/5 overflow-hidden text-left">
            {/* Notes Window Header */}
            <div className="h-8 bg-[#F5EFCF] border-b border-[#E7E2C9] px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[11px] font-mono text-amber-900/60 font-medium">notes</span>
              <div className="w-6" />
            </div>

            {/* Note Body */}
            <div className="p-6 sm:p-8 space-y-4 text-gray-800 text-sm sm:text-base leading-relaxed font-sans">
              <p>
                우리는 누구나 더 건강하고 에너지 넘치는 대학생활을 꿈꿉니다. 하지만 막상 운동을 시작하려고 하면,
                수많은 헬스장 광고와 값비싼 개인 PT, 쏟아지는 정보 속에서 무엇을 해야 할지 망설이다 포기하곤 합니다.
              </p>
              <p>
                운동은 고통스러운 의무가 아닙니다. <strong>내 성향에 꼭 맞는 운동을 찾으면, 운동은 평생 함께하는 가장 즐거운 놀이이자 습관</strong>이 됩니다.
              </p>
              <p className="text-gray-600 text-xs sm:text-sm">
                시험기간, 불규칙한 시간표, 얇은 대학생 지갑 사정까지 모두 고려한 가장 정직하고 유쾌한 운동 버디가 되어드리겠습니다.
              </p>

              <div className="pt-4 border-t border-[#E7E2C9]/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">운명(運動命) 캠퍼스 팀</p>
                  <p className="text-[11px] text-gray-500 font-mono">founders</p>
                </div>
                <span className="text-lg font-black tracking-tight text-[#4F46E5]">
                  unmyeong
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SOCIAL PROOF: "they use it everyday" Marquee & Reviews Grid
         ========================================================================= */}
      <section className="py-16 md:py-24 border-t border-gray-200/80 bg-white overflow-hidden text-center">
        {/* Marquee Ticker */}
        <div className="mb-4 overflow-hidden relative select-none">
          <div className="animate-marquee whitespace-nowrap text-3xl sm:text-4xl md:text-5xl font-black text-gray-200 tracking-tight flex items-center gap-8">
            <span>they use it everyday</span>
            <span className="text-gray-300">★</span>
            <span className="text-gray-900">they use it everyday</span>
            <span className="text-gray-300">★</span>
            <span>they use it everyday</span>
            <span className="text-gray-300">★</span>
            <span className="text-gray-900">they use it everyday</span>
            <span className="text-gray-300">★</span>
          </div>
        </div>

        {/* Retro Sticker Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs rotate-1">
            <span>⭐️ No Regrets! 실제 대학생들의 생생한 후기</span>
          </div>
        </div>

        {/* Reviews Grid (macOS mini windows) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentReviews.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow text-left overflow-hidden flex flex-col justify-between"
              >
                {/* Mini macOS Bar */}
                <div className="h-6 bg-gray-100/80 border-b border-gray-200 px-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 truncate">{rev.handle}</span>
                  <div className="w-3" />
                </div>

                {/* Review Body */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-none">{rev.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{rev.univ}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      {rev.sport}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="px-4 py-2 border-t border-gray-100 bg-[#FAFAFC] flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>{rev.time}</span>
                  <div className="flex items-center gap-1 text-rose-500 font-semibold">
                    <span>❤️</span>
                    <span>{rev.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <span className="text-xs font-mono text-gray-500">
              2,840+ happy campus runners and counting.{' '}
              <button
                onClick={onStartQuiz}
                className="text-indigo-600 font-bold underline hover:text-indigo-800 cursor-pointer"
              >
                join them
              </button>
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRICING & GUIDES: "unmyeong, your way" (Sky with Fluffy Clouds Background!)
         ========================================================================= */}
      <section
        className="relative py-20 md:py-28 text-center text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${skyBg})` }}
      >
        {/* Soft overlay gradient for perfect readability */}
        <div className="absolute inset-0 bg-blue-900/35 backdrop-blur-2xs" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Badge: PRICING / GUIDE */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-mono uppercase tracking-widest mb-4 shadow-sm">
            <span>100% FREE FOR STUDENTS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            unmyeong, your way
          </h2>
          <p className="text-sm sm:text-base text-blue-50 mt-2 max-w-md mx-auto font-medium drop-shadow-xs">
            대학생의 더 건강한 일상을 위한 열린 스포츠 큐레이션
          </p>

          {/* Toggle pill */}
          <div className="mt-6 inline-flex items-center p-1 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-xs font-semibold text-white">
            <button
              onClick={() => setPricingTab('student')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                pricingTab === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-white/80'
              }`}
            >
              대학생 무료
            </button>
            <button
              onClick={() => setPricingTab('club')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                pricingTab === 'club' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-white/80'
              }`}
            >
              동아리·크루
            </button>
            <button
              onClick={() => setPricingTab('sponsor')}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                pricingTab === 'sponsor' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-white/80'
              }`}
            >
              제휴 파트너
            </button>
          </div>

          {/* 3 Frosted Glass macOS Cards (heyclicky style) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 1: Free */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-7 text-gray-900 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase text-gray-500">free</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    평생 0원
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">3분 성향 진단</h3>
                <p className="text-xs text-gray-500 mt-1">
                  내 라이프스타일에 맞는 운동 매칭
                </p>

                <div className="my-6">
                  <span className="text-4xl font-black text-gray-900">₩0</span>
                  <span className="text-xs text-gray-500 font-mono ml-1">/ 평생 무료</span>
                </div>

                <button
                  onClick={onStartQuiz}
                  className="w-full py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  지금 진단하기
                </button>

                <div className="mt-6 pt-5 border-t border-gray-200/80 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>8가지 문항 3분 라이프스타일 분석</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>궁합률(%) TOP 3 종목 추천</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>나만의 대학생 맞춤 성향 캐릭터</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Starter (Popular) */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-indigo-400 p-6 sm:p-7 text-gray-900 shadow-2xl relative flex flex-col justify-between">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold shadow-sm uppercase tracking-wider">
                popular
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-600">guide</span>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    인기 큐레이션
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">10가지 운동 가이드</h3>
                <p className="text-xs text-gray-500 mt-1">
                  교내 시설 팁 & 1:1 맞비교 분석
                </p>

                <div className="my-6">
                  <span className="text-4xl font-black text-gray-900">₩0</span>
                  <span className="text-xs text-gray-500 font-mono ml-1">/ 무제한 열람</span>
                </div>

                <button
                  onClick={() => onSelectSport(sports[0])}
                  className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  가이드 둘러보기
                </button>

                <div className="mt-6 pt-5 border-t border-gray-200/80 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>대학생 인기 10가지 운동 상세 데이터 (비용/난이도)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>운동 1:1 레이더 차트 맞비교</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>입문자를 위한 가성비 장비 팁</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Community */}
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-6 sm:p-7 text-gray-900 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase text-gray-500">community</span>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    실시간 소통
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900">캠퍼스 메이트</h3>
                <p className="text-xs text-gray-500 mt-1">
                  학교별 운동 파트너 & 번개 모임
                </p>

                <div className="my-6">
                  <span className="text-4xl font-black text-gray-900">₩0</span>
                  <span className="text-xs text-gray-500 font-mono ml-1">/ 자유 참여</span>
                </div>

                {onGoToCommunity && (
                  <button
                    onClick={onGoToCommunity}
                    className="w-full py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    메이트 게시판 가기
                  </button>
                )}

                <div className="mt-6 pt-5 border-t border-gray-200/80 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>종목별·지역별 운동 메이트 찾기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>실제 대학생 운동 후기 및 Q&A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>교내 운동 동아리 정보 공유</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retro Monospace Dark Terminal (Maker discount / Campus perk in reference) */}
          <div className="mt-10 max-w-3xl mx-auto rounded-2xl bg-gray-950/95 backdrop-blur-md border border-gray-800 text-left overflow-hidden shadow-2xl">
            <div className="h-8 bg-gray-900 border-b border-gray-800 px-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[10px] font-mono text-gray-400">&lt; campus perk &gt;</span>
              <div className="w-6" />
            </div>
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1 text-gray-300">
                <p className="text-emerald-400 font-bold">$ unmyeong --student-benefit</p>
                <p className="text-gray-400 text-[11px]">
                  전국 대학생 누구나 별도 학생증 인증 없이 전 기능 100% 무료입니다.
                  브랜드 제휴 및 스포츠웨어 협찬은 파트너십 팀으로 연락주세요.
                </p>
              </div>
              {onOpenSponsor && (
                <button
                  onClick={onOpenSponsor}
                  className="px-4 py-2 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-sans font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
                >
                  제휴 문의하기
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ: frequently asked questions (heyclicky style accordion)
         ========================================================================= */}
      <section className="py-20 md:py-28 border-t border-gray-200/80 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-mono uppercase tracking-widest mb-3">
            <span>FAQ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight lowercase">
            frequently asked questions
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-10">
            운명(unmyeong) 서비스에 대해 대학생분들이 가장 자주 묻는 질문들을 모았습니다.
          </p>

          {/* Accordion List */}
          <div className="space-y-3 text-left">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200/90 bg-[#FBFBFE] hover:border-gray-300 transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-gray-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0 font-mono text-xs">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SPORTS BROWSE QUICK GLANCE: 10 representative campus sports
         ========================================================================= */}
      <section className="py-16 border-t border-gray-200/80 bg-[#FAF9FD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 text-left">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                대학생 인기 10가지 운동 빠르게 둘러보기
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                종목 카드를 클릭하면 상세한 교내 팁과 예상 비용, 스타터 장비를 확인할 수 있습니다.
              </p>
            </div>
            <button
              onClick={onStartQuiz}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>내 1순위 추천 종목은?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sports.slice(0, 10).map((sport) => (
              <button
                key={sport.id}
                onClick={() => onSelectSport(sport)}
                className="bg-white hover:bg-indigo-50/40 border border-gray-200 hover:border-indigo-300 rounded-2xl p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {sport.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {sport.location.split('/')[0]}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                  {sport.name.split(' ')[0]}
                </h4>
                <p className="text-[11px] text-gray-500 truncate mt-1">
                  {sport.tagList[0] ? `#${sport.tagList[0]}` : `#${sport.category}`}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
