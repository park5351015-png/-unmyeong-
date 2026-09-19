import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  MessageSquare,
  Users,
  Star,
  MapPin,
  Calendar,
  Share2,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  Pin,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { CommunityPost, PostComment } from '../types';
import {
  getCommentsForPost,
  addCommentToPost,
  deleteCommentFromPost,
  toggleLikePost,
  toggleLikeComment,
  updatePostStatus,
  deleteCommunityPost,
  togglePinPost,
} from '../lib/firebase';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  onPostUpdated: () => void;
  onRequireLogin: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
  currentUser,
  isAdmin,
  onPostUpdated,
  onRequireLogin,
}) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(currentUser?.displayName || '');
  const [commentUniv, setCommentUniv] = useState('대학생');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Local likes count and status
  const [currentLikes, setCurrentLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'recruiting' | 'completed'>('recruiting');

  const isAuthor =
    Boolean(currentUser && post && (currentUser.uid === post.authorId || currentUser.displayName === post.authorName));
  const canManage = isAuthor || isAdmin;

  useEffect(() => {
    if (isOpen && post) {
      setCurrentLikes(post.likes || 0);
      setHasLiked(Boolean(currentUser && post.likedByUserIds?.includes(currentUser.uid)));
      setCurrentStatus(post.status || 'recruiting');
      if (currentUser?.displayName) {
        setCommentAuthor(currentUser.displayName);
      }

      // Load comments
      const loadComments = async () => {
        setLoadingComments(true);
        try {
          const comms = await getCommentsForPost(post.id);
          setComments(comms);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingComments(false);
        }
      };
      loadComments();
    }
  }, [isOpen, post, currentUser]);

  if (!isOpen || !post) return null;

  const handleLike = async () => {
    const userId = currentUser?.uid || 'guest';
    try {
      const res = await toggleLikePost(post.id, userId);
      setHasLiked(res.liked);
      setCurrentLikes(res.likes);
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = currentStatus === 'recruiting' ? 'completed' : 'recruiting';
    try {
      await updatePostStatus(post.id, nextStatus);
      setCurrentStatus(nextStatus);
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePinPost(post.id);
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deleteCommunityPost(post.id);
      onPostUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const added = await addCommentToPost({
        postId: post.id,
        authorId: currentUser?.uid || `guest_${Date.now()}`,
        authorName: commentAuthor.trim() || '익명 학우',
        authorUniversity: commentUniv.trim() || '대학생',
        authorPhotoURL: currentUser?.photoURL || undefined,
        content: newCommentText.trim(),
      });
      setComments((prev) => [...prev, added]);
      setNewCommentText('');
      onPostUpdated();
    } catch (err) {
      console.error(err);
      alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteCommentFromPost(post.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onPostUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const newCount = await toggleLikeComment(post.id, commentId);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: newCount } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('게시글 링크가 클립보드에 복사되었습니다! 친구들에게 공유해보세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#EAE6FE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#F4F2FF] flex items-center justify-between bg-gradient-to-r from-[#FAF9FF] to-white">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                post.type === 'mate'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : post.type === 'review'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-[#F4F2FF] text-[#6C5CE7] border border-[#E4DFFC]'
              }`}
            >
              {post.type === 'mate'
                ? '🤝 운동 메이트 찾기'
                : post.type === 'review'
                ? '🏆 후기 및 성공사례'
                : '💬 종목별 자유수다'}
            </span>
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
              {post.sportName}
            </span>
            {post.isPinned && (
              <span className="text-[11px] font-bold text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded-md flex items-center gap-1">
                <Pin className="w-3 h-3" />
                <span>추천 고정글</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {canManage && (
              <>
                {isAdmin && (
                  <button
                    onClick={handleTogglePin}
                    title="상단 고정/해제"
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#6C5CE7] text-xs transition-colors cursor-pointer"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDeletePost}
                  title="게시글 삭제"
                  className="p-1.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleShare}
              title="공유하기"
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Post Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {post.title}
            </h1>

            {/* Author Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAE6FE] text-[#6C5CE7] font-bold flex items-center justify-center text-xs overflow-hidden">
                  {post.authorPhotoURL ? (
                    <img src={post.authorPhotoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{post.authorName[0]}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800">{post.authorName}</span>
                    <span className="text-[11px] text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded-md font-medium">
                      {post.authorUniversity}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Mate recruitment status toggle if mate */}
              {post.type === 'mate' && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      currentStatus === 'recruiting'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        currentStatus === 'recruiting' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    {currentStatus === 'recruiting' ? '메이트 모집 중' : '모집 완료'}
                  </span>

                  {canManage && (
                    <button
                      onClick={handleToggleStatus}
                      className="px-2.5 py-1 rounded-lg border border-gray-300 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {currentStatus === 'recruiting' ? '모집완료로 변경' : '다시 모집하기'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mate Box Details */}
          {post.type === 'mate' && post.mateInfo && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#F4FDF8] to-[#EEFBF3] border border-emerald-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <Users className="w-4 h-4" />
                  <span>운동 메이트 모집 요강</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  현재 인원 {post.mateInfo.currentMembers} / {post.mateInfo.maxMembers}명
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="flex items-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-emerald-100">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">운동 장소</span>
                    <span className="font-bold text-gray-800">{post.mateInfo.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-emerald-100">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">일시 및 주기</span>
                    <span className="font-bold text-gray-800">{post.mateInfo.schedule}</span>
                  </div>
                </div>

                {post.mateInfo.targetLevel && (
                  <div className="flex items-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-emerald-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[11px] text-gray-500 font-medium">모집 대상 / 레벨</span>
                      <span className="font-bold text-gray-800">{post.mateInfo.targetLevel}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-emerald-100">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium">연락 및 신청 방법</span>
                    <span className="font-bold text-gray-800">{post.mateInfo.contactMethod}</span>
                  </div>
                </div>
              </div>

              {/* Mate Join CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-emerald-200">
                <p className="text-xs text-emerald-900 font-medium">
                  {currentStatus === 'recruiting'
                    ? '🙌 함께 운동하고 싶다면 아래 댓글로 편하게 한마디 남겨보세요!'
                    : '이 메이트 모집은 완료되었습니다.'}
                </p>
                {post.mateInfo.contactLink && (
                  <a
                    href={post.mateInfo.contactLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>오픈카톡 바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Review Box Details */}
          {post.type === 'review' && post.reviewInfo && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFFDF5] to-[#FFF9E6] border border-amber-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= post.reviewInfo!.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-black text-amber-900 ml-1.5">
                    {post.reviewInfo.rating}.0 / 5.0 만족도
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  ⏱️ {post.reviewInfo.duration}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    ✨ Before & After 체감 변화
                  </span>
                  <p className="font-semibold text-gray-800 leading-relaxed">
                    {post.reviewInfo.beforeAfter}
                  </p>
                </div>

                <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    🎯 추천 대상 학우
                  </span>
                  <p className="font-semibold text-gray-800 leading-relaxed">
                    {post.reviewInfo.recommendedTo}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line py-2">
            {post.content}
          </div>

          {/* Hashtags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-[#6C5CE7] bg-[#F4F2FF] hover:bg-[#EAE6FE] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>운명 응원하기 ({currentLikes})</span>
            </button>

            <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>댓글 {comments.length}개</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <span>대학생 학우들의 댓글 & 소통</span>
              <span className="text-xs text-[#6C5CE7] font-semibold bg-[#F4F2FF] px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </h3>

            {/* Comment List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="py-6 text-center text-xs text-gray-400">댓글을 불러오는 중...</div>
              ) : comments.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-500">아직 등록된 댓글이 없습니다.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">첫 번째 댓글을 남겨 대화를 시작해보세요!</p>
                </div>
              ) : (
                comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3.5 rounded-2xl bg-gray-50 hover:bg-[#FAF9FF] border border-gray-100 hover:border-[#EDE9FE] transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{comm.authorName}</span>
                        <span className="text-[10px] text-[#6C5CE7] bg-white px-1.5 py-0.5 rounded-md border border-[#EAE6FE]">
                          {comm.authorUniversity}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(comm.createdAt).toLocaleDateString('ko-KR', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeComment(comm.id)}
                          className="text-[11px] text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Heart className="w-3 h-3" />
                          <span>{comm.likes || 0}</span>
                        </button>
                        {(isAdmin || (currentUser && currentUser.uid === comm.authorId)) && (
                          <button
                            onClick={() => handleDeleteComment(comm.id)}
                            className="text-[10px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                      {comm.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="닉네임 (예: 신촌러너)"
                  maxLength={15}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7] bg-white"
                />
                <input
                  type="text"
                  value={commentUniv}
                  onChange={(e) => setCommentUniv(e.target.value)}
                  placeholder="소속 대학 (예: 연세대, 건국대)"
                  maxLength={20}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7] bg-white"
                />
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={
                    post.type === 'mate'
                      ? '메이트 참여 희망, 가능 시간대, 문의 사항을 편하게 남겨주세요!'
                      : '따뜻한 응원이나 질문을 자유롭게 남겨보세요!'
                  }
                  className="w-full p-3 pr-14 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7] resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newCommentText.trim()}
                  className="absolute right-2.5 bottom-3.5 px-3 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
