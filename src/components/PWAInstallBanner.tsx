import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenInstallModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onOpenInstallModal,
}) => {
  const { isInstalled, isInstallable, isIOS } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    if (!dismissed && !isInstalled) {
      setIsDismissed(false);
    }
  }, [isInstalled]);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <aside aria-label="앱 설치 안내" className="fixed bottom-14 lg:bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#6C5CE7]/25 p-3.5 flex items-center justify-between gap-3 ring-1 ring-black/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#1E3A8A] p-0.5 shadow-sm shrink-0 flex items-center justify-center">
            <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain rounded-[10px]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-gray-900 truncate">운명 (運動命) 앱</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700">
                계대 맞춤
              </span>
            </div>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">
              {isIOS ? '홈 화면에 추가하고 앱처럼 사용하세요!' : '클릭 한 번으로 홈 화면에 앱 설치하기'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenInstallModal}
            className="px-3 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>앱 설치</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="안내 닫기"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
