import React from 'react';
import { Sparkles, Compass, GitCompare, ShoppingBag, Mail, ShieldCheck, LogIn, LogOut, User, Users, Wifi, BatteryMedium, Headphones } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  currentTab: 'home' | 'browse' | 'compare' | 'community' | 'products' | 'sponsor' | 'admin';
  setCurrentTab: (tab: 'home' | 'browse' | 'compare' | 'community' | 'products' | 'sponsor' | 'admin') => void;
  onOpenQuiz: () => void;
  currentUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuiz,
  currentUser,
  onLogin,
  onLogout,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFE]/90 backdrop-blur-md border-b border-gray-200/70 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand + Minimal Nav Links */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            {/* macOS traffic light icon styling or modern icon */}
            <div className="flex items-center gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
            </div>

            <span className="text-base font-black tracking-tight text-gray-900 group-hover:text-[#4F46E5] transition-colors">
              unmyeong
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 font-medium">
              v2.4
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-gray-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'home' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              홈 (features)
            </button>
            <button
              onClick={onOpenQuiz}
              className="text-[#4F46E5] hover:text-[#4338CA] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>성향테스트</span>
            </button>
            <button
              onClick={() => setCurrentTab('browse')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'browse' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              추천 운동 종목
            </button>
            <button
              onClick={() => setCurrentTab('compare')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'compare' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              운동비교
            </button>
            <button
              onClick={() => setCurrentTab('community')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'community' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              메이트 커뮤니티
            </button>
            <button
              onClick={() => setCurrentTab('products')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'products' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              스타터 장비
            </button>
            <button
              onClick={() => setCurrentTab('sponsor')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'sponsor' ? 'text-black font-bold' : 'hover:text-black'
              }`}
            >
              제휴문의
            </button>
          </nav>
        </div>

        {/* Center: Cute minimal arch icon from reference */}
        <div className="hidden md:flex items-center justify-center text-gray-400">
          <svg className="w-4 h-2.5 stroke-current" viewBox="0 0 24 12" fill="none" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 10C7 3 17 3 22 10" />
          </svg>
        </div>

        {/* Right: Mac status icons & CTAs */}
        <div className="flex items-center gap-3 text-xs">
          {/* Mac System indicators */}
          <div className="hidden sm:flex items-center gap-2.5 text-gray-500 font-mono text-[11px] pr-2 border-r border-gray-200">
            <Wifi className="w-3.5 h-3.5 text-gray-600" />
            <Headphones className="w-3.5 h-3.5 text-gray-600" />
            <div className="flex items-center gap-1 text-gray-600">
              <BatteryMedium className="w-3.5 h-3.5" />
              <span>98%</span>
            </div>
            <span className="text-gray-400">12:15 PM</span>
          </div>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            title="관리자 모드"
            className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors flex items-center gap-1 ${
              currentTab === 'admin' || isAdminLoggedIn
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            <span className="hidden sm:inline">admin</span>
          </button>

          {/* User Auth */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-700">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="profile" className="w-3.5 h-3.5 rounded-full" />
                ) : (
                  <User className="w-3 h-3 text-gray-500" />
                )}
                <span className="max-w-[70px] truncate text-[11px]">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={onLogout}
                title="로그아웃"
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <LogIn className="w-3 h-3 text-indigo-500" />
              <span className="hidden sm:inline">로그인</span>
            </button>
          )}

          {/* Signature Pill CTA button like "get heyclicky" */}
          <button
            onClick={onOpenQuiz}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-medium text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>내 운명 찾기</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-gray-200/80 px-2 py-2 bg-[#FAF9FD] text-[11px]">
        <button
          onClick={() => setCurrentTab('home')}
          className={`py-1 px-2 font-medium ${currentTab === 'home' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          홈
        </button>
        <button
          onClick={() => setCurrentTab('browse')}
          className={`py-1 px-2 font-medium ${currentTab === 'browse' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          운동종목
        </button>
        <button
          onClick={() => setCurrentTab('compare')}
          className={`py-1 px-2 font-medium ${currentTab === 'compare' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          비교
        </button>
        <button
          onClick={() => setCurrentTab('community')}
          className={`py-1 px-2 font-medium ${currentTab === 'community' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          메이트
        </button>
        <button
          onClick={() => setCurrentTab('products')}
          className={`py-1 px-2 font-medium ${currentTab === 'products' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          장비
        </button>
        <button
          onClick={() => setCurrentTab('sponsor')}
          className={`py-1 px-2 font-medium ${currentTab === 'sponsor' ? 'text-[#4F46E5] font-bold' : 'text-gray-500'}`}
        >
          제휴
        </button>
      </div>
    </header>
  );
};

