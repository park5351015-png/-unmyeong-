import React, { useState } from 'react';
import {
  ShieldCheck,
  BarChart3,
  Dumbbell,
  HelpCircle,
  ShoppingBag,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  Eye,
  TrendingUp,
  X,
  Lock,
  MessageSquare,
  Users,
  Star,
  Pin,
  Search,
  MessageCircle,
} from 'lucide-react';
import {
  Sport,
  QuizQuestion,
  ProductItem,
  SponsorInquiry,
  AnalyticsStats,
  CommunityPost,
  PostComment,
} from '../types';
import {
  saveSport,
  deleteSport,
  saveQuestion,
  saveProduct,
  deleteProduct,
  updateInquiryStatus,
  deleteCommunityPost,
  togglePinPost,
  updatePostStatus,
  getCommentsForPost,
  deleteCommentFromPost,
} from '../lib/firebase';

interface AdminDashboardProps {
  sports: Sport[];
  questions: QuizQuestion[];
  products: ProductItem[];
  inquiries: SponsorInquiry[];
  analytics: AnalyticsStats;
  posts: CommunityPost[];
  onRefreshData: () => Promise<void>;
  onRefreshPosts: () => Promise<void> | void;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sports,
  questions,
  products,
  inquiries,
  analytics,
  posts,
  onRefreshData,
  onRefreshPosts,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'sports' | 'questions' | 'products' | 'inquiries' | 'community'>('stats');

  // Sport Editing State
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [isSportModalOpen, setIsSportModalOpen] = useState(false);

  // Product Editing State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Question Editing State
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Community Moderation State
  const [communityFilterType, setCommunityFilterType] = useState<'all' | 'mate' | 'review' | 'general'>('all');
  const [communitySearch, setCommunitySearch] = useState('');
  const [moderatingCommentsPost, setModeratingCommentsPost] = useState<CommunityPost | null>(null);
  const [postCommentsList, setPostCommentsList] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Status message
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 2500);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-[#EDE9FE] shadow-lg space-y-5">
          <div className="w-14 h-14 bg-[#F4F2FF] text-[#6C5CE7] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              운명(運動命) 관리자 전용 공간
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              운동 정보, 테스트 질문, 제휴 제품 및 문의사항을 실시간으로 관리할 수 있습니다.
            </p>
          </div>

          <button
            onClick={onAdminLogin}
            className="w-full py-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>관리자 모드로 접속하기</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle Sport Save
  const handleSaveSport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSport) return;
    try {
      await saveSport(editingSport);
      await onRefreshData();
      setIsSportModalOpen(false);
      setEditingSport(null);
      showToast('운동 정보가 실시간 반영되었습니다.');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await saveProduct(editingProduct);
      await onRefreshData();
      setIsProductModalOpen(false);
      setEditingProduct(null);
      showToast('추천 제품이 실시간 업데이트되었습니다.');
    } catch {
      alert('제품 저장 실패');
    }
  };

  // Handle Question Save
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    try {
      await saveQuestion(editingQuestion);
      await onRefreshData();
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      showToast('테스트 질문이 실시간 업데이트되었습니다.');
    } catch {
      alert('질문 저장 실패');
    }
  };

  // Handle Inquiry Status update
  const handleInquiryStatus = async (id: string, status: SponsorInquiry['status']) => {
    try {
      await updateInquiryStatus(id, status);
      await onRefreshData();
      showToast(`문의 상태가 '${status}'(으)로 변경되었습니다.`);
    } catch {
      alert('상태 변경 실패');
    }
  };

  // Handle Community Post Moderation
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('관리자 권한으로 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await deleteCommunityPost(postId);
      await onRefreshPosts();
      showToast('게시글이 삭제되었습니다.');
    } catch {
      alert('게시글 삭제 실패');
    }
  };

  const handleTogglePin = async (postId: string) => {
    try {
      await togglePinPost(postId);
      await onRefreshPosts();
      showToast('게시글 고정 상태가 변경되었습니다.');
    } catch {
      alert('상태 변경 실패');
    }
  };

  const handleToggleMateStatus = async (postId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'recruiting' ? 'completed' : 'recruiting';
    try {
      await updatePostStatus(postId, nextStatus);
      await onRefreshPosts();
      showToast('모집 상태가 변경되었습니다.');
    } catch {
      alert('상태 변경 실패');
    }
  };

  const handleOpenCommentModeration = async (post: CommunityPost) => {
    setModeratingCommentsPost(post);
    setLoadingComments(true);
    try {
      const comms = await getCommentsForPost(post.id);
      setPostCommentsList(comms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteCommentFromPost(postId, commentId);
      const updated = await getCommentsForPost(postId);
      setPostCommentsList(updated);
      await onRefreshPosts();
      showToast('댓글이 삭제되었습니다.');
    } catch {
      alert('댓글 삭제 실패');
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Toast alert */}
      {actionMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#6C5CE7] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F4F2FF] text-[#6C5CE7] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">
              운명(運動命) 관리자 대시보드
            </h1>
            <p className="text-xs text-gray-400">
              실시간 데이터베이스 동기화 모드 활성
            </p>
          </div>
        </div>

        <button
          onClick={onAdminLogout}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          관리자 로그아웃
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>대시보드 통계</span>
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sports'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>운동 종목 관리 ({sports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'questions'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>테스트 질문 관리 ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>추천/제휴 상품 ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'inquiries'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>제휴 문의 ({inquiries.length})</span>
          {inquiries.some((i) => i.status === '접수완료') && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'community'
              ? 'bg-[#6C5CE7] text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>커뮤니티 관리 ({posts.length})</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-xs font-semibold text-gray-400">누적 운동 성향 테스트</span>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {analytics.totalTests.toLocaleString()} <span className="text-sm font-normal text-gray-500">회</span>
              </p>
              <span className="text-[11px] text-[#6C5CE7] font-semibold mt-2 inline-block">
                ↑ 실시간 카운트 연동 중
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-xs font-semibold text-gray-400">제휴 상품 클릭 수</span>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {Object.values(analytics.productClicks).reduce((a, b) => a + b, 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">건</span>
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-2 inline-block">
                어필리에이트 전환 기여
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-xs font-semibold text-gray-400">접수된 브랜드 제휴 문의</span>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {inquiries.length} <span className="text-sm font-normal text-gray-500">건</span>
              </p>
              <span className="text-[11px] text-amber-600 font-semibold mt-2 inline-block">
                {inquiries.filter((i) => i.status === '접수완료').length}건 검토 대기 중
              </span>
            </div>
          </div>

          {/* Popular Sports Ranking */}
          <div className="bg-white p-6 rounded-3xl border border-[#EDE9FE] shadow-2xs">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6C5CE7]" />
              <span>가장 많이 추천된 운동 TOP 순위</span>
            </h3>

            <div className="space-y-3">
              {sports
                .map((s) => ({
                  sport: s,
                  count: analytics.sportRecommendations[s.id] || 0,
                }))
                .sort((a, b) => b.count - a.count)
                .map((item, idx) => {
                  const maxCount = Math.max(...Object.values(analytics.sportRecommendations), 1);
                  const percentage = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.sport.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-800">
                          {idx + 1}. {item.sport.name}
                        </span>
                        <span className="font-semibold text-gray-500">
                          {item.count}회 추천
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#8B7FE8] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sports Management */}
      {activeTab === 'sports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              등록된 운동 정보 목록 ({sports.length})
            </h3>
            <button
              onClick={() => {
                setEditingSport({
                  id: `sport_${Date.now()}`,
                  name: '새로운 운동',
                  englishName: 'New Sport',
                  category: '유산소',
                  intro: '운동 소개를 입력하세요.',
                  difficulty: 2,
                  estimatedCost: '월 3~5만 원',
                  costLevel: 1,
                  effects: '주요 효과를 적어주세요.',
                  items: '준비물을 적어주세요.',
                  beginnerTip: '대학생 초보자를 위한 꿀팁',
                  targetGroup: '추천 대상 대학생',
                  location: '실내',
                  caloriesPerHour: 400,
                  studentSuitability: '대학생 맞춤 코멘트',
                  tagList: ['신규운동'],
                  iconName: 'Dumbbell',
                });
                setIsSportModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 운동 추가</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE9FE] overflow-hidden">
            <div className="divide-y divide-gray-100">
              {sports.map((sport) => (
                <div key={sport.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded-md">
                        {sport.category}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900">
                        {sport.name}
                      </h4>
                      <span className="text-xs text-gray-400">({sport.location})</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{sport.intro}</p>
                    <p className="text-[11px] text-gray-400">
                      비용: {sport.estimatedCost} · 난이도: {'★'.repeat(sport.difficulty)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingSport({ ...sport });
                        setIsSportModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`'${sport.name}'을(를) 삭제하시겠습니까?`)) {
                          await deleteSport(sport.id);
                          await onRefreshData();
                          showToast('운동이 삭제되었습니다.');
                        }
                      }}
                      className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Questions Management */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              운동 성향 테스트 질문 목록 ({questions.length})
            </h3>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-2 py-0.5 rounded-md">
                      질문 {idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{q.title}</h4>
                  </div>
                  <button
                    onClick={() => {
                      setEditingQuestion({ ...q });
                      setIsQuestionModalOpen(true);
                    }}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                    title="질문 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => (
                    <div key={opt.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="font-bold text-gray-800">{opt.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        가중치: {Object.entries(opt.weights).map(([k, v]) => `${k}(+${v})`).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              추천 및 제휴 상품 ({products.length})
            </h3>
            <button
              onClick={() => {
                setEditingProduct({
                  id: `prod_${Date.now()}`,
                  sportId: sports[0]?.id || 'running',
                  name: '신규 추천 상품',
                  brand: '브랜드명',
                  description: '상품 상세 설명을 입력하세요.',
                  price: '25,000원',
                  numericPrice: 25000,
                  affiliateUrl: 'https://smartstore.naver.com',
                  isSponsored: true,
                  clicks: 0,
                  badgeText: '제휴 특가',
                });
                setIsProductModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 상품 등록</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE9FE] overflow-hidden">
            <div className="divide-y divide-gray-100">
              {products.map((prod) => {
                const sport = sports.find((s) => s.id === prod.sportId);
                return (
                  <div key={prod.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {prod.isSponsored ? (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                            SPONSORED
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                            일반추천
                          </span>
                        )}
                        <span className="text-xs font-semibold text-gray-400">
                          [{sport ? sport.name.split(' ')[0] : prod.sportId}]
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">{prod.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500">
                        {prod.brand} · <span className="font-bold text-gray-800">{prod.price}</span>
                      </p>
                      <p className="text-[11px] text-gray-400">누적 클릭 수: {prod.clicks || 0}회</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...prod });
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`'${prod.name}'을(를) 삭제하시겠습니까?`)) {
                            await deleteProduct(prod.id);
                            await onRefreshData();
                            showToast('상품이 삭제되었습니다.');
                          }
                        }}
                        className="p-2 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Sponsor Inquiries Management */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            접수된 브랜드 제휴 및 협찬 제안 ({inquiries.length})
          </h3>

          {inquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-400 text-sm">
              아직 접수된 제휴 문의가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                          {inq.partnershipType}
                        </span>
                        <h4 className="text-base font-bold text-gray-900">{inq.brandName}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        담당자: {inq.managerName} · {inq.email} · {inq.phone || '연락처 미기재'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => handleInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                          inq.status === '접수완료'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : inq.status === '검토중'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="접수완료">상태: 접수완료</option>
                        <option value="검토중">상태: 검토중</option>
                        <option value="연락완료">상태: 연락완료</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#FAF9FF] p-3.5 rounded-2xl text-xs text-gray-700 leading-relaxed font-normal">
                    {inq.message}
                  </div>

                  <p className="text-[10px] text-gray-400 text-right">
                    접수일시: {new Date(inq.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Community Moderation */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          {/* Header & Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-400">총 등록 게시글</span>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{posts.length}건</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-600">모집 중인 메이트</span>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">
                {posts.filter((p) => p.type === 'mate' && p.status === 'recruiting').length}건
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-[11px] font-semibold text-amber-600">운동 후기 및 사례</span>
              <p className="text-2xl font-black text-amber-700 mt-0.5">
                {posts.filter((p) => p.type === 'review').length}건
              </p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-[#EDE9FE] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6C5CE7]">상단 고정 추천글</span>
              <p className="text-2xl font-black text-[#6C5CE7] mt-0.5">
                {posts.filter((p) => p.isPinned).length}건
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-3xl border border-[#EDE9FE] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setCommunityFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  communityFilterType === 'all'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체 ({posts.length})
              </button>
              <button
                onClick={() => setCommunityFilterType('mate')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  communityFilterType === 'mate'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                메이트 ({posts.filter((p) => p.type === 'mate').length})
              </button>
              <button
                onClick={() => setCommunityFilterType('review')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  communityFilterType === 'review'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                후기 ({posts.filter((p) => p.type === 'review').length})
              </button>
              <button
                onClick={() => setCommunityFilterType('general')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  communityFilterType === 'general'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                자유수다 ({posts.filter((p) => p.type === 'general').length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                placeholder="제목, 작성자, 대학, 종목 검색..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>
          </div>

          {/* Posts Moderation List */}
          {posts
            .filter((p) => {
              if (communityFilterType !== 'all' && p.type !== communityFilterType) return false;
              if (communitySearch.trim()) {
                const q = communitySearch.toLowerCase();
                return (
                  p.title.toLowerCase().includes(q) ||
                  p.authorName.toLowerCase().includes(q) ||
                  p.authorUniversity.toLowerCase().includes(q) ||
                  p.sportName.toLowerCase().includes(q) ||
                  p.content.toLowerCase().includes(q)
                );
              }
              return true;
            })
            .length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-400 text-sm">
              표시할 게시글이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {posts
                .filter((p) => {
                  if (communityFilterType !== 'all' && p.type !== communityFilterType) return false;
                  if (communitySearch.trim()) {
                    const q = communitySearch.toLowerCase();
                    return (
                      p.title.toLowerCase().includes(q) ||
                      p.authorName.toLowerCase().includes(q) ||
                      p.authorUniversity.toLowerCase().includes(q) ||
                      p.sportName.toLowerCase().includes(q) ||
                      p.content.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-4 sm:p-5 rounded-3xl border border-[#EDE9FE] shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            post.type === 'mate'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : post.type === 'review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {post.type === 'mate'
                            ? '메이트 구하기'
                            : post.type === 'review'
                            ? '운동 후기'
                            : '종목별 자유수다'}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          {post.sportName}
                        </span>
                        {post.isPinned && (
                          <span className="text-[11px] font-bold text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            <span>상단 고정</span>
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
                          {post.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.type === 'mate' && (
                          <button
                            onClick={() => handleToggleMateStatus(post.id, post.status)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                              post.status === 'recruiting'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}
                          >
                            {post.status === 'recruiting' ? '모집중 (완료로 변경)' : '모집완료 (다시모집)'}
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePin(post.id)}
                          title="상단 추천 고정 토글"
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            post.isPinned
                              ? 'bg-[#EDE9FE] text-[#6C5CE7] border-[#DDD6FE]'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200'
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenCommentModeration(post)}
                          title="댓글 관리"
                          className="px-2.5 py-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>댓글 ({post.commentsCount || 0})</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          title="게시글 삭제"
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">작성자: {post.authorName}</span>
                        <span>•</span>
                        <span>대학: {post.authorUniversity}</span>
                        <span>•</span>
                        <span>응원: {post.likes || 0}</span>
                      </div>
                      <span>
                        등록일: {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Comment Moderation Modal */}
          {moderatingCommentsPost && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[85vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      게시글 댓글 모니터링 및 삭제 관리
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {moderatingCommentsPost.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setModeratingCommentsPost(null)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-3">
                  {loadingComments ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      댓글을 불러오는 중...
                    </div>
                  ) : postCommentsList.length === 0 ? (
                    <div className="py-10 text-center text-xs text-gray-400">
                      등록된 댓글이 없습니다.
                    </div>
                  ) : (
                    postCommentsList.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-gray-800">{comm.authorName}</span>
                            <span className="text-[10px] text-[#6C5CE7] bg-white px-1.5 py-0.5 rounded border border-[#EDE9FE]">
                              {comm.authorUniversity}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(comm.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                            {comm.content}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteComment(moderatingCommentsPost.id, comm.id)
                          }
                          className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => setModeratingCommentsPost(null)}
                    className="px-4 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sport Edit Modal */}
      {isSportModalOpen && editingSport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">운동 종목 정보 편집</h3>
              <button
                onClick={() => setIsSportModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSport} className="p-6 overflow-y-auto flex-1 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">운동 이름</label>
                <input
                  type="text"
                  required
                  value={editingSport.name}
                  onChange={(e) => setEditingSport({ ...editingSport, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">카테고리</label>
                  <select
                    value={editingSport.category}
                    onChange={(e) => setEditingSport({ ...editingSport, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900 bg-white"
                  >
                    <option value="유산소">유산소</option>
                    <option value="근력">근력</option>
                    <option value="라켓">라켓</option>
                    <option value="힐링/유연성">힐링/유연성</option>
                    <option value="이색/액티비티">이색/액티비티</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">장소</label>
                  <select
                    value={editingSport.location}
                    onChange={(e) => setEditingSport({ ...editingSport, location: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900 bg-white"
                  >
                    <option value="실내">실내</option>
                    <option value="실외">실외</option>
                    <option value="실내/실외">실내/실외</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">소개 문구</label>
                <textarea
                  rows={2}
                  required
                  value={editingSport.intro}
                  onChange={(e) => setEditingSport({ ...editingSport, intro: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">예상 비용 (대학생 팁 포함)</label>
                <input
                  type="text"
                  required
                  value={editingSport.estimatedCost}
                  onChange={(e) => setEditingSport({ ...editingSport, estimatedCost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">초보 난이도 (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingSport.difficulty}
                    onChange={(e) => setEditingSport({ ...editingSport, difficulty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">1시간 소모 칼로리 (kcal)</label>
                  <input
                    type="number"
                    value={editingSport.caloriesPerHour}
                    onChange={(e) => setEditingSport({ ...editingSport, caloriesPerHour: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">주요 효과</label>
                <input
                  type="text"
                  value={editingSport.effects}
                  onChange={(e) => setEditingSport({ ...editingSport, effects: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">필수 준비물</label>
                <input
                  type="text"
                  value={editingSport.items}
                  onChange={(e) => setEditingSport({ ...editingSport, items: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">초보자 꿀팁 (선배 TIP)</label>
                <textarea
                  rows={2}
                  value={editingSport.beginnerTip}
                  onChange={(e) => setEditingSport({ ...editingSport, beginnerTip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">추천 제품 및 제휴 설정</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">연계 운동 종목</label>
                <select
                  value={editingProduct.sportId}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sportId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900 bg-white"
                >
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상품명</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">브랜드</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">가격 표시 (원)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">구매/제휴 아웃링크 URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.affiliateUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, affiliateUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSponsoredCheck"
                  checked={editingProduct.isSponsored}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isSponsored: e.target.checked })}
                  className="w-4 h-4 text-[#6C5CE7] rounded"
                />
                <label htmlFor="isSponsoredCheck" className="text-xs font-bold text-gray-800">
                  SPONSORED (제휴 마케팅) 배지 표기
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">특가/혜택 배지 문구</label>
                <input
                  type="text"
                  placeholder="예: 대학생 15% 할인"
                  value={editingProduct.badgeText || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badgeText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Edit Modal */}
      {isQuestionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EDE9FE] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">테스트 질문 내용 수정</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 overflow-y-auto flex-1 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">질문 제목</label>
                <input
                  type="text"
                  required
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">질문 보조 설명</label>
                <input
                  type="text"
                  value={editingQuestion.subtitle}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-gray-900"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-gray-500 mb-2">선택지 목록:</p>
                <div className="space-y-2">
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={opt.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => {
                          const newOpts = [...editingQuestion.options];
                          newOpts[idx] = { ...opt, label: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: newOpts });
                        }}
                        className="w-full px-2 py-1 rounded-lg border text-xs font-bold bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
