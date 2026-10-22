import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Leaf,
  Navigation,
  Clock,
  Tag,
  Gift,
  QrCode,
} from 'lucide-react';
import { EcoRewardItem, EcoRewardCategory, RedeemedVoucher, UserEcoProfile } from '../types';
import { ECO_REWARD_ITEMS } from '../data/ecoRewards';
import { redeemEcoReward, saveEcoProfile } from '../lib/ecoStorage';

interface EcoRewardShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  ecoProfile: UserEcoProfile;
  onProfileUpdated: (profile: UserEcoProfile) => void;
  onOpenGpsTracker: () => void;
  onOpenMissions: () => void;
}

export const EcoRewardShopModal: React.FC<EcoRewardShopModalProps> = ({
  isOpen,
  onClose,
  ecoProfile,
  onProfileUpdated,
  onOpenGpsTracker,
  onOpenMissions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EcoRewardCategory | 'vouchers'>('all');
  const [selectedRewardToBuy, setSelectedRewardToBuy] = useState<EcoRewardItem | null>(null);
  const [redeemedVoucherSuccess, setRedeemedVoucherSuccess] = useState<RedeemedVoucher | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter items
  const filteredRewards = ECO_REWARD_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'vouchers') return false;
    return item.category === selectedCategory;
  });

  const handleBuyClick = (item: EcoRewardItem) => {
    setBuyError(null);
    setSelectedRewardToBuy(item);
  };

  const handleConfirmPurchase = () => {
    if (!selectedRewardToBuy) return;

    const result = redeemEcoReward(selectedRewardToBuy);
    if (!result.success || !result.voucher) {
      setBuyError(result.error || '포인트 교환에 실패했습니다.');
      return;
    }

    onProfileUpdated(result.newProfile);
    setRedeemedVoucherSuccess(result.voucher);
    setSelectedRewardToBuy(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleToggleVoucherUsed = (voucherId: string) => {
    const updatedVouchers = ecoProfile.redeemedVouchers.map((v) =>
      v.id === voucherId ? { ...v, isUsed: !v.isUsed } : v
    );
    const updatedProfile = {
      ...ecoProfile,
      redeemedVouchers: updatedVouchers,
    };
    saveEcoProfile(updatedProfile);
    onProfileUpdated(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF9FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900">
                  탄소 절감 에코 마일리지 샵
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  제휴업체 장비 & 기프티콘
                </span>
              </div>
              <p className="text-xs text-gray-500">
                메이트와 함께 달리고 줄인 탄소로 스포츠 장비와 기프티콘을 교환하세요.
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

        {/* Current Balance & Quick Action Bar */}
        <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8075E8] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">
              💰
            </div>
            <div>
              <span className="text-[11px] text-white/80 font-medium">나의 보유 에코 마일리지</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono">
                  {ecoProfile.points.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-300">P</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenGpsTracker();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GPS 운동으로 적립</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenMissions();
              }}
              className="px-3.5 py-2 rounded-xl bg-white text-[#6C5CE7] text-xs font-bold shadow-xs hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>미션 보상 받기</span>
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="px-6 pt-4 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            전체 상품 ({ECO_REWARD_ITEMS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('gifticon')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'gifticon'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>☕ 커피·기프티콘</span>
          </button>
          <button
            onClick={() => setSelectedCategory('gear')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'gear'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>👟 제휴 스포츠 장비</span>
          </button>
          <button
            onClick={() => setSelectedCategory('supplements')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'supplements'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>🥤 단백질·보충제</span>
          </button>
          <button
            onClick={() => setSelectedCategory('vouchers')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'vouchers'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>🎟️ 내 교환 바우처</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
              {ecoProfile.redeemedVouchers.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {selectedCategory === 'vouchers' ? (
            /* My Vouchers View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    내가 교환한 모바일 쿠폰 & 제휴 장비
                  </h3>
                  <p className="text-xs text-gray-500">
                    결제 시 바코드 또는 PIN 번호를 매장에 제시하거나 제휴몰에 입력하세요.
                  </p>
                </div>
              </div>

              {ecoProfile.redeemedVouchers.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-200/80 p-8 space-y-3">
                  <div className="text-4xl">🎫</div>
                  <h4 className="text-sm font-bold text-gray-800">아직 교환한 바우처가 없습니다</h4>
                  <p className="text-xs text-gray-500">
                    GPS 운동으로 적립한 에코 포인트로 기프티콘이나 스포츠 장비를 교환해보세요!
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    마일리지 상품 둘러보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ecoProfile.redeemedVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className={`p-4 rounded-3xl border transition-all ${
                        voucher.isUsed
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : 'bg-white border-[#E4DFFC] shadow-sm'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={voucher.imageUrl}
                          alt={voucher.itemName}
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded-md">
                              {voucher.brand}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                voucher.isUsed
                                  ? 'bg-gray-200 text-gray-600'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {voucher.isUsed ? '사용 완료' : '사용 가능'}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 truncate mt-1">
                            {voucher.itemName}
                          </h4>
                          <span className="text-[10px] text-gray-400">
                            {voucher.pointsSpent.toLocaleString()} P 사용
                          </span>
                        </div>
                      </div>

                      {/* Barcode & Pin */}
                      <div className="mt-3 p-3 rounded-2xl bg-gray-50 border border-gray-200/80 text-center space-y-1">
                        <div className="font-mono text-sm tracking-widest font-black text-gray-800">
                          {voucher.barcode}
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <span className="text-[11px] font-mono text-gray-600">
                            PIN: {voucher.pinCode}
                          </span>
                          <button
                            onClick={() => handleCopyCode(voucher.pinCode)}
                            className="text-[10px] text-[#6C5CE7] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            <span>{copiedCode === voucher.pinCode ? '복사됨!' : '복사'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-400">
                        <span>유효기간: ~{new Date(voucher.expiresAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleToggleVoucherUsed(voucher.id)}
                          className="text-gray-500 hover:text-gray-800 font-semibold cursor-pointer underline"
                        >
                          {voucher.isUsed ? '사용 가능으로 되돌리기' : '사용 완료로 표시'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Store Items Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => {
                const canAfford = ecoProfile.points >= reward.pointsCost;

                return (
                  <div
                    key={reward.id}
                    className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden hover:border-[#6C5CE7]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={reward.imageUrl}
                          alt={reward.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {reward.badge && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                            {reward.badge}
                          </span>
                        )}
                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                          {reward.brand}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-1.5">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {reward.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {reward.description}
                        </p>
                        {reward.partnerNote && (
                          <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                            💡 {reward.partnerNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Purchase CTA */}
                    <div className="p-4 pt-2 border-t border-gray-100 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] text-gray-400 line-through">
                          정가 {reward.originalWonPrice.toLocaleString()}원
                        </span>
                        <div className="flex items-baseline gap-1 text-[#6C5CE7]">
                          <span className="text-base font-black font-mono">
                            {reward.pointsCost.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold">P</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyClick(reward)}
                        className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white shadow-sm shadow-[#6C5CE7]/20'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{canAfford ? '포인트로 교환하기' : '포인트 부족'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Purchase Confirmation Modal */}
        {selectedRewardToBuy && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-200">
              <div className="text-center space-y-1">
                <span className="text-3xl">🎁</span>
                <h4 className="text-base font-black text-gray-900">포인트 교환 확인</h4>
                <p className="text-xs text-gray-500">
                  선택하신 상품을 에코 마일리지로 교환하시겠습니까?
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">교환 상품</span>
                  <span className="font-bold text-gray-900 truncate max-w-[180px]">
                    {selectedRewardToBuy.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">차감 포인트</span>
                  <span className="font-bold text-[#6C5CE7]">
                    -{selectedRewardToBuy.pointsCost.toLocaleString()} P
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">교환 후 잔여</span>
                  <span className="font-bold text-gray-800">
                    {(ecoProfile.points - selectedRewardToBuy.pointsCost).toLocaleString()} P
                  </span>
                </div>
              </div>

              {buyError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{buyError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedRewardToBuy(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  교환 완료하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Success Modal */}
        {redeemedVoucherSuccess && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                🎉
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-gray-900">교환이 완료되었습니다!</h4>
                <p className="text-xs text-gray-500">
                  모바일 바코드와 핀번호가 발급되었습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-center">
                <span className="text-[10px] font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded">
                  {redeemedVoucherSuccess.brand}
                </span>
                <p className="text-xs font-black text-gray-800">
                  {redeemedVoucherSuccess.itemName}
                </p>

                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1 my-2">
                  <div className="font-mono text-sm tracking-wider font-black text-gray-900">
                    {redeemedVoucherSuccess.barcode}
                  </div>
                  <div className="text-[11px] font-mono text-gray-500">
                    PIN: {redeemedVoucherSuccess.pinCode}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(redeemedVoucherSuccess.pinCode)}
                  className="w-full py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode === redeemedVoucherSuccess.pinCode ? '복사 완료!' : 'PIN 복사하기'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRedeemedVoucherSuccess(null);
                  setSelectedCategory('vouchers');
                }}
                className="w-full py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                내 교환 보관함에서 확인하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
