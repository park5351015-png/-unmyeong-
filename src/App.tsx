import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { QuizModal } from './components/QuizModal';
import { TestResultModal } from './components/TestResultModal';
import { SportsBrowse } from './components/SportsBrowse';
import { SportDetailModal } from './components/SportDetailModal';
import { SportCompare } from './components/SportCompare';
import { ProductsSection } from './components/ProductsSection';
import { SponsorInquiryModal } from './components/SponsorInquiryModal';
import { CommunitySection } from './components/CommunitySection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import {
  Sport,
  QuizQuestion,
  ProductItem,
  SponsorInquiry,
  AnalyticsStats,
  UserTestResult,
  CommunityPost,
} from './types';
import {
  auth,
  testConnection,
  loginWithGoogle,
  logoutUser,
  getSportsData,
  getQuestionsData,
  getProductsData,
  getInquiries,
  getAnalytics,
  getCommunityPosts,
} from './lib/firebase';
import {
  DEFAULT_SPORTS,
  DEFAULT_QUIZ_QUESTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_INQUIRIES,
  DEFAULT_ANALYTICS,
} from './data/defaultData';
import { DEFAULT_POSTS } from './data/defaultCommunityData';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'home' | 'browse' | 'compare' | 'community' | 'products' | 'sponsor' | 'admin'>('home');

  // Core Data
  const [sports, setSports] = useState<Sport[]>(DEFAULT_SPORTS);
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUIZ_QUESTIONS);
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [inquiries, setInquiries] = useState<SponsorInquiry[]>(DEFAULT_INQUIRIES);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(DEFAULT_ANALYTICS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(DEFAULT_POSTS);
  const [loading, setLoading] = useState(true);

  // Auth & Admin
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [demoAdminLoggedIn, setDemoAdminLoggedIn] = useState(false);

  // Modals & States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [testResult, setTestResult] = useState<UserTestResult | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const [selectedSportForDetail, setSelectedSportForDetail] = useState<Sport | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [compareSportA, setCompareSportA] = useState<Sport | null>(null);
  const [compareSportB, setCompareSportB] = useState<Sport | null>(null);

  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [filterProductSportId, setFilterProductSportId] = useState<string | null>(null);

  // Check admin rights
  const isAdmin = demoAdminLoggedIn || currentUser?.email === 'park5351015@gmail.com';

  // Fetch / Sync all data
  const loadAppData = async () => {
    try {
      const [sData, qData, pData, inqData, aData, cPosts] = await Promise.all([
        getSportsData(),
        getQuestionsData(),
        getProductsData(),
        getInquiries(),
        getAnalytics(),
        getCommunityPosts(),
      ]);
      setSports(sData);
      setQuestions(qData);
      setProducts(pData);
      setInquiries(inqData);
      setAnalytics(aData);
      setCommunityPosts(cPosts);
    } catch (err) {
      console.warn('Data sync note: using cached/default dataset', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCommunityPosts = async () => {
    try {
      const posts = await getCommunityPosts();
      setCommunityPosts(posts);
    } catch (err) {
      console.warn('Community posts sync error:', err);
    }
  };

  useEffect(() => {
    testConnection();
    loadAppData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Handlers
  const handleStartQuiz = () => {
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (result: UserTestResult) => {
    setIsQuizOpen(false);
    setTestResult(result);
    setIsResultOpen(true);
    // Refresh stats to reflect new count
    loadAppData();
  };

  const handleRetest = () => {
    setIsResultOpen(false);
    setIsQuizOpen(true);
  };

  const handleViewSportDetail = (sport: Sport) => {
    setSelectedSportForDetail(sport);
    setIsDetailOpen(true);
  };

  const handleCompareWith = (sport: Sport) => {
    setIsDetailOpen(false);
    setCompareSportA(sport);
    // Pick another sport for B
    const other = sports.find((s) => s.id !== sport.id) || sports[0];
    setCompareSportB(other);
    setCurrentTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProducts = (sportId: string) => {
    setIsDetailOpen(false);
    setIsResultOpen(false);
    setFilterProductSportId(sportId);
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSponsor = () => {
    setIsSponsorModalOpen(true);
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      alert('구글 로그인 중 취소되었거나 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setDemoAdminLoggedIn(false);
  };

  const handleAdminLogin = () => {
    setDemoAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setDemoAdminLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col selection:bg-[#EAE6FE] selection:text-[#6C5CE7]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuiz={handleStartQuiz}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAdminLoggedIn={isAdmin}
        onOpenAdmin={() => {
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onStartQuiz={handleStartQuiz}
              onExploreSports={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToCommunity={() => {
                setCurrentTab('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <HowItWorks
              onStartQuiz={handleStartQuiz}
              sports={sports}
              onSelectSport={handleViewSportDetail}
              onGoToCommunity={() => {
                setCurrentTab('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToCompare={() => {
                setCurrentTab('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToProducts={() => {
                setCurrentTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSponsor={() => setIsSponsorModalOpen(true)}
            />
          </>
        )}

        {currentTab === 'browse' && (
          <SportsBrowse
            sports={sports}
            onSelectSport={handleViewSportDetail}
            onCompareSport={handleCompareWith}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentTab === 'compare' && (
          <SportCompare
            sports={sports}
            initialSportA={compareSportA}
            initialSportB={compareSportB}
            onSelectSport={handleViewSportDetail}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentTab === 'community' && (
          <CommunitySection
            sports={sports}
            posts={communityPosts}
            onRefreshPosts={handleRefreshCommunityPosts}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onRequireLogin={handleLogin}
          />
        )}

        {currentTab === 'products' && (
          <ProductsSection
            products={products}
            sports={sports}
            filterSportId={filterProductSportId}
            onClearFilter={() => setFilterProductSportId(null)}
            onOpenSponsor={handleOpenSponsor}
          />
        )}

        {currentTab === 'sponsor' && (
          <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl border border-[#EDE9FE] p-8 sm:p-12 shadow-sm text-center space-y-6">
              <span className="text-xs font-bold text-[#6C5CE7] bg-[#F4F2FF] px-3.5 py-1 rounded-full uppercase tracking-wider">
                PARTNERSHIP
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                운명(運動命)과 함께할 파트너 브랜드를 모십니다
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                운명(運動命)은 운동을 시작하고자 하는 20대 대학생들이 자신의 성향에 맞는 최적의 스포츠를 탐색하고 시작할 수 있도록 돕는 플랫폼입니다.
                스포츠웨어, 운동용품, 체육 시설(헬스장/클라이밍/필라테스 등), 건강기능식품 등 대학생과 시너지를 낼 수 있는 모든 제휴를 환영합니다.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleOpenSponsor}
                  className="px-8 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-sm shadow-md shadow-[#6C5CE7]/25 transition-all cursor-pointer"
                >
                  제휴 및 스폰서 제안서 작성하기
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            sports={sports}
            questions={questions}
            products={products}
            inquiries={inquiries}
            analytics={analytics}
            posts={communityPosts}
            onRefreshPosts={handleRefreshCommunityPosts}
            onRefreshData={loadAppData}
            isAdminLoggedIn={isAdmin}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSponsor={handleOpenSponsor}
        onOpenQuiz={handleStartQuiz}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={questions}
        sports={sports}
        onComplete={handleQuizComplete}
      />

      <TestResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        result={testResult}
        onRetest={handleRetest}
        onViewSportDetail={handleViewSportDetail}
        onViewProducts={handleViewProducts}
      />

      <SportDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        sport={selectedSportForDetail}
        onCompareWith={handleCompareWith}
        onViewProducts={handleViewProducts}
        products={products}
      />

      <SponsorInquiryModal
        isOpen={isSponsorModalOpen}
        onClose={() => setIsSponsorModalOpen(false)}
        onInquirySubmitted={() => loadAppData()}
      />
    </div>
  );
}
