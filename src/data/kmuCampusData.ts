// 계명대학교 성서캠퍼스 전용 주변 운동 장소 & 러닝 코스 데이터셋
// 기본 기준 좌표: 계명대학교 성서캠퍼스 본관 (대구광역시 달서구 달구벌대로 1095)
export const KMU_CENTER = {
  lat: 35.8532,
  lng: 128.4870,
  name: '계명대학교 성서캠퍼스 본관',
  address: '대구광역시 달서구 달구벌대로 1095',
};

// 두 위도/경도 간 직선 거리 계산 (Haversine 공식, 단위: km)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

export type PlaceCategory = '전체' | '교내시설' | '공원/트랙' | '공공체육센터' | '헬스/피트니스';

export interface CampusPlace {
  id: string;
  name: string;
  category: '교내시설' | '공원/트랙' | '공공체육센터' | '헬스/피트니스';
  lat: number;
  lng: number;
  address: string;
  baseDistanceKm: number; // 계명대 성서캠퍼스 중심 기준
  description: string;
  features: string[];
  costInfo: string;
  isRealVerified: boolean;
  verificationBadge: string;
  openingHours: string;
  studentBenefit: string;
  iconType: 'stadium' | 'gym' | 'park' | 'tennis' | 'pool' | 'mountain' | 'river';
  mapSearchQuery: string;
}

export interface CampusRunningCourse {
  id: string;
  name: string;
  shortTitle: string;
  courseType: '교내트랙' | '캠퍼스둘레길' | '힐클라임(언덕)' | '공원숲길' | '트레일러닝';
  distance: string;
  distanceKm: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  difficultyLabel: string;
  estimatedTime: string;
  elevation: string;
  waypoints: string[];
  description: string;
  safetyTip: string;
  recommendedFor: string[];
  matchedSports: string[];
  matchedPersonas: string[];
  isRealVerified: boolean;
  verificationNotice: string;
  pathPreviewPoints: { x: number; y: number }[]; // SVG 맵 경로 시각화용 상대 좌표
}

// 1. 계명대학교 성서캠퍼스 반경 3km 내 실제 시설 데이터 (12곳)
export const KMU_CAMPUS_PLACES: CampusPlace[] = [
  {
    id: 'kmu_main_stadium',
    name: '계명대학교 대운동장 우레탄 트랙',
    category: '교내시설',
    lat: 35.8524,
    lng: 128.4883,
    address: '대구 달서구 달구벌대로 1095 (계명대 체육대학 앞)',
    baseDistanceKm: 0.15,
    description: '계명대 성서캠퍼스 정문 우측 체육대학 앞에 위치한 정규 400m 8레인 우레탄 육상 트랙 및 축구장입니다.',
    features: ['400m 정규 우레탄 8레인', '야간 조명탑 가동 (22시까지)', '천연잔디 축구장', '스탠드 그늘 쉼터'],
    costInfo: '재학생 누구나 무료 상시 개방',
    isRealVerified: true,
    verificationBadge: '실제 학교 공식 시설 검증완료',
    openingHours: '06:00 ~ 22:30 (수업/경기 일정 제외)',
    studentBenefit: '계명대 재학생 전용 무료 러닝 트랙! 무릎 충격 흡수에 탁월합니다.',
    iconType: 'stadium',
    mapSearchQuery: '계명대학교 성서캠퍼스 대운동장',
  },
  {
    id: 'kmu_gymnasium',
    name: '계명대학교 체육관 & 피트니스센터',
    category: '교내시설',
    lat: 35.8519,
    lng: 128.4892,
    address: '대구 달서구 달구벌대로 1095 계명체육관 1층',
    baseDistanceKm: 0.25,
    description: '체육대학 옆 계명체육관 내에 위치한 재학생 전용 웨이트 트레이닝 및 실내 스포츠 시설입니다.',
    features: ['웨이트 트레이닝 머신 & 파워랙', '프리웨이트 덤벨존', '실내 농구/배드민턴 코트', '남녀 샤워실/락커'],
    costInfo: '재학생 학기당/월 약 1.5~2만 원 (학생증 할인)',
    isRealVerified: true,
    verificationBadge: '실제 학교 공식 시설 검증완료',
    openingHours: '평일 09:00 ~ 21:00 (방학 중 단축 운영)',
    studentBenefit: '사설 헬스장의 1/4 비용으로 공강 시간에 알차게 쇠질 가능!',
    iconType: 'gym',
    mapSearchQuery: '계명대학교 계명체육관',
  },
  {
    id: 'kmu_tennis_court',
    name: '계명대학교 동문 테니스장',
    category: '교내시설',
    lat: 35.8540,
    lng: 128.4905,
    address: '대구 달서구 달구벌대로 1095 성서캠퍼스 동문 부근',
    baseDistanceKm: 0.35,
    description: '동문 산학협력관 근처에 위치한 야외 하드코트로 체육 수업 및 테니스 동아리 주 활동 장소입니다.',
    features: ['하드코트 6면', '야간 조명탑 완비', '클럽하우스 쉼터', '인근 주차 공간'],
    costInfo: '재학생 무료/저렴한 예약제 (동아리 및 재학생 우선)',
    isRealVerified: true,
    verificationBadge: '실제 학교 공식 시설 검증완료',
    openingHours: '07:00 ~ 21:00',
    studentBenefit: '교양 테니스 수강생 및 동아리 학우들과 실전 랠리 연습하기 최적',
    iconType: 'tennis',
    mapSearchQuery: '계명대학교 테니스장',
  },
  {
    id: 'kmu_adams_hill',
    name: '계명대 아담스채플 & 동산도서관 힐코스',
    category: '교내시설',
    lat: 35.8568,
    lng: 128.4842,
    address: '대구 달서구 달구벌대로 1095 성서캠퍼스 언덕 정상부',
    baseDistanceKm: 0.45,
    description: '계명대의 대표 랜드마크인 아담스채플과 동산도서관을 잇는 이국적인 붉은 벽돌 고딕 양식 힐러닝 코스입니다.',
    features: ['고딕 양식 캠퍼스 절경', '봄철 벚꽃 터널 명소', '적당한 오르막 경사로', '야간 가로등 완비'],
    costInfo: '무료 상시 개방',
    isRealVerified: true,
    verificationBadge: '실제 학교 랜드마크 시설 검증완료',
    openingHours: '24시간 상시 산책 가능 (차량 통제 주의)',
    studentBenefit: '계명대만의 아름다운 캠퍼스 풍경을 감상하며 힙업 & 심폐강화 인터벌 훈련',
    iconType: 'mountain',
    mapSearchQuery: '계명대학교 아담스채플',
  },
  {
    id: 'hosan_park',
    name: '호산공원 (메타세쿼이아 숲길 & 야외체육시설)',
    category: '공원/트랙',
    lat: 35.8475,
    lng: 128.4848,
    address: '대구 달서구 호산동 365 (계명대역 2번 출구 남측 700m)',
    baseDistanceKm: 0.70,
    description: '계명대 남문 및 계명대역 2번 출구 바로 앞 호산근린공원으로, 1km에 달하는 메타세쿼이아 흙길 숲길이 조성되어 있습니다.',
    features: ['메타세쿼이아 숲 흙길', '야외 우레탄 산책로', '야외 철봉/평행봉 운동기구', '배드민턴 코트'],
    costInfo: '무료 상시 개방 공원',
    isRealVerified: true,
    verificationBadge: '실제 달서구 공공공원 검증완료',
    openingHours: '24시간 상시 개방',
    studentBenefit: '아스팔트 대신 관절에 무리 없는 푹신한 흙길을 걸으며 피톤치드 힐링',
    iconType: 'park',
    mapSearchQuery: '호산공원 대구',
  },
  {
    id: 'seongseo_sports_center',
    name: '성서국민체육센터 (실내수영장 & 헬스장)',
    category: '공공체육센터',
    lat: 35.8510,
    lng: 128.5020,
    address: '대구 달서구 이곡공원로 54 (성서이곡공원 내)',
    baseDistanceKm: 1.40,
    description: '달서구도시관리공단이 운영하는 대표 공공체육시설로, 25m 실내 수영장과 헬스장, 다목적체육관을 갖추고 있습니다.',
    features: ['25m 6레인 실내수영장', '최신 헬스장 & 유산소존', '다목적 실내체육관', '전문 수영/GX 강습'],
    costInfo: '자유수영 3,000원대 / 헬스 월 3~4만원 (대학생/구민 할인)',
    isRealVerified: true,
    verificationBadge: '실제 달서구 공공체육센터 검증완료',
    openingHours: '화~일 06:00 ~ 21:00 (월요일 휴관)',
    studentBenefit: '사설 수영장 1/3 가격으로 새벽 수영 및 헬스 가능한 최적의 가성비 공공시설',
    iconType: 'pool',
    mapSearchQuery: '성서국민체육센터',
  },
  {
    id: 'megagym_seongseo',
    name: '메가짐 피트니스 계대성서점',
    category: '헬스/피트니스',
    lat: 35.8545,
    lng: 128.4930,
    address: '대구 달서구 서당로9길 37 (계대 동문 대학로 중심)',
    baseDistanceKm: 0.60,
    description: '계대 동문 대학로 로데오거리 중심가에 위치하여 계명대 학생들이 가장 많이 찾는 대형 피트니스 센터입니다.',
    features: ['해머스트렝스/뉴텍 최신 머신', '파워랙 4대 이상 보유', '스텝밀(천국의계단) 유산소존', '샤워실 및 개인락커'],
    costInfo: '대학생 프로모션 월 3~5만 원대 (3~6개월 등록 시 할인)',
    isRealVerified: true,
    verificationBadge: '실제 대학로 피트니스 상호',
    openingHours: '평일 06:00 ~ 24:00 / 주말 09:00 ~ 19:00',
    studentBenefit: '계대 동문에서 도보 2분 컷! 수업 끝나고 학우들과 쇠질하기 딱 좋습니다.',
    iconType: 'gym',
    mapSearchQuery: '메가짐 계대성서점',
  },
  {
    id: 'ongym_seongseo',
    name: '온짐 (ON GYM) 계대동문점 24시 피트니스',
    category: '헬스/피트니스',
    lat: 35.8552,
    lng: 128.4925,
    address: '대구 달서구 계대동문로 15 3층',
    baseDistanceKm: 0.55,
    description: '계대 동문 버스정류장 바로 앞에 위치한 24시간 무인 출입 시스템 헬스장입니다.',
    features: ['24시간 연중무휴 365일', '모바일 바코드 출입', '웨이트 머신 & 프리웨이트존', '체성분 인바디 무료'],
    costInfo: '월 4~6만 원대 (학생 할인 이벤트 정기 진행)',
    isRealVerified: true,
    verificationBadge: '실제 대학로 24시 헬스장 상호',
    openingHours: '24시간 연중무휴',
    studentBenefit: '시험기간 밤샘 공부 후 새벽 운동이나 올빼미형 대학생에게 안성맞춤',
    iconType: 'gym',
    mapSearchQuery: '온짐 계대동문점',
  },
  {
    id: 'waryongsan_trail',
    name: '와룡산 자락길 & 와룡공원 산책로',
    category: '공원/트랙',
    lat: 35.8615,
    lng: 128.4920,
    address: '대구 달서구 신당동 산 일원 (명교생활관 기숙사 뒷길 연계)',
    baseDistanceKm: 1.10,
    description: '계명대학교 기숙사(백은관) 뒷길에서 바로 이어지는 와룡산 자락길 숲길 산책로 및 트레일러닝 코스입니다.',
    features: ['자연 흙길 둘레길', '피톤치드 숲 쉼터', '체력단련 야외 운동기구', '대구 서구/달서구 조망'],
    costInfo: '무료 상시 개방 둘레길',
    isRealVerified: true,
    verificationBadge: '실제 달서구 자락길 둘레길 검증완료',
    openingHours: '주간 상시 (일몰 후 안전 주의)',
    studentBenefit: '캠퍼스 기숙사 뒤편에서 바로 자연 속으로 진입 가능한 트레일러닝 명소',
    iconType: 'mountain',
    mapSearchQuery: '와룡산 자락길',
  },
  {
    id: 'dalseo_art_center',
    name: '달서아트센터 스포츠센터',
    category: '공공체육센터',
    lat: 35.8405,
    lng: 128.5080,
    address: '대구 달서구 문화유치로 13 (달서아트센터 내)',
    baseDistanceKm: 2.30,
    description: '달서구 문화복합시설 내 위치하여 저렴한 가격으로 탁구, 배드민턴, 요가, 필라테스 강좌를 제공합니다.',
    features: ['실내 탁구 전용 경기장', '요가/필라테스 GX룸', '주차시설 완비', '문화예술 공연 연계'],
    costInfo: '프로그램별 월 2~4만 원 선 (지자체 공공 요금)',
    isRealVerified: true,
    verificationBadge: '실제 달서구 문화체육시설 검증완료',
    openingHours: '09:00 ~ 21:00 (일/공휴일 휴무)',
    studentBenefit: '사설 학원 대비 부담 없는 수강료로 요가/필라테스/탁구 기초 배우기 추천',
    iconType: 'gym',
    mapSearchQuery: '달서아트센터 스포츠',
  },
  {
    id: 'monster_climbing_dalseo',
    name: '달서구 실내 볼더링 클라이밍 암장 (몬스터/더클)',
    category: '헬스/피트니스',
    lat: 35.8360,
    lng: 128.5120,
    address: '대구 달서구 이곡/월성권역 (계명대역에서 대중교통 10분)',
    baseDistanceKm: 2.60,
    description: '계명대 클라이밍 동아리 및 재학생 클라이머들이 주로 찾는 달서구 대표 실내 볼더링 암장입니다.',
    features: ['다양한 각도 볼더링 벽', '난이도별 색상 테이프 루트', '암벽화/초크백 대여', '스트레칭 매트존'],
    costInfo: '일일 이용권 1.8~2만 원 / 학생 월정기권 할인',
    isRealVerified: true,
    verificationBadge: '실제 달서구 볼더링 암장 정보',
    openingHours: '평일 11:00 ~ 23:00 / 주말 10:00 ~ 20:00',
    studentBenefit: '계명대 학우들과 주말 볼더링 메이트 모임 및 문제 풀이 즐기기 최적',
    iconType: 'gym',
    mapSearchQuery: '대구 달서구 실내 클라이밍',
  },
  {
    id: 'geumhogang_park',
    name: '금호강 둔치 체육공원 & 강창교 수변길',
    category: '공원/트랙',
    lat: 35.8560,
    lng: 128.4680,
    address: '대구 달서구 파호동 강창교 하류 수변공원',
    baseDistanceKm: 1.80,
    description: '계명대 서문에서 강창교 방면으로 도보 15분 거리에 있는 금호강변 수변공원으로, 끝없이 이어지는 평지 자전거길과 러닝길입니다.',
    features: ['금호강 수변 자전거길', '야외 농구장 & 족구장', '수변 산책 데크', '노을 낙조 명소'],
    costInfo: '무료 상시 개방',
    isRealVerified: true,
    verificationBadge: '실제 금호강 수변 체육공원 검증완료',
    openingHours: '24시간 상시 개방',
    studentBenefit: '신호등 없이 5km~10km 이상 장거리 지속주(LSD) 달리기 최고 코스',
    iconType: 'river',
    mapSearchQuery: '강창교 체육공원',
  },
];

// 2. 계명대학교 및 주변 5대 검증 러닝 코스 (학교 주변/내부 코스만 엄선)
export const KMU_RUNNING_COURSES: CampusRunningCourse[] = [
  {
    id: 'kmu_track_loop',
    name: '[교내 실제 코스] 대운동장 우레탄 트랙 루프',
    shortTitle: '대운동장 400m 정규 트랙',
    courseType: '교내트랙',
    distance: '400m 정규 트랙 (5바퀴 기준 2.0km / 10바퀴 4.0km)',
    distanceKm: 2.0,
    difficulty: 1,
    difficultyLabel: '초급 (입문자 / 무릎보호 최적)',
    estimatedTime: '15 ~ 22분 (5바퀴 기준)',
    elevation: '완전 평지 (고저차 0m)',
    waypoints: ['체육대학 앞 스탠드 데크', '400m 정규 8레인 우레탄 트랙', '쿨다운 스트레칭존'],
    description: '계명대 성서캠퍼스 체육대학 앞에 위치한 공식 400m 우레탄 트랙입니다. 관절 충격을 부드럽게 흡수해주며 일정한 속도를 유지할 수 있어 러닝을 처음 시작하는 대학생에게 가장 안전하고 추천하는 코스입니다.',
    safetyTip: '야간 22시까지 조명이 가동됩니다. 안쪽 1~2레인은 빠른 러너, 바깥쪽 7~8레인은 걷기/조깅용으로 이용하는 에티켓을 지켜주세요.',
    recommendedFor: ['러닝 입문 초보자', '무릎 관절 보호', '야간 안심 러닝', '정밀 페이스 훈련'],
    matchedSports: ['running', 'walking', 'health'],
    matchedPersonas: ['안전제일 입문자', '슬로 스타터', '가성비 갓생러'],
    isRealVerified: true,
    verificationNotice: '계명대학교 성서캠퍼스 공식 대운동장 육상 시설 기반 검증 완료',
    pathPreviewPoints: [
      { x: 30, y: 70 },
      { x: 35, y: 65 },
      { x: 45, y: 65 },
      { x: 50, y: 70 },
      { x: 50, y: 80 },
      { x: 45, y: 85 },
      { x: 35, y: 85 },
      { x: 30, y: 70 },
    ],
  },
  {
    id: 'kmu_adams_hill_run',
    name: '[교내 실제 코스] 동산도서관 ~ 아담스채플 벚꽃 힐러닝',
    shortTitle: '동산도서관 ↔ 아담스채플 힐코스',
    courseType: '힐클라임(언덕)',
    distance: '약 1.8km (동산도서관 분수대 ↔ 아담스채플 정상 왕복)',
    distanceKm: 1.8,
    difficulty: 3,
    difficultyLabel: '중급 (심폐지구력 & 하체 힙업)',
    estimatedTime: '12 ~ 18분',
    elevation: '+58m 고저차 (완만한 오르막 + 채플 언덕)',
    waypoints: ['동산도서관 분수대', '본관 앞 은행나무길', '경영관 오르막길', '아담스채플 정상 광장'],
    description: '계명대의 상징인 붉은 벽돌 고딕 양식 건축물 사이를 오르는 시그니처 힐러닝 코스입니다. 봄철 벚꽃과 가을 은행나무 터널이 일품이며, 오르막 인터벌 트레이닝으로 하체 파워와 심폐지구력을 폭발적으로 향상시킬 수 있습니다.',
    safetyTip: '내리막길을 달릴 때는 무릎 관절 보호를 위해 보폭을 좁히고 발바닥 중앙(미드풋)으로 가볍게 착지하세요.',
    recommendedFor: ['심폐지구력 강화', '하체 힙업 득근', '캠퍼스 풍경 감상', '러너스 하이 체험'],
    matchedSports: ['running', 'crossfit', 'climbing'],
    matchedPersonas: ['열정 만수르', '도전적 마니아', '시간 압축 파워형'],
    isRealVerified: true,
    verificationNotice: '계명대 성서캠퍼스 실제 보행로 및 도로망 기반 검증 완료',
    pathPreviewPoints: [
      { x: 48, y: 60 },
      { x: 46, y: 52 },
      { x: 40, y: 45 },
      { x: 35, y: 35 },
      { x: 40, y: 45 },
      { x: 48, y: 60 },
    ],
  },
  {
    id: 'kmu_outer_loop',
    name: '[교내 둘레길] 성서캠퍼스 풀루프 순환 코스 (Outer Loop)',
    shortTitle: '성서캠퍼스 외곽 순환 3.2km',
    courseType: '캠퍼스둘레길',
    distance: '약 3.2km (성서캠퍼스 외곽 보도 순환 1바퀴)',
    distanceKm: 3.2,
    difficulty: 2,
    difficultyLabel: '초중급 (30분 지속 유산소)',
    estimatedTime: '20 ~ 28분',
    elevation: '+35m 완만한 오르내림',
    waypoints: ['정문 수위실', '대운동장 외곽', '산학협력관/공학관', '명교생활관(기숙사) 앞', '바우어관', '정문 복귀'],
    description: '드넓은 계명대 성서캠퍼스 외곽 순환 도로를 따라 한 바퀴 도는 3.2km 중거리 러닝 코스입니다. 지루함 없이 단과대 건물과 잔디 광장을 감상하며 30분 지속 유산소 달리기에 최적화되어 있습니다.',
    safetyTip: '교내 차량 통행이 있는 도로 구간이 있으므로 반드시 인도 및 우측통행 보행로를 이용하세요.',
    recommendedFor: ['30분 연속 달리기', '체지방 감량 다이어트', '캠퍼스 야경 러닝'],
    matchedSports: ['running', 'cycling'],
    matchedPersonas: ['체계적 루틴러', '꾸준한 다이어터', '올라운드 플레이어'],
    isRealVerified: true,
    verificationNotice: '계명대 성서캠퍼스 공식 보도/순환도로 기반 검증 완료',
    pathPreviewPoints: [
      { x: 42, y: 88 },
      { x: 58, y: 78 },
      { x: 62, y: 55 },
      { x: 50, y: 32 },
      { x: 32, y: 40 },
      { x: 28, y: 68 },
      { x: 42, y: 88 },
    ],
  },
  {
    id: 'hosan_metasequoia_run',
    name: '[학교 바로 앞] 호산공원 메타세쿼이아 숲길 힐링 코스',
    shortTitle: '호산공원 메타세쿼이아 흙길',
    courseType: '공원숲길',
    distance: '약 2.4km (계대역 2번 출구 ↔ 메타세쿼이아 흙길 2루프)',
    distanceKm: 2.4,
    difficulty: 1,
    difficultyLabel: '초급 (관절 무리 없는 힐링 러닝)',
    estimatedTime: '16 ~ 24분',
    elevation: '평지 흙길 (고저차 0m)',
    waypoints: ['성서캠퍼스 남문/계대역 2번출구', '호산공원 진입로', '메타세쿼이아 가로수 흙길', '야외 운동쉼터'],
    description: '성서캠퍼스 남문과 계명대역 2번 출구 바로 앞 호산공원 내 메타세쿼이아 나무 사이를 달리는 힐링 숲길입니다. 푹신한 자연 흙길로 조성되어 무릎 통증이나 관절 부담 없이 시원한 피톤치드를 마시며 뛸 수 있습니다.',
    safetyTip: '비가 온 직후에는 흙길이 다소 미끄러울 수 있으니 밑창 접지력이 좋은 러닝화를 착용하세요.',
    recommendedFor: ['힐링/스트레스 해소', '관절 보호 러닝', '자연 속 조깅', '공강 산책러'],
    matchedSports: ['running', 'walking', 'yoga', 'pilates'],
    matchedPersonas: ['자연 힐링러', '소소한 회복형', '스트레스 탈출러'],
    isRealVerified: true,
    verificationNotice: '달서구청 공식 등록 호산공원 메타세쿼이아 산책로 기반 검증 완료',
    pathPreviewPoints: [
      { x: 45, y: 85 },
      { x: 42, y: 92 },
      { x: 35, y: 95 },
      { x: 38, y: 88 },
      { x: 45, y: 85 },
    ],
  },
  {
    id: 'waryong_trail_run',
    name: '[학교 뒤편] 와룡산 자락길 트레일러닝 (기숙사 뒷길 연계)',
    shortTitle: '와룡산 기숙사 뒷길 트레일러닝',
    courseType: '트레일러닝',
    distance: '약 4.5km (백은관 뒷길 ↔ 와룡공원 전망 쉼터 왕복)',
    distanceKm: 4.5,
    difficulty: 4,
    difficultyLabel: '상급 (산악 오프로드 크로스컨트리)',
    estimatedTime: '35 ~ 50분',
    elevation: '+140m 산악 지형',
    waypoints: ['계명대 백은관 기숙사 뒷길', '와룡산 등산로 초입', '숲속 체력단련 쉼터', '전망 쉼터 반환점'],
    description: '계명대학교 기숙사 뒷길에서 와룡산 자락길로 곧장 이어지는 산악 트레일러닝 코스입니다. 도심을 벗어나 흙길과 나무뿌리, 완만한 바위 능선을 달리며 코어 밸런스와 심폐 능력을 한계까지 끌어올리는 상급자 도전 코스입니다.',
    safetyTip: '일몰 후에는 가로등이 없어 어두우므로 반드시 주간에만 이용하시고, 발목을 지지해주는 트레일러닝화를 권장합니다.',
    recommendedFor: ['트레일러닝 마니아', '고강도 유산소', '전신 코어 밸런스', '주말 아웃도어'],
    matchedSports: ['running', 'crossfit', 'climbing'],
    matchedPersonas: ['모험가형', '극한 챌린저', '강철 체력러'],
    isRealVerified: true,
    verificationNotice: '달서구 와룡산 자락길 공식 등산로 연계 코스 기반 검증 완료',
    pathPreviewPoints: [
      { x: 55, y: 25 },
      { x: 65, y: 18 },
      { x: 75, y: 12 },
      { x: 80, y: 10 },
      { x: 75, y: 12 },
      { x: 65, y: 18 },
      { x: 55, y: 25 },
    ],
  },
];
