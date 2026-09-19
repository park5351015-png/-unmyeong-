import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Volume2, VolumeX, Folder, HardDrive, Trash2, Camera, Laptop, Activity, Compass, Users } from 'lucide-react';
import heroImg from '../assets/images/college_running_photo_1789816975948.jpg';

interface HeroSectionProps {
  onStartQuiz: () => void;
  onExploreSports: () => void;
  onGoToCommunity?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartQuiz, onExploreSports, onGoToCommunity }) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-14 md:pb-28 bg-[#FBFBFE] bg-dot-pattern select-none">
      {/* Scattered Desktop Artifacts & Windows (heyclicky reference style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
        {/* Top-Left Floating Window: Track Runners Preview */}
        <div className="hidden xl:flex absolute top-6 left-6 -rotate-3 flex-col items-center gap-1.5 opacity-90 transition-transform hover:scale-105 pointer-events-auto">
          <div className="w-36 rounded-xl bg-white border border-gray-200/90 shadow-lg shadow-black/5 overflow-hidden">
            <div className="h-5 bg-gray-100/90 border-b border-gray-200 px-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[8px] font-mono text-gray-500 truncate">running.mov</span>
              <div className="w-2" />
            </div>
            <div className="relative aspect-4/3 bg-gray-900 overflow-hidden">
              <img src={heroImg} alt="runners" className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-white">
                  <Play className="w-2.5 h-2.5 fill-white" />
                </span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-gray-500 tracking-tight">track-runners.mov</span>
        </div>

        {/* Top-Right Floating Window: Tennis / Climbing */}
        <div className="hidden xl:flex absolute top-8 right-8 rotate-3 flex-col items-center gap-1.5 opacity-90 transition-transform hover:scale-105 pointer-events-auto">
          <div className="w-40 rounded-xl bg-white border border-gray-200/90 shadow-lg shadow-black/5 overflow-hidden">
            <div className="h-5 bg-gray-100/90 border-b border-gray-200 px-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-[8px] font-mono text-gray-500 truncate">climb-beta.mov</span>
              <div className="w-2" />
            </div>
            <div className="p-2.5 bg-[#FAF9FD] text-left space-y-1.5">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-semibold border border-amber-200">
                <span>🧗 볼더링 크루</span>
              </div>
              <p className="text-[10px] font-medium text-gray-700 leading-tight">
                “초보도 첫 홀드 잡는 순간 빠져드는 마성의 운동!”
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-gray-500 tracking-tight">climbing-mate.app</span>
        </div>

        {/* Left Side Floating macOS Folders & Kaomoji */}
        <div className="hidden lg:flex absolute top-48 left-12 flex-col items-center gap-1 cursor-pointer pointer-events-auto group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] shadow-sm flex items-center justify-center text-white border-t border-blue-300 group-hover:scale-105 transition-transform">
            <Folder className="w-6 h-6 fill-blue-100 text-blue-200" />
          </div>
          <span className="text-[11px] font-mono text-gray-600 bg-white/80 px-1 rounded shadow-2xs">캠퍼스_시설</span>
        </div>

        <div className="hidden lg:flex absolute top-72 left-20 text-xs font-mono text-gray-400">
          (^ ω ^)
        </div>

        {/* Retro Trash Can Icon on the left (heyclicky signature) */}
        <div className="hidden lg:flex absolute bottom-24 left-16 flex-col items-center gap-1 cursor-pointer pointer-events-auto">
          <div className="w-9 h-10 rounded-sm bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-400/50 shadow-xs flex flex-col items-center justify-center text-gray-500">
            <Trash2 className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-[10px] font-mono text-gray-500">작심삼일_휴지통</span>
        </div>

        {/* Right Side Floating Folders & Kaomoji */}
        <div className="hidden lg:flex absolute top-44 right-16 flex-col items-center gap-1 cursor-pointer pointer-events-auto group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#60A5FA] to-[#3B82F6] shadow-sm flex items-center justify-center text-white border-t border-blue-300 group-hover:scale-105 transition-transform">
            <Folder className="w-6 h-6 fill-blue-100 text-blue-200" />
          </div>
          <span className="text-[11px] font-mono text-gray-600 bg-white/80 px-1 rounded shadow-2xs">운동_장비꿀팁</span>
        </div>

        <div className="hidden lg:flex absolute top-64 right-24 text-xs font-mono text-gray-400">
          {'{ ^ . ^ }'}
        </div>

        <div className="hidden lg:flex absolute bottom-32 right-14 text-xs font-mono text-gray-400">
          \_(ツ)_/¯
        </div>

        {/* Retro floppy & sticker on bottom right */}
        <div className="hidden lg:flex absolute bottom-12 right-20 flex-col items-center gap-1 cursor-pointer pointer-events-auto group">
          <div className="w-9 h-9 rounded bg-[#EDE9FE] border border-[#C4B5FD] flex items-center justify-center text-[#6C5CE7] shadow-xs group-hover:rotate-6 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">100% 무료</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Top Kaomoji & Status Pill */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-xs font-mono text-gray-400 tracking-wider">^ ω ^</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/80 shadow-2xs text-gray-600 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>대학생 전용 맞춤 운동 추천 플랫폼</span>
          </div>
          <span className="text-xs font-mono text-gray-400 tracking-wider">( -_- )</span>
        </div>

        {/* Giant Modern Sans Title (heyclicky typography archetype) */}
        <div className="space-y-3 mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tighter lowercase">
            unmyeong
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium tracking-tight">
            find your sport, find your destiny
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            내 시간표, 지갑 사정, MBTI 성향까지! 나에게 딱 맞는 진짜 인생 운동을 찾아보세요.
          </p>
        </div>

        {/* CTA Buttons (Pills styled like "download for mac" in reference) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-4">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-b from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group border-t border-indigo-400/50"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>내 운동 운명 찾기 (3분)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onExploreSports}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm border border-gray-300/80 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-gray-500" />
            <span>10가지 추천 운동 둘러보기</span>
          </button>

          {onGoToCommunity && (
            <button
              onClick={onGoToCommunity}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm border border-gray-300/80 shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>메이트 찾기</span>
            </button>
          )}
        </div>

        <p className="text-[11px] font-mono text-gray-400 mb-10">
          100% free, sonoma 14.2 or higher / college student tuned
        </p>

        {/* Central Showcase macOS Window (like hello.mov in reference) */}
        <div className="relative max-w-3xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-gray-300/90 shadow-2xl shadow-gray-400/20 overflow-hidden text-left">
            {/* macOS Window Title Bar */}
            <div className="h-9 bg-gray-100/90 border-b border-gray-200 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
              </div>
              <span className="text-xs font-mono text-gray-600 font-medium">
                campus_lifestyle.mov
              </span>
              <div className="w-12 text-right">
                <span className="text-[10px] font-mono text-gray-400">1080p</span>
              </div>
            </div>

            {/* Video / Photo Container */}
            <div className="relative aspect-16/9 bg-gray-950 overflow-hidden group">
              <img
                src={heroImg}
                alt="캠퍼스 트랙을 달리는 대학생 러너들의 실제 사진"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Dark subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Central Floating "play video" Pill Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={onStartQuiz}
                  className="px-5 py-2.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>play preview / 내 성향 찾기</span>
                </button>
              </div>

              {/* Corner Audio Toggle & Duration Badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                  0:42 / 1:30
                </span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-xs border border-white/10 transition-colors cursor-pointer"
                  title="음소거 전환"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Bottom Left Title inside frame */}
              <div className="absolute bottom-3 left-4 text-white text-left">
                <p className="text-[11px] font-mono text-indigo-300">#캠퍼스_러닝 #인생운동</p>
                <p className="text-xs sm:text-sm font-bold drop-shadow-xs">
                  “혼자 하면 작심삼일, 내게 맞는 운동이면 평생 습관”
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] font-mono text-gray-400 mt-2">
            hello.mov
          </p>

          {/* Name Meaning Card Styled as Minimalist Notes App */}
          <div className="mt-8 max-w-xl mx-auto bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                <span className="text-xs font-mono font-bold text-gray-800">unmyeong_definition.txt</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Notes.app</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1.5 flex-wrap">
              <span className="text-[#4F46E5] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                運動 (운동)
              </span>
              <span className="text-gray-400 font-black">+</span>
              <span className="text-[#4F46E5] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                運命 (운명)
              </span>
              <span className="text-gray-400 font-black">=</span>
              <span className="bg-indigo-50 text-[#4338CA] px-2.5 py-0.5 rounded border border-indigo-200 font-black">
                運動命 (운명)
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              몸을 활기차게 움직이는 <strong>운동(運動)</strong>과 삶을 바꾸는 소중한 인연인 <strong>운명(運命)</strong>의 만남.
              비싼 회원권 없이도 평생 즐겁게 지속할 수 있는 나만의 인생 스포츠를 찾아드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

