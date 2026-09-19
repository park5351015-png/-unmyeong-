import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Sparkles, Check, HelpCircle } from 'lucide-react';
import { QuizQuestion, Sport, UserTestResult, PersonaProfile } from '../types';
import confetti from 'canvas-confetti';
import { recordQuizCompletion } from '../lib/firebase';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  sports: Sport[];
  onComplete: (result: UserTestResult) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  questions,
  sports,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentStep] || questions[0];
  const progressPercent = Math.round(((currentStep + 1) / questions.length) * 100);
  const selectedOptionId = answers[currentQ.id];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);

    // Calculate score for each sport
    const scores: Record<string, number> = {};
    sports.forEach((s) => {
      scores[s.id] = 10; // base score
    });

    questions.forEach((q) => {
      const selectedId = answers[q.id];
      if (selectedId) {
        const option = q.options.find((o) => o.id === selectedId);
        if (option && option.weights) {
          Object.entries(option.weights).forEach(([sportId, weight]) => {
            if (scores[sportId] !== undefined) {
              scores[sportId] += weight * 4;
            }
          });
        }
      }
    });

    // Sort sports by score descending
    const sortedSports = [...sports].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
    const topThree = sortedSports.slice(0, 3);
    const topSport = topThree[0];

    // Determine custom Persona
    let persona: PersonaProfile = {
      title: '자유로운 캠퍼스 탐험가',
      subtitle: '내 스타일대로 즐기는 똑똑한 대학생',
      description: '부담 없이 일상 속에서 나만의 리듬을 찾아가는 유연한 운동러!',
      tag: '자유로운 탐험형',
      badgeBg: 'bg-[#EDE9FE] text-[#6C5CE7]',
    };

    if (topSport.id === 'running') {
      persona = {
        title: '바람을 가르는 캠퍼스 러너',
        subtitle: '운동화 끈 하나로 오늘 하루를 리셋하는 러너',
        description: '장소와 시간의 구애 없이, 맑은 바람과 음악만 있다면 어디든 나의 트랙!',
        tag: '자유로운 러닝형',
        badgeBg: 'bg-[#EDE9FE] text-[#6C5CE7]',
      };
    } else if (topSport.id === 'health') {
      persona = {
        title: '체계적인 루틴의 쇠질 마스터',
        subtitle: '어제보다 단단한 내일을 만드는 성실파',
        description: '공강 시간 1시간도 헛되이 보내지 않고 탄탄한 신체 변화를 일구는 프로 루틴러!',
        tag: '루틴 집중형',
        badgeBg: 'bg-[#FEF3C7] text-[#D97706]',
      };
    } else if (topSport.id === 'climbing') {
      persona = {
        title: '문제를 풀어나가는 암벽의 지략가',
        subtitle: '도파민과 완등의 카타르시스를 즐기는 문제해결사',
        description: '단순한 반복은 거부한다! 신체 밸런스와 두뇌를 동시에 깨우는 인싸 볼더러.',
        tag: '도파민 액티비티형',
        badgeBg: 'bg-[#FFEDD5] text-[#EA580C]',
      };
    } else if (topSport.id === 'pilates' || topSport.id === 'yoga') {
      persona = {
        title: '몸과 마음을 다스리는 힐링 요기',
        subtitle: '자세 교정과 이너 피스를 찾는 지혜로운 휴식러',
        description: '과제와 시험으로 굽은 자세를 바르게 세우고 호흡으로 스트레스를 비워내는 힐러.',
        tag: '체형교정 힐링형',
        badgeBg: 'bg-[#FCE7F3] text-[#DB2777]',
      };
    } else if (topSport.id === 'tennis' || topSport.id === 'badminton') {
      persona = {
        title: '코트를 지배하는 랠리의 승부사',
        subtitle: '친구와 함께 박진감 넘치는 땀방울을 나누는 에너지맨',
        description: '빠른 스텝과 라켓의 타구음에서 살아있음을 느끼는 소셜 스포츠러!',
        tag: '랠리 소셜형',
        badgeBg: 'bg-[#DCFCE7] text-[#16A34A]',
      };
    } else if (topSport.id === 'spinning' || topSport.id === 'boxing') {
      persona = {
        title: '스트레스 0% 비트 위의 파이터',
        subtitle: '심장 터질 듯한 고강도 비트로 칼로리를 순삭시키는 열정러',
        description: '학업 스트레스는 펀치와 페달링으로 날려버린다! 폭발적인 에너지의 소유자.',
        tag: '열정 고강도형',
        badgeBg: 'bg-[#FEE2E2] text-[#DC2626]',
      };
    } else if (topSport.id === 'swimming') {
      persona = {
        title: '물살을 가르는 청량한 돌핀',
        subtitle: '관절 부담 없이 시원하게 온몸을 정화하는 힐링러',
        description: '지친 하루 끝에 물속의 평온함 속에서 완벽한 자유를 만끽하는 수영인!',
        tag: '청량 전신형',
        badgeBg: 'bg-[#E0F2FE] text-[#0284C7]',
      };
    }

    // Match percentage calculations
    const maxScore = scores[topSport.id] || 40;
    const matchReasonMap: Record<string, string> = {
      health: '공강 시간 활용, 가성비, 신체 체형 변화를 가장 명확하게 실감할 수 있는 최적의 운명입니다.',
      running: '비용 0원, 시간 제약 없이 기숙사 앞 트랙에서 혼자만의 힐링과 유산소를 즐기기에 완벽합니다.',
      climbing: '지루한 운동을 싫어하고 문제 해결과 성취감, 친구들과의 활기찬 에너지를 즐기는 당신에게 찰떡!',
      pilates: '오랜 열람실 공부로 흐트러진 척추 라인을 잡고 코어 속근육을 단련하는 1등 솔루션입니다.',
      yoga: '마음의 평정과 유연성, 자취방 홈트로 가성비와 멘탈 케어를 모두 잡을 수 있는 운명 운동입니다.',
      tennis: '역동적인 랠리 쾌감과 코트 위 순발력, 교내 동아리 친구들과 평생 취미를 만들기에 최고입니다.',
      badminton: '친구와 둘이서 언제든 가볍고 신나게 땀 흘릴 수 있는 대학생 가성비 끝판왕 라켓 스포츠!',
      swimming: '관절 무리 없이 전신 폐활량과 근육을 기르며 물속의 청량감으로 학업 스트레스를 씻어냅니다.',
      boxing: '학점/과제 스트레스를 샌드백에 시원하게 날려버리고 폭발적인 체지방 감량을 보장합니다.',
      spinning: '신나는 EDM 음악에 맞춰 지루할 틈 없이 50분 만에 최대 칼로리를 태우는 도파민 파티!',
    };

    const topSportResults = topThree.map((s, idx) => {
      // 1등: 95~98%, 2등: 88~92%, 3등: 80~85%
      const basePercentage = idx === 0 ? 96 : idx === 1 ? 89 : 82;
      const variation = (scores[s.id] % 4) - 1; // -1, 0, 1, 2
      const matchPercent = Math.min(99, Math.max(75, basePercentage + variation));

      return {
        sport: s,
        matchPercent,
        matchReason: matchReasonMap[s.id] || `${s.name}은(는) 당신의 운동 라이프스타일과 훌륭하게 부합합니다.`,
      };
    });

    // Record stats in background
    try {
      await recordQuizCompletion(topSport.id);
    } catch {
      // non-blocking
    }

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B7FE8', '#A78BFA', '#C4B5FD', '#F472B6', '#38BDF8'],
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    onComplete({
      persona,
      topSports: topSportResults,
      userAnswers: answers,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#FCFBFF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-ping" />
            <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
              운명(運動命) 성향 진단
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div
            className="bg-gradient-to-r from-[#8B7FE8] to-[#6C5CE7] h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F2FF] text-[#6C5CE7]">
              질문 {currentStep + 1} / {questions.length}
            </span>
            <span className="text-gray-400 font-medium">{currentQ.category}</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {currentQ.title}
            </h2>
            {currentQ.subtitle && (
              <p className="text-sm text-gray-500 mt-1.5 font-normal">
                {currentQ.subtitle}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-[#F5F3FF] border-[#8B7FE8] shadow-sm text-gray-900 ring-2 ring-[#8B7FE8]/20'
                      : 'bg-white border-gray-200 hover:border-[#C4B5FD] hover:bg-[#FAFAFD] text-gray-800'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-sm sm:text-base font-bold ${isSelected ? 'text-[#6C5CE7]' : 'text-gray-900'}`}>
                      {option.label}
                    </p>
                    {option.sublabel && (
                      <p className="text-xs text-gray-500 font-normal">
                        {option.sublabel}
                      </p>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                        : 'border-gray-300 group-hover:border-[#8B7FE8]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#FCFBFF] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOptionId || isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedOptionId && !isSubmitting
                ? 'bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white shadow-md shadow-[#6C5CE7]/20 hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span>운명 분석 중...</span>
            ) : currentStep === questions.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>나의 운동 운명 확인하기</span>
              </>
            ) : (
              <>
                <span>다음 질문</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
