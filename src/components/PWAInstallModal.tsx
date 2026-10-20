import React from 'react';
import {
  Download,
  X,
  Smartphone,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Monitor,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Icon */}
        <div className="relative bg-gradient-to-br from-[#6C5CE7] via-[#5E4EE0] to-[#1E3A8A] text-white p-6 sm:p-7 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App Icon Preview */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center p-1 overflow-hidden ring-4 ring-white/30">
              <img src="/icon.svg" alt="운명 앱 아이콘" className="w-full h-full object-contain rounded-xl" />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-xs">
              PWA
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            &apos;운명&apos; 앱 홈 화면에 설치하기
          </h3>
          <p className="text-xs text-white/80 mt-1">
            계명대학교 학생 맞춤 운동 추천 &amp; 캠퍼스 메이트 커뮤니티
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <Zap className="w-5 h-5 mx-auto text-[#6C5CE7] mb-1" />
              <div className="text-[11px] font-bold text-gray-800">초고속 실행</div>
              <div className="text-[10px] text-gray-600">앱스토어 없이 즉시</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <Smartphone className="w-5 h-5 mx-auto text-[#1E40AF] mb-1" />
              <div className="text-[11px] font-bold text-gray-800">풀스크린 앱</div>
              <div className="text-[10px] text-gray-600">주소창 없는 깔끔함</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-gray-100">
              <Sparkles className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <div className="text-[11px] font-bold text-gray-800">오프라인 지원</div>
              <div className="text-[10px] text-gray-600">캐시 데이터 보관</div>
            </div>
          </div>

          {/* Conditional Guidance based on OS / Browser */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-800">이미 앱으로 설치되어 있습니다!</div>
              <div className="text-xs text-emerald-600">스마트폰 홈 화면 또는 앱 서랍에서 언제든 실행하세요.</div>
            </div>
          ) : isInstallable ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-600 text-center">
                아래 버튼을 누르면 스마트폰 또는 PC에 즉시 앱이 설치됩니다.
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6C5CE7]/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>지금 앱 설치하기</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Guide */
            <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1E40AF] text-white text-[11px] flex items-center justify-center font-black">
                  iOS
                </span>
                <span>iPhone / iPad 홈 화면 추가 방법</span>
              </div>
              <ol className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#6C5CE7] shrink-0">1.</span>
                  <span>
                    Safari 하단 바 중앙의 <strong>공유 아이콘</strong>(
                    <Share className="inline w-3.5 h-3.5 mx-0.5 text-blue-600" />
                    )을 터치합니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#6C5CE7] shrink-0">2.</span>
                  <span>
                    메뉴를 아래로 스크롤하여 <strong>&apos;홈 화면에 추가&apos;</strong>(
                    <PlusSquare className="inline w-3.5 h-3.5 mx-0.5 text-gray-700" />
                    )를 선택합니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#6C5CE7] shrink-0">3.</span>
                  <span>
                    우측 상단 <strong>&apos;추가&apos;</strong> 버튼을 누르면 스마트폰에 &apos;운명&apos; 앱 아이콘이 생성됩니다!
                  </span>
                </li>
              </ol>
            </div>
          ) : (
            /* General / Desktop Guide */
            <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-[#6C5CE7]" />
                <span>브라우저 앱 설치 방법</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                크롬, 웨일, 엣지 브라우저 상단 주소창 우측의 <strong>&apos;설치&apos; 아이콘</strong>
                (모니터에 아래 화살표 모양) 또는 브라우저 메뉴의 <strong>&apos;운명 앱 설치&apos;</strong>를 클릭하시면 데스크톱 및 스마트폰에 즉시 설치됩니다.
              </p>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
