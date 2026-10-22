import React, { useState } from 'react';
import {
  X,
  Trophy,
  Sparkles,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Flame,
  Leaf,
  Users,
} from 'lucide-react';
import { EcoMission, UserEcoProfile } from '../types';
import { claimMissionReward, getEcoMissions } from '../lib/ecoStorage';

interface EcoMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ecoProfile: UserEcoProfile;
  onProfileUpdated: (profile: UserEcoProfile) => void;
  onOpenGpsTracker: () => void;
}

export const EcoMissionsModal: React.FC<EcoMissionsModalProps> = ({
  isOpen,
  onClose,
  ecoProfile,
  onProfileUpdated,
  onOpenGpsTracker,
}) => {
  const [missions, setMissions] = useState<EcoMission[]>(() => getEcoMissions());
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = (mission: EcoMission) => {
    const result = claimMissionReward(mission.id);
    if (result.success) {
      setMissions(getEcoMissions());
      onProfileUpdated(result.newProfile);
      setClaimedNotice(`🎉 '${mission.title}' 완료 보상 +${result.pointsAdded}P 가 적립되었습니다!`);
      setTimeout(() => setClaimedNotice(null), 3500);
    }
  };

  const completedCount = missions.filter((m) => m.isCompleted).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF9FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900">
                  계명대 탄소 절감 캠퍼스 챌린지
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {completedCount}/{missions.length} 완료
                </span>
              </div>
              <p className="text-xs text-gray-500">
                캠퍼스 에코 미션을 완주하고 제휴 장비와 기프티콘을 구매할 수 있는 보너스 포인트를 획득하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claimed Notification Toast */}
        {claimedNotice && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between animate-fade-in">
            <span>{claimedNotice}</span>
            <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
          </div>
        )}

        {/* Missions List */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {missions.map((mission) => {
            const progressPercent = Math.min(
              100,
              Math.round((mission.currentValue / mission.targetValue) * 100)
            );

            return (
              <div
                key={mission.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  mission.isClaimed
                    ? 'bg-gray-50/70 border-gray-200 opacity-70'
                    : mission.isCompleted
                    ? 'bg-gradient-to-r from-[#FAF8FF] to-[#F1EEFE] border-[#C8BFFB] shadow-xs'
                    : 'bg-white border-gray-200/90'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-white border border-gray-100 shadow-2xs">
                      {mission.icon}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-gray-900">
                        {mission.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#6C5CE7] bg-white px-2.5 py-1 rounded-xl border border-[#E0DAFC] inline-block shadow-2xs">
                      +{mission.rewardPoints} P
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 font-medium">진행 현황</span>
                    <span className="font-bold text-gray-800">
                      {mission.currentValue} / {mission.targetValue} {mission.unit} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        mission.isCompleted ? 'bg-emerald-500' : 'bg-[#6C5CE7]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-3.5 pt-2 flex items-center justify-end">
                  {mission.isClaimed ? (
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>보상 수령 완료</span>
                    </span>
                  ) : mission.isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(mission)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{mission.rewardPoints}P 보상 받기</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenGpsTracker();
                      }}
                      className="text-xs text-[#6C5CE7] hover:text-[#5244C4] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>GPS로 달성하러 가기</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#FAF9FF] flex items-center justify-between text-xs">
          <div className="text-gray-500 text-[11px]">
            보유 마일리지: <strong className="text-gray-900">{ecoProfile.points.toLocaleString()} P</strong>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenGpsTracker();
            }}
            className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#5E4EE0] transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS 운동 측정 열기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
