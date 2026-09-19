import React, { useState, useMemo } from 'react';
import {
  Users,
  Star,
  MessageSquare,
  Search,
  Plus,
  MapPin,
  Calendar,
  Heart,
  Sparkles,
  Filter,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Pin,
  Clock,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { Sport, CommunityPost, CommunityPostType } from '../types';
import { CreatePostModal } from './CreatePostModal';
import { PostDetailModal } from './PostDetailModal';
import { createCommunityPost } from '../lib/firebase';

interface CommunitySectionProps {
  sports: Sport[];
  posts: CommunityPost[];
  onRefreshPosts: () => void;
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  onRequireLogin: () => void;
  initialTab?: 'all' | 'mate' | 'review' | 'general';
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  sports,
  posts,
  onRefreshPosts,
  currentUser,
  isAdmin,
  onRequireLogin,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mate' | 'review' | 'general'>(initialTab);
  const [selectedSportId, setSelectedSportId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recruitingOnly, setRecruitingOnly] = useState(false);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab filter
      if (activeTab !== 'all' && post.type !== activeTab) {
        return false;
      }
      // Sport filter
      if (selectedSportId !== 'all' && post.sportId !== selectedSportId) {
        return false;
      }
      // Recruiting only filter for mate
      if (recruitingOnly && post.type === 'mate' && post.status === 'completed') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesUniv = post.authorUniversity.toLowerCase().includes(query);
        const matchesSport = post.sportName.toLowerCase().includes(query);
        const matchesTag = post.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesLocation = post.mateInfo?.location.toLowerCase().includes(query);

        if (!matchesTitle && !matchesContent && !matchesUniv && !matchesSport && !matchesTag && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [posts, activeTab, selectedSportId, recruitingOnly, searchQuery]);

  // Handle post creation
  const handleCreateSubmit = async (
    postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>
  ) => {
    await createCommunityPost(postData);
    onRefreshPosts();
  };

  const handleOpenDetail = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  // Metrics
  const totalMatesRecruiting = posts.filter((p) => p.type === 'mate' && p.status === 'recruiting').length;
  const totalReviews = posts.filter((p) => p.type === 'review').length;

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B7FE8]/15 via-[#F4F2FF] to-white border border-[#EAE6FE] p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E0DAFC] text-xs font-bold text-[#6C5CE7] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>대학생 운동 소통 플랫폼</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            나의 운동 운명 메이트를 <br className="hidden sm:inline" />
            만나는 곳, <span className="text-[#6C5CE7]">운명 커뮤니티</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            혼자 하기 막막했던 운동, 캠퍼스 친구와 함께 달리고 득근하세요!
            종목별 질문과 리얼 후기, 교내·동네 운동 메이트 모집까지 자유롭게 소통할 수 있습니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#6C5CE7]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 글 / 메이트 모집하기</span>
            </button>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pl-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                모집 중인 메이트 <strong className="text-gray-800">{totalMatesRecruiting}건</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                성공 후기 <strong className="text-gray-800">{totalReviews}건</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Decorative subtle background illustration elements */}
        <div className="absolute right-4 bottom-4 hidden lg:flex items-center gap-3 opacity-80 pointer-events-none select-none">
          <div className="w-24 h-24 rounded-3xl bg-white/70 border border-[#EAE6FE] shadow-sm flex flex-col items-center justify-center p-3 text-center">
            <span className="text-2xl">🏃‍♂️</span>
            <span className="text-[11px] font-bold text-gray-700 mt-1">러닝 메이트</span>
          </div>
          <div className="w-24 h-24 rounded-3xl bg-white/70 border border-[#EAE6FE] shadow-sm flex flex-col items-center justify-center p-3 text-center -translate-y-4">
            <span className="text-2xl">🧗‍♀️</span>
            <span className="text-[11px] font-bold text-gray-700 mt-1">볼더링 친구</span>
          </div>
          <div className="w-24 h-24 rounded-3xl bg-white/70 border border-[#EAE6FE] shadow-sm flex flex-col items-center justify-center p-3 text-center">
            <span className="text-2xl">💪</span>
            <span className="text-[11px] font-bold text-gray-700 mt-1">헬스 파트너</span>
          </div>
        </div>
      </div>

      {/* Main Navigation & Filter Controls */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#6C5CE7] text-white shadow-sm shadow-[#6C5CE7]/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              전체 피드 ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('mate')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'mate'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>운동 메이트 찾기</span>
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>운동 후기·성공사례</span>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'general'
                  ? 'bg-[#6C5CE7] text-white shadow-sm shadow-[#6C5CE7]/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>종목별 자유수다</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 대학, 종목, 태그 검색..."
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#6C5CE7] transition-colors"
            />
          </div>
        </div>

        {/* Sport Horizontal Filters & Mate Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Sports Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setSelectedSportId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedSportId === 'all'
                  ? 'bg-[#F4F2FF] text-[#6C5CE7] font-bold border border-[#DDD6FE]'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              전체 종목
            </button>
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSportId(sport.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedSportId === sport.id
                    ? 'bg-[#F4F2FF] text-[#6C5CE7] font-bold border border-[#DDD6FE]'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {sport.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Additional Filter: Recruiting Only */}
          {activeTab === 'mate' && (
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={recruitingOnly}
                onChange={(e) => setRecruitingOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#6C5CE7] rounded"
              />
              <span>모집 중인 글만 보기</span>
            </label>
          )}
        </div>
      </div>

      {/* Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#EDE9FE] p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F4F2FF] text-[#6C5CE7] flex items-center justify-center mx-auto text-2xl">
            🤝
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-gray-800">
              조건에 맞는 게시글이 없습니다.
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              다른 종목을 선택해보시거나, 가장 먼저 새로운 운동 메이트 모집글을 남겨보세요!
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            첫 게시글 등록하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredPosts.map((post) => {
            const isMate = post.type === 'mate';
            const isReview = post.type === 'review';

            return (
              <div
                key={post.id}
                onClick={() => handleOpenDetail(post)}
                className="bg-white rounded-3xl border border-[#EAE6FE] hover:border-[#6C5CE7]/40 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                {/* Top Badge & Author */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                          isMate
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isReview
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-[#F4F2FF] text-[#6C5CE7] border border-[#E4DFFC]'
                        }`}
                      >
                        {isMate ? '메이트 모집' : isReview ? '운동 후기' : '자유수다'}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {post.sportName}
                      </span>
                      {post.isPinned && (
                        <span className="text-[10px] font-bold text-[#6C5CE7] bg-[#EDE9FE] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5" />
                          <span>추천</span>
                        </span>
                      )}
                    </div>

                    {isMate && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          post.status === 'recruiting'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === 'recruiting' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                        {post.status === 'recruiting' ? '모집중' : '모집완료'}
                      </span>
                    )}

                    {isReview && post.reviewInfo && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{post.reviewInfo.rating}.0</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-gray-900 group-hover:text-[#6C5CE7] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Mate Special Info snippet */}
                {isMate && post.mateInfo && (
                  <div className="bg-[#F8FDF9] p-3 rounded-2xl border border-emerald-100 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{post.mateInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{post.mateInfo.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-100/60 text-emerald-800 font-semibold">
                      <span>모집 인원</span>
                      <span>
                        {post.mateInfo.currentMembers} / {post.mateInfo.maxMembers}명
                      </span>
                    </div>
                  </div>
                )}

                {/* Review Special Info snippet */}
                {isReview && post.reviewInfo && (
                  <div className="bg-[#FFFDF7] p-3 rounded-2xl border border-amber-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span>지속 기간: {post.reviewInfo.duration}</span>
                    </div>
                    <p className="text-gray-700 line-clamp-1 font-medium">
                      💡 {post.reviewInfo.beforeAfter}
                    </p>
                  </div>
                )}

                {/* Tags & Meta Bottom */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">{post.authorName}</span>
                    <span className="text-[10px] text-[#6C5CE7] bg-[#F4F2FF] px-1.5 py-0.5 rounded font-medium">
                      {post.authorUniversity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{post.likes || 0}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#6C5CE7] transition-colors">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span>{post.commentsCount || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        sports={sports}
        currentUser={currentUser}
        defaultType={activeTab === 'all' ? 'general' : activeTab}
        defaultSportId={selectedSportId === 'all' ? 'running' : selectedSportId}
        onRequireLogin={onRequireLogin}
      />

      <PostDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        post={selectedPost}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onPostUpdated={() => {
          onRefreshPosts();
        }}
        onRequireLogin={onRequireLogin}
      />
    </div>
  );
};
