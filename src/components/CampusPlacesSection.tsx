import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  Dumbbell,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpDown,
  Filter,
  Flame,
  Award,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  KMU_CENTER,
  KMU_CAMPUS_PLACES,
  KMU_RUNNING_COURSES,
  CampusPlace,
  CampusRunningCourse,
  calculateDistanceKm,
  PlaceCategory,
} from '../data/kmuCampusData';
import { UserTestResult, Sport } from '../types';

interface CampusPlacesSectionProps {
  userTestResult?: UserTestResult | null;
  onOpenQuiz?: () => void;
  onSelectSport?: (sport: Sport) => void;
}

export const CampusPlacesSection: React.FC<CampusPlacesSectionProps> = ({
  userTestResult,
  onOpenQuiz,
}) => {
  // Navigation / View mode: 'places' (내 주변 운동 시설) or 'courses' (검증 러닝 코스)
  const [activeView, setActiveView] = useState<'places' | 'courses'>('places');

  // GPS / User location state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    isGPS: boolean;
  }>({
    lat: KMU_CENTER.lat,
    lng: KMU_CENTER.lng,
    name: KMU_CENTER.name,
    isGPS: false,
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Filters & sorting for Places
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>('전체');
  const [sortBy, setSortBy] = useState<'distance' | 'name' | 'free'>('distance');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('kmu_main_stadium');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Course selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    KMU_RUNNING_COURSES[0].id
  );

  // Get current active GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsNotice('사용하시는 브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    setGpsLoading(true);
    setGpsNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const distFromKmu = calculateDistanceKm(
          KMU_CENTER.lat,
          KMU_CENTER.lng,
          latitude,
          longitude
        );

        setUserLocation({
          lat: latitude,
          lng: longitude,
          name: `내 GPS 위치 (성서캠에서 ${distFromKmu}km)`,
          isGPS: true,
        });
        setGpsLoading(false);
        setGpsNotice(
          `현재 GPS 위치가 확인되었습니다. 계명대 성서캠퍼스로부터 ${distFromKmu}km 지점입니다.`
        );
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation error:', err);
        setGpsNotice(
          '위치 권한이 거부되었거나 신호를 찾을 수 없습니다. 기본 위치(계명대 성서캠퍼스)로 유지됩니다.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const handleResetToCampus = () => {
    setUserLocation({
      lat: KMU_CENTER.lat,
      lng: KMU_CENTER.lng,
      name: KMU_CENTER.name,
      isGPS: false,
    });
    setGpsNotice(null);
  };

  // Calculate live distance for all places based on userLocation
  const placesWithLiveDistance = useMemo(() => {
    return KMU_CAMPUS_PLACES.map((p) => {
      const distance = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        p.lat,
        p.lng
      );
      return {
        ...p,
        liveDistanceKm: distance,
      };
    });
  }, [userLocation]);

  // Filtered & sorted places
  const filteredPlaces = useMemo(() => {
    let result = placesWithLiveDistance.filter((p) => {
      if (selectedCategory !== '전체' && p.category !== selectedCategory) {
        return false;
      }
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.liveDistanceKm - b.liveDistanceKm;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ko');
      }
      if (sortBy === 'free') {
        const isFreeA = a.costInfo.includes('무료') ? 0 : 1;
        const isFreeB = b.costInfo.includes('무료') ? 0 : 1;
        return isFreeA - isFreeB;
      }
      return 0;
    });

    return result;
  }, [placesWithLiveDistance, selectedCategory, sortBy, searchKeyword]);

  const selectedPlace = useMemo(() => {
    return (
      placesWithLiveDistance.find((p) => p.id === selectedPlaceId) ||
      placesWithLiveDistance[0]
    );
  }, [placesWithLiveDistance, selectedPlaceId]);

  const selectedCourse = useMemo(() => {
    return (
      KMU_RUNNING_COURSES.find((c) => c.id === selectedCourseId) ||
      KMU_RUNNING_COURSES[0]
    );
  }, [selectedCourseId]);

  // Quiz-based recommendation logic for running courses
  const recommendedCourseId = useMemo(() => {
    if (!userTestResult || !userTestResult.topSports.length) {
      return 'kmu_track_loop'; // default beginner loop
    }
    const topId = userTestResult.topSports[0].sport.id;
    if (topId === 'running' || topId === 'crossfit') {
      return 'kmu_adams_hill_run'; // Adams chapel hill
    }
    if (topId === 'walking' || topId === 'pilates' || topId === 'yoga') {
      return 'hosan_metasequoia_run'; // Hosan park earth trail
    }
    if (topId === 'climbing') {
      return 'waryong_trail_run'; // Waryongsan trail run
    }
    return 'kmu_track_loop';
  }, [userTestResult]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* 1. Header Banner & Campus Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002C6C]/10 via-[#F4F2FF] to-white border border-[#D5CEFC] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002C6C] text-white text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>KMU 성서캠퍼스 전용</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-indigo-200 text-indigo-700 text-xs font-medium">
                반경 3km 운동 장소 & 러닝 코스
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                기준: 본관 (달구벌대로 1095)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              계명대 학생 맞춤 <span className="text-[#4F46E5]">내 주변 운동 장소 & 러닝 코스</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              성서캠퍼스 대운동장 트랙부터 아담스채플 힐러닝, 호산공원 메타세쿼이아숲, 
              교내 체육관 및 24시 피트니스까지! 실제 확인된 체육시설과 검증된 러닝 코스를 안내합니다.
            </p>
          </div>

          {/* Location Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleGetCurrentLocation}
              disabled={gpsLoading}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                userLocation.isGPS
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
              }`}
            >
              <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? 'GPS 수신 중...' : '현재 위치 보기 (GPS)'}</span>
            </button>

            {userLocation.isGPS && (
              <button
                onClick={handleResetToCampus}
                className="px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                <span>계명대 기준으로 복원</span>
              </button>
            )}
          </div>
        </div>

        {/* GPS status notice */}
        {gpsNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-indigo-100 flex items-center gap-2 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{gpsNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Top View Switcher (Facilities vs Running Courses) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100/90 w-fit">
          <button
            onClick={() => setActiveView('places')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'places'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>반경 3km 운동 장소 ({KMU_CAMPUS_PLACES.length}곳)</span>
          </button>
          <button
            onClick={() => setActiveView('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'courses'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Footprints className="w-4 h-4 text-emerald-600" />
            <span>학교 & 주변 러닝 코스 ({KMU_RUNNING_COURSES.length}개)</span>
          </button>
        </div>

        {/* Real Data & Safety Guarantee Disclaimer */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>계명대 성서캠퍼스 공식 시설 및 달서구 공공 데이터 검증</span>
        </div>
      </div>

      {/* 3. Interactive SVG Campus & Surroundings Vector Map */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">
              계명대학교 성서캠퍼스 인터랙티브 맵
            </h3>
            <span className="text-[11px] text-gray-400">
              (핀을 클릭하면 상세 정보와 길찾기가 연결됩니다)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#002C6C]" />
              <span>교내시설</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>공원/숲길</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>체육센터/헬스</span>
            </span>
          </div>
        </div>

        {/* Vector Map Canvas */}
        <div className="relative w-full aspect-16/9 sm:aspect-21/9 bg-[#F8F9FD] rounded-2xl overflow-hidden border border-gray-100 select-none">
          {/* Subtle grid and distance concentric circles from KMU center */}
          <svg className="w-full h-full" viewBox="0 0 1000 450">
            <defs>
              <radialGradient id="campusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Background subtle campus zones */}
            {/* North Hills: Waryongsan */}
            <path
              d="M 50,0 Q 200,60 500,40 T 950,20 L 1000,0 L 0,0 Z"
              fill="#E8F5E9"
              opacity="0.8"
            />
            <text x="750" y="35" fontSize="12" fill="#2E7D32" fontWeight="bold">
              ⛰️ 와룡산 자락길
            </text>

            {/* West River: Geumhogang */}
            <path
              d="M 0,180 Q 80,240 120,380 L 140,450 L 0,450 Z"
              fill="#E0F2FE"
              opacity="0.7"
            />
            <text x="25" y="300" fontSize="11" fill="#0369A1" fontWeight="bold">
              🌊 금호강 강창교
            </text>

            {/* Campus Outline Zone (Keimyung Seongseo Campus) */}
            <rect
              x="260"
              y="110"
              width="380"
              height="240"
              rx="30"
              fill="#EEF2FF"
              stroke="#C7D2FE"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text x="280" y="135" fontSize="12" fill="#3730A3" fontWeight="bold">
              🏫 계명대학교 성서캠퍼스
            </text>

            {/* 1km / 2km concentric distance guide rings */}
            <circle
              cx="450"
              cy="230"
              r="140"
              fill="none"
              stroke="#E0E7FF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="595" y="235" fontSize="10" fill="#9CA3AF">
              반경 1km
            </text>

            <circle
              cx="450"
              cy="230"
              r="260"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x="715" y="235" fontSize="10" fill="#9CA3AF">
              반경 2km
            </text>

            {/* Subway Line 2 / Dalgubeol-daero */}
            <line
              x1="120"
              y1="370"
              x2="950"
              y2="370"
              stroke="#FBBF24"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <text x="410" y="390" fontSize="11" fill="#B45309" fontWeight="bold">
              🚇 달구벌대로 (계명대역 2번 출구)
            </text>

            {/* Campus Center Pin */}
            <circle cx="450" cy="230" r="16" fill="url(#campusGlow)" />
            <circle cx="450" cy="230" r="6" fill="#002C6C" />
            <text x="460" y="234" fontSize="11" fill="#002C6C" fontWeight="bold">
              계명대 본관
            </text>

            {/* Running Course Route Overlay if in 'courses' view */}
            {activeView === 'courses' && selectedCourse && (
              <g>
                <polyline
                  points={selectedCourse.pathPreviewPoints
                    .map((pt) => `${pt.x * 10},${pt.y * 4.5}`)
                    .join(' ')}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* Facility Markers on Map */}
            {KMU_CAMPUS_PLACES.map((p, idx) => {
              // Map approximate coords to canvas viewbox (1000 x 450)
              // Lat range: 35.8360 (bottom) to 35.8615 (top)
              // Lng range: 128.4680 (left) to 128.5120 (right)
              const nx = (p.lng - 128.465) / (128.515 - 128.465);
              const ny = 1 - (p.lat - 35.835) / (35.865 - 35.835);
              const cx = Math.max(40, Math.min(940, nx * 900 + 50));
              const cy = Math.max(40, Math.min(410, ny * 380 + 35));

              const isSelected = selectedPlaceId === p.id;
              const isCampus = p.category === '교내시설';

              return (
                <g
                  key={p.id}
                  onClick={() => {
                    setSelectedPlaceId(p.id);
                    if (activeView === 'courses') setActiveView('places');
                  }}
                  className="cursor-pointer group"
                >
                  {/* Pin Pulse */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill={isCampus ? '#4F46E5' : '#10B981'}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}
                  {/* Pin Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 9 : 7}
                    fill={isCampus ? '#002C6C' : p.category === '공원/트랙' ? '#10B981' : '#4F46E5'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  {/* Label */}
                  <text
                    x={cx + 12}
                    y={cy + 4}
                    fontSize={isSelected ? '12' : '10'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fill={isSelected ? '#111827' : '#4B5563'}
                    className="drop-shadow-xs"
                  >
                    {p.name.replace(/\[.*?\]/g, '').split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* User GPS Pin (if GPS active) */}
            {userLocation.isGPS && (
              <g>
                <circle
                  cx={Math.max(
                    40,
                    Math.min(
                      940,
                      ((userLocation.lng - 128.465) / (128.515 - 128.465)) * 900 + 50
                    )
                  )}
                  cy={Math.max(
                    40,
                    Math.min(
                      410,
                      (1 - (userLocation.lat - 35.835) / (35.865 - 35.835)) * 380 + 35
                    )
                  )}
                  r="14"
                  fill="#EF4444"
                  opacity="0.3"
                  className="animate-ping"
                />
                <circle
                  cx={Math.max(
                    40,
                    Math.min(
                      940,
                      ((userLocation.lng - 128.465) / (128.515 - 128.465)) * 900 + 50
                    )
                  )}
                  cy={Math.max(
                    40,
                    Math.min(
                      410,
                      (1 - (userLocation.lat - 35.835) / (35.865 - 35.835)) * 380 + 35
                    )
                  )}
                  r="7"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* Quick Info Box on the bottom right of Map */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-gray-200 shadow-sm text-xs max-w-xs hidden sm:block">
            <span className="text-[10px] font-bold text-indigo-600 block uppercase">
              선택된 장소
            </span>
            <p className="font-bold text-gray-900 truncate">{selectedPlace.name}</p>
            <p className="text-gray-500 text-[11px]">
              거리: {selectedPlace.liveDistanceKm}km · {selectedPlace.category}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* VIEW 1: 반경 3km 내 운동 장소 목록 (Places View) */}
      {/* ========================================================== */}
      {activeView === 'places' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {(['전체', '교내시설', '공원/트랙', '공공체육센터', '헬스/피트니스'] as PlaceCategory[]).map(
                (cat) => {
                  const count =
                    cat === '전체'
                      ? KMU_CAMPUS_PLACES.length
                      : KMU_CAMPUS_PLACES.filter((p) => p.category === cat).length;
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#002C6C] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                }
              )}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="장소명, 주소 검색..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="distance">가까운 순</option>
                  <option value="name">가나다순</option>
                  <option value="free">무료 우선</option>
                </select>
              </div>
            </div>
          </div>

          {/* Place Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlaceId === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#F5F3FF] via-white to-white border-[#4F46E5] ring-2 ring-[#4F46E5]/15 shadow-md'
                      : 'bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header tags & distance */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            place.category === '교내시설'
                              ? 'bg-[#002C6C] text-white'
                              : place.category === '공원/트랙'
                              ? 'bg-emerald-100 text-emerald-800'
                              : place.category === '공공체육센터'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {place.category}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{place.verificationBadge}</span>
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#4F46E5]">
                          {place.liveDistanceKm} km
                        </span>
                        <span className="block text-[10px] text-gray-400">
                          {userLocation.isGPS ? '현재 위치 기준' : '성서캠 본관 기준'}
                        </span>
                      </div>
                    </div>

                    {/* Title & Address */}
                    <div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-600">
                        {place.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{place.address}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {place.description}
                    </p>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {place.features.slice(0, 3).map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[10px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Student Benefit Note */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-tight">
                      <span className="font-bold mr-1">🎓 학생 혜택:</span>
                      <span>{place.studentBenefit}</span>
                    </div>
                  </div>

                  {/* Card Bottom: Cost & Direct Map Navigation Link */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">이용료</span>
                      <strong className="text-gray-800 text-[11px]">{place.costInfo}</strong>
                    </div>

                    <a
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(
                        place.mapSearchQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>카카오맵 길찾기</span>
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* VIEW 2: 계명대 및 주변 검증 러닝 코스 (Running Courses View) */}
      {/* ========================================================== */}
      {activeView === 'courses' && (
        <div className="space-y-6">
          {/* Quiz Match Recommender Banner */}
          {userTestResult && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    내 성향 진단 기반 추천 코스
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                    {userTestResult.persona.title} 성향 맞춤 :{' '}
                    <span className="text-[#4F46E5]">
                      {
                        KMU_RUNNING_COURSES.find((c) => c.id === recommendedCourseId)
                          ?.shortTitle
                      }
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourseId(recommendedCourseId)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                추천 코스 바로 보기
              </button>
            </div>
          )}

          {/* Running Course Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {KMU_RUNNING_COURSES.map((course) => {
              const isSelected = selectedCourseId === course.id;
              const isRecommended = course.id === recommendedCourseId;

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#EEF2FF] to-white border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold shadow-2xs">
                      내 추천
                    </span>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {course.courseType}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 mt-2 line-clamp-1">
                      {course.shortTitle}
                    </h4>
                    <p className="text-[11px] font-black text-gray-800 mt-0.5">
                      {course.distance.split('(')[0]}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                    <span>{course.estimatedTime}</span>
                    <span className="text-amber-600 font-bold">
                      {'★'.repeat(course.difficulty)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Course Deep Dive Showcase */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {selectedCourse.courseType}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {selectedCourse.verificationNotice}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {selectedCourse.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed max-w-3xl">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(
                    selectedCourse.waypoints[0]
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-[#002C6C] hover:bg-[#002050] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>출발지 길찾기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] text-gray-400 block font-medium">코스 거리</span>
                <strong className="text-sm font-black text-gray-900 mt-0.5 block">
                  {selectedCourse.distance}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] text-gray-400 block font-medium">예상 완주 시간</span>
                <strong className="text-sm font-black text-indigo-600 mt-0.5 block">
                  {selectedCourse.estimatedTime}
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] text-gray-400 block font-medium">난이도</span>
                <strong className="text-sm font-black text-amber-600 mt-0.5 block">
                  {'★'.repeat(selectedCourse.difficulty)}
                  <span className="text-gray-300">
                    {'★'.repeat(5 - selectedCourse.difficulty)}
                  </span>{' '}
                  <span className="text-xs font-normal text-gray-600">
                    ({selectedCourse.difficultyLabel})
                  </span>
                </strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] text-gray-400 block font-medium">고저차 / 경사</span>
                <strong className="text-sm font-black text-gray-900 mt-0.5 block">
                  {selectedCourse.elevation}
                </strong>
              </div>
            </div>

            {/* Course Waypoints Timeline */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                경유 체크포인트 (Waypoints)
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {selectedCourse.waypoints.map((wp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#002C6C] text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{wp}</span>
                    </span>
                    {idx < selectedCourse.waypoints.length - 1 && (
                      <span className="text-gray-300 font-bold">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Tips & Target Runners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FEFCE8] border border-[#FEF08A] text-xs text-[#854D0E] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>안전 러닝 수칙 & 현장 팁</span>
                </span>
                <p className="leading-relaxed">{selectedCourse.safetyTip}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>이런 계명대 학우에게 추천해요!</span>
                </span>
                <p className="leading-relaxed">
                  {selectedCourse.recommendedFor.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
