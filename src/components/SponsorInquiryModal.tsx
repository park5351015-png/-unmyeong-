import React, { useState } from 'react';
import { X, Mail, Sparkles, CheckCircle2, Building, User, Phone, Send } from 'lucide-react';
import { submitInquiry } from '../lib/firebase';
import { SponsorInquiry } from '../types';

interface SponsorInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquirySubmitted?: (inquiry: SponsorInquiry) => void;
}

export const SponsorInquiryModal: React.FC<SponsorInquiryModalProps> = ({
  isOpen,
  onClose,
  onInquirySubmitted,
}) => {
  const [brandName, setBrandName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [partnershipType, setPartnershipType] = useState('용품 제휴 및 대학생 할인');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !managerName.trim() || !email.trim() || !message.trim()) {
      alert('필수 입력 항목을 모두 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitInquiry({
        brandName: brandName.trim(),
        managerName: managerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        partnershipType,
        message: message.trim(),
      });
      if (onInquirySubmitted) {
        onInquirySubmitted(created);
      }
      setIsSuccess(true);
    } catch (err) {
      alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBrandName('');
    setManagerName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FAF8FF] to-white">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#F4F2FF] text-[#6C5CE7]">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              브랜드 제휴 및 협찬 문의
            </span>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success State */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                제휴 문의가 성공적으로 접수되었습니다!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                {brandName} 담당자님, 소중한 제안 감사드립니다. <br />
                운명(運動命) 운영팀이 기재해주신 연락처({email})로 1~2영업일 이내에 검토 회신을 드리겠습니다.
              </p>
              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="bg-[#FAF9FF] p-3.5 rounded-2xl border border-[#ECE7FA] text-gray-600 leading-relaxed text-xs">
                💡 운명(運動命)은 대학생 타깃의 맞춤 스포츠 추천 플랫폼입니다. 피트니스 시설, 운동용품, 스포츠웨어, 학생 프로모션 등 다양한 제안을 적극 검토합니다.
              </div>

              {/* Brand Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  브랜드 / 회사명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 런스타즈 스포츠, 클라이밍파크 강남점"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-gray-900"
                />
              </div>

              {/* Manager & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    담당자명 / 직책 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동 팀장"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    연락처 (전화번호)
                  </label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@yourbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-gray-900"
                />
              </div>

              {/* Partnership Type */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  제휴 구분 <span className="text-red-500">*</span>
                </label>
                <select
                  value={partnershipType}
                  onChange={(e) => setPartnershipType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] text-gray-900 bg-white"
                >
                  <option value="용품 제휴 및 대학생 할인">용품 제휴 및 대학생 할인 쿠폰</option>
                  <option value="체육 시설 제휴 (헬스장, 클라이밍 등)">체육 시설 제휴 (헬스장, 클라이밍, 수영 등)</option>
                  <option value="홈페이지 배너 및 스폰서십">홈페이지 배너 및 스폰서십</option>
                  <option value="기타 제휴">기타 제휴</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  제휴 제안 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="제휴 제안의 구체적인 내용, 타깃 대학생 혜택 등을 자유롭게 작성해주세요."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8B7FE8] focus:ring-2 focus:ring-[#8B7FE8]/20 text-gray-900 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold transition-all shadow-md shadow-[#6C5CE7]/25 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '접수 처리 중...' : '제휴 제안 제출하기'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
