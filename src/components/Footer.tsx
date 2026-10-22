import React from 'react';
import { Heart, Sparkles, Terminal, ArrowUpRight, Smartphone, Download } from 'lucide-react';

interface FooterProps {
  onOpenSponsor: () => void;
  onOpenQuiz: () => void;
  onSelectTab: (tab: 'home' | 'browse' | 'compare' | 'places' | 'community' | 'products' | 'sponsor' | 'admin') => void;
  onOpenInstall?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSponsor, onOpenQuiz, onSelectTab, onOpenInstall }) => {
  return (
    <footer className="bg-[#FAF9FD] border-t border-gray-200/80 pt-12 pb-16 text-gray-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-gray-200/70">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-1">
                <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-base font-black text-gray-900 tracking-tight lowercase">
                unmyeong
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                (運動命)
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-sm text-xs">
              &quot;나와 딱 맞는 운동을 만나는 건, 어쩌면 운명&quot; <br />
              몸을 움직이는 <strong>운동(運動)</strong>과 삶의 전환점이 되는 <strong>운명(運命)</strong>의 만남. 비싼 회원권 없이도 평생 즐길 수 있는 맞춤형 캠퍼스 스포츠 플랫폼입니다.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
              <span>status: all systems operational</span>
              <span>•</span>
              <span className="text-emerald-600">online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono font-bold text-gray-900 text-xs uppercase tracking-wider">
              features
            </h4>
            <ul className="space-y-1.5 text-gray-600">
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>내 운동 운명 찾기 (3분 진단)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('browse')}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  10가지 추천 운동 목록
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('compare')}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  운동 1:1 레이더 차트 비교
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('places')}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer text-[#002C6C] font-semibold"
                >
                  계명대 성서캠 운동장소 & 러닝코스
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('community')}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  캠퍼스 메이트 커뮤니티
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('products')}
                  className="hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  가성비 스타터 장비 큐레이션
                </button>
              </li>
              {onOpenInstall && (
                <li>
                  <button
                    onClick={onOpenInstall}
                    className="hover:text-[#4F46E5] text-[#6C5CE7] font-bold transition-colors cursor-pointer flex items-center gap-1.5 pt-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>운명 앱 홈화면 설치하기</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#EAE6FE] text-[10px] text-[#6C5CE7]">앱</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Business & Sponsor */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-mono font-bold text-gray-900 text-xs uppercase tracking-wider">
              partnership
            </h4>
            <p className="text-gray-500 leading-relaxed text-xs">
              대학생 스포츠웨어, 체육 시설, 러닝/클라이밍 브랜드와의 협업 및 할인 제휴를 환영합니다.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenSponsor}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300/80 text-gray-800 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>브랜드 제휴 및 스폰서 문의</span>
                <ArrowUpRight className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400 font-mono">
          <p>
            © {new Date().getFullYear()} unmyeong. designed for healthy campus life.
          </p>
          <div className="flex items-center gap-2">
            <span>(^ ω ^)</span>
            <span>•</span>
            <span>made with love in seoul</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

