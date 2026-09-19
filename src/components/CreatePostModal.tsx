import React, { useState } from 'react';
import { X, Sparkles, Users, Star, MessageSquare, MapPin, Calendar, Tag, AlertCircle } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { Sport, CommunityPostType, CommunityPost, MateInfo, ReviewInfo } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>) => Promise<void>;
  sports: Sport[];
  currentUser: FirebaseUser | null;
  defaultType?: CommunityPostType;
  defaultSportId?: string;
  onRequireLogin: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sports,
  currentUser,
  defaultType = 'general',
  defaultSportId = 'running',
  onRequireLogin,
}) => {
  const [type, setType] = useState<CommunityPostType>(defaultType);
  const [sportId, setSportId] = useState<string>(defaultSportId || (sports[0]?.id ?? 'running'));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.displayName || '');
  const [authorUniversity, setAuthorUniversity] = useState('대학생');
  const [tagsInput, setTagsInput] = useState('');

  // Mate specific
  const [mateLocation, setMateLocation] = useState('');
  const [mateSchedule, setMateSchedule] = useState('');
  const [maxMembers, setMaxMembers] = useState(3);
  const [targetLevel, setTargetLevel] = useState('초보자 누구나 환영');
  const [contactMethod, setContactMethod] = useState('댓글로 소통 후 오픈카톡 초대');

  // Review specific
  const [rating, setRating] = useState(5);
  const [duration, setDuration] = useState('3개월');
  const [beforeAfter, setBeforeAfter] = useState('');
  const [recommendedTo, setRecommendedTo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update form if defaults change
  React.useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      if (defaultSportId) setSportId(defaultSportId);
      if (currentUser?.displayName) setAuthorName(currentUser.displayName);
      setErrorMsg('');
    }
  }, [isOpen, defaultType, defaultSportId, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('내용을 작성해주세요.');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg('작성자 닉네임을 입력해주세요.');
      return;
    }

    const selectedSport = sports.find((s) => s.id === sportId) || { name: '일반운동', id: sportId };

    // Format tags
    const rawTags = tagsInput
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const finalTags = rawTags.length > 0 ? rawTags : [`#${selectedSport.name}`, '#대학생운동'];

    const basePostData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'> = {
      type,
      sportId,
      sportName: selectedSport.name,
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser?.uid || `guest_${Date.now()}`,
      authorName: authorName.trim(),
      authorUniversity: authorUniversity.trim() || '대학생',
      authorPhotoURL: currentUser?.photoURL || undefined,
      tags: finalTags,
    };

    if (type === 'mate') {
      basePostData.status = 'recruiting';
      basePostData.mateInfo = {
        location: mateLocation.trim() || '캠퍼스 및 인근 운동 장소',
        schedule: mateSchedule.trim() || '주 1~2회 협의',
        currentMembers: 1,
        maxMembers: Number(maxMembers) || 3,
        contactMethod: contactMethod.trim() || '댓글 소통',
        targetLevel: targetLevel.trim() || '초보 환영',
      };
    }

    if (type === 'review') {
      basePostData.reviewInfo = {
        rating,
        duration: duration.trim() || '1개월 이상',
        beforeAfter: beforeAfter.trim() || '체력 증진 및 활력 회복',
        recommendedTo: recommendedTo.trim() || '운동을 망설이는 대학생 학우분들',
      };
    }

    setSubmitting(true);
    try {
      await onSubmit(basePostData);
      // Reset
      setTitle('');
      setContent('');
      setTagsInput('');
      setBeforeAfter('');
      setMateLocation('');
      setMateSchedule('');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#EAE6FE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4F2FF] flex items-center justify-between bg-gradient-to-r from-[#FAF9FF] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F4F2FF] text-[#6C5CE7] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">운명 커뮤니티 글쓰기</h2>
              <p className="text-xs text-gray-500">대학생 학우들과 솔직한 운동 이야기를 나누어보세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">게시판 카테고리 선택</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('general')}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  type === 'general'
                    ? 'border-[#6C5CE7] bg-[#F4F2FF] text-[#6C5CE7] shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>종목별 자유수다</span>
              </button>
              <button
                type="button"
                onClick={() => setType('mate')}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  type === 'mate'
                    ? 'border-[#6C5CE7] bg-[#F4F2FF] text-[#6C5CE7] shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>운동 메이트 구하기</span>
              </button>
              <button
                type="button"
                onClick={() => setType('review')}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  type === 'review'
                    ? 'border-[#6C5CE7] bg-[#F4F2FF] text-[#6C5CE7] shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>운동 후기·성공사례</span>
              </button>
            </div>
          </div>

          {/* Sport Selector & Author Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">운동 종목</label>
              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#6C5CE7] bg-white cursor-pointer"
              >
                {sports.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">닉네임 / 학번</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="예: 러닝꿈나무22"
                maxLength={20}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">소속 대학 / 캠퍼스</label>
              <input
                type="text"
                value={authorUniversity}
                onChange={(e) => setAuthorUniversity(e.target.value)}
                placeholder="예: 연세대 신촌 / 건국대"
                maxLength={25}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>
          </div>

          {/* Mate Specific Fields */}
          {type === 'mate' && (
            <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#EDE9FE] space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
                <Users className="w-4 h-4" />
                <span>운동 메이트 모집 세부 정보</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    운동 장소 (캠퍼스/체육시설/공원)
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={mateLocation}
                      onChange={(e) => setMateLocation(e.target.value)}
                      placeholder="예: 연세대 대운동장 트랙 앞, 성수 클라이밍장"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    모집 일시 / 주기
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={mateSchedule}
                      onChange={(e) => setMateSchedule(e.target.value)}
                      placeholder="예: 매주 화/목 19:30, 이번 주 토요일 14시"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">총 모집 정원</label>
                  <select
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value={2}>2명 (1:1 파트너)</option>
                    <option value={3}>3명</option>
                    <option value={4}>4명</option>
                    <option value={6}>6명</option>
                    <option value={10}>10명 (그룹 러닝/동아리)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">대상 레벨 / 성향</label>
                  <input
                    type="text"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                    placeholder="예: 초보 환영, 페이스 6분대, 3분할 헬스"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">연락 방법</label>
                  <input
                    type="text"
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    placeholder="예: 댓글 남겨주시면 오픈채팅 링크 전달"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Review Specific Fields */}
          {type === 'review' && (
            <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#EDE9FE] space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
                <Star className="w-4 h-4" />
                <span>운동 후기 및 변화 공유</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">종합 만족도 별점</label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">{rating}점 / 5점</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">운동 지속 기간</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="예: 3개월 차, 1학기 동안 꾸준히, 방학 2달"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    핵심 변화 (Before & After)
                  </label>
                  <input
                    type="text"
                    value={beforeAfter}
                    onChange={(e) => setBeforeAfter(e.target.value)}
                    placeholder="예: 계단 2층 헉헉 → 5km 완주 & 체중 -4kg"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    이런 학우에게 강력 추천!
                  </label>
                  <input
                    type="text"
                    value={recommendedTo}
                    onChange={(e) => setRecommendedTo(e.target.value)}
                    placeholder="예: 아침 잠 많고 의지 약한 혼자 운동족"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'mate'
                  ? '예: [신촌/러닝] 연세대 대운동장 트랙 저녁 러닝 메이트 구해요 (초보 6분대)'
                  : type === 'review'
                  ? '예: [후기] 과제 좀비였던 2학년의 100일 러닝 완주기 (5km 성공 썰)'
                  : '예: 대학생 헬린이를 위한 교내 식당 가성비 단백질 식단 꿀팁'
              }
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#6C5CE7]"
            />
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">본문 내용</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="대학생 학우들과 나누고 싶은 경험, 꿀팁, 질문, 모집 안내 사항을 자유롭고 따뜻하게 적어주세요 :)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-normal focus:outline-none focus:border-[#6C5CE7] leading-relaxed resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>해시태그 (띄어쓰기 또는 쉼표로 구분)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="예: #신촌 #초보환영 #갓생 #주말러닝 #공강활용"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7]"
            />
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#F4F2FF] bg-[#FAF9FF] flex items-center justify-between">
          {!currentUser ? (
            <p className="text-[11px] text-gray-500">
              💡 로그인 시 프로필과 작성자 배지가 안전하게 연동됩니다.
            </p>
          ) : (
            <span className="text-[11px] text-[#6C5CE7] font-medium">
              {currentUser.email} 계정으로 작성 중
            </span>
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? '등록 중...' : '게시글 등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
