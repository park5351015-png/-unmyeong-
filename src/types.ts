export interface Sport {
  id: string;
  name: string;
  englishName: string;
  category: '유산소' | '근력' | '라켓' | '힐링/유연성' | '이색/액티비티';
  intro: string;
  difficulty: number; // 1 to 5
  estimatedCost: string; // e.g. "월 3~5만 원 (교내 피트니스 이용 시 1~2만 원)"
  costLevel: 1 | 2 | 3; // 1: 저렴/무료, 2: 중간, 3: 다소부담
  effects: string; // 주요 효과
  items: string; // 준비물
  beginnerTip: string; // 대학생 초보자 꿀팁
  targetGroup: string; // 추천 대상
  location: '실내' | '실외' | '실내/실외';
  caloriesPerHour: number;
  studentSuitability: string; // 대학생 맞춤 포인트
  tagList: string[];
  iconName: string;
}

export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  weights: Record<string, number>; // sportId -> score addition
}

export interface QuizQuestion {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  category: string;
  options: QuizOption[];
}

export interface ProductItem {
  id: string;
  sportId: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  numericPrice: number;
  imageUrl?: string;
  affiliateUrl: string;
  isSponsored: boolean;
  clicks: number;
  badgeText?: string;
}

export interface SponsorInquiry {
  id: string;
  brandName: string;
  managerName: string;
  phone: string;
  email: string;
  partnershipType: string;
  message: string;
  status: '접수완료' | '검토중' | '연락완료';
  createdAt: string;
}

export interface PersonaProfile {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  badgeBg: string;
}

export interface UserTestResult {
  persona: PersonaProfile;
  topSports: {
    sport: Sport;
    matchPercent: number;
    matchReason: string;
  }[];
  userAnswers: Record<string, string>;
  createdAt: string;
}

export interface AnalyticsStats {
  totalTests: number;
  sportRecommendations: Record<string, number>;
  productClicks: Record<string, number>;
  totalInquiries: number;
}

export type CommunityPostType = 'general' | 'mate' | 'review';

export interface MateInfo {
  location: string; // e.g. "연세대 대운동장 트랙"
  schedule: string; // e.g. "매주 화/목 19:30"
  currentMembers: number;
  maxMembers: number;
  contactMethod: string; // e.g. "댓글 또는 오픈카톡"
  contactLink?: string; // e.g. "https://open.kakao.com/..."
  targetLevel?: string; // e.g. "초보 러너 6분대 페이스"
}

export interface ReviewInfo {
  rating: number; // 1 to 5
  duration: string; // e.g. "3개월째 지속 중"
  beforeAfter: string; // e.g. "체력 방전 → 5km 가뿐히 완주"
  recommendedTo: string; // e.g. "아침에 활력이 필요한 대학생"
}

export interface CommunityPost {
  id: string;
  type: CommunityPostType;
  sportId: string;
  sportName: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUniversity: string; // e.g. "연세대", "건국대", "서울대", "일반대학생"
  authorPhotoURL?: string;
  tags: string[];
  likes: number;
  likedByUserIds?: string[];
  commentsCount: number;
  createdAt: string;
  status?: 'recruiting' | 'completed'; // For mate posts
  mateInfo?: MateInfo;
  reviewInfo?: ReviewInfo;
  isNotice?: boolean;
  isPinned?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUniversity: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: string;
  likes: number;
}

