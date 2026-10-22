import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Square,
  Activity,
  Flame,
  Zap,
  Leaf,
  Users,
  Compass,
  MapPin,
  Trophy,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Navigation,
  Info,
} from 'lucide-react';
import { ActivityType, RouteCoordinate, WorkoutActivity, UserEcoProfile } from '../types';
import {
  calculateCarbonSavedKg,
  calculateEcoPoints,
  recordWorkoutActivity,
} from '../lib/ecoStorage';

interface GpsActivityTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivityType?: ActivityType;
  initialMateName?: string;
  initialMatePostId?: string;
  onWorkoutFinished: (activity: WorkoutActivity, newProfile: UserEcoProfile) => void;
  onOpenShop: () => void;
}

// Haversine formula to compute distance in kilometers between two GPS coordinates
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const GpsActivityTracker: React.FC<GpsActivityTrackerProps> = ({
  isOpen,
  onClose,
  initialActivityType = 'running',
  initialMateName = '',
  initialMatePostId = '',
  onWorkoutFinished,
  onOpenShop,
}) => {
  // Setup state
  const [activityType, setActivityType] = useState<ActivityType>(initialActivityType);
  const [partnerMateName, setPartnerMateName] = useState<string>(initialMateName);
  const [isMateEnabled, setIsMateEnabled] = useState<boolean>(Boolean(initialMateName));

  // Tracking state
  const [trackingState, setTrackingState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Finished summary
  const [finishedActivity, setFinishedActivity] = useState<WorkoutActivity | null>(null);

  // Refs for continuous tracking
  const coordinatesRef = useRef<RouteCoordinate[]>([]);
  const lastCoordRef = useRef<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const simIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset when opened with new props
  useEffect(() => {
    if (isOpen) {
      if (initialMateName) {
        setPartnerMateName(initialMateName);
        setIsMateEnabled(true);
      }
      if (initialActivityType) {
        setActivityType(initialActivityType);
      }
    }
  }, [isOpen, initialActivityType, initialMateName]);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      stopGpsWatch();
      stopTimer();
      stopSimulation();
    };
  }, []);

  const stopGpsWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const stopTimer = () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const stopSimulation = () => {
    if (simIntervalRef.current !== null) {
      window.clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setIsSimulating(false);
    }
  };

  // Start workout
  const handleStartWorkout = () => {
    setTrackingState('running');
    setGpsError(null);

    // Start timer
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Start GPS watch if available
    if ('geolocation' in navigator) {
      try {
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy, speed } = pos.coords;
            setGpsAccuracy(accuracy);
            setGpsError(null);

            if (speed !== null && speed >= 0) {
              setCurrentSpeedKmH(Number((speed * 3.6).toFixed(1)));
            }

            // Calculate distance if there was a previous coordinate
            if (lastCoordRef.current) {
              const deltaKm = getHaversineDistanceKm(
                lastCoordRef.current.lat,
                lastCoordRef.current.lng,
                latitude,
                longitude
              );

              // Filter GPS jitter (< 4 meters or > 200m in 1 tick)
              if (deltaKm > 0.004 && deltaKm < 0.2) {
                setDistanceKm((prev) => Number((prev + deltaKm).toFixed(2)));
              }
            }

            lastCoordRef.current = { lat: latitude, lng: longitude };
            coordinatesRef.current.push({
              lat: latitude,
              lng: longitude,
              timestamp: Date.now(),
            });
            drawCanvasRoute();
          },
          (err) => {
            console.warn('Geolocation error:', err.message);
            setGpsError('GPS 수신 대기 중 (실내에서는 아래 시뮬레이션 버튼으로 테스트 가능합니다)');
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000,
          }
        );
        watchIdRef.current = id;
      } catch (err) {
        console.warn('Geolocation exception:', err);
      }
    } else {
      setGpsError('이 브라우저는 위치 정보(GPS)를 지원하지 않아 시뮬레이션 모드로 측정됩니다.');
    }
  };

  // Pause workout
  const handlePauseWorkout = () => {
    setTrackingState('paused');
    stopTimer();
    stopSimulation();
  };

  // Resume workout
  const handleResumeWorkout = () => {
    setTrackingState('running');
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Add simulated distance (for desktop/indoor testing)
  const addSimulatedDistance = (deltaKm: number) => {
    if (trackingState === 'idle') {
      handleStartWorkout();
    }
    setDistanceKm((prev) => Number((prev + deltaKm).toFixed(2)));
    setElapsedSeconds((prev) => prev + Math.round(deltaKm * (activityType === 'cycling' ? 180 : 360)));
    setCurrentSpeedKmH(activityType === 'cycling' ? 21.5 : 10.2);

    // Simulate route coordinates around Keimyung Univ track / campus
    const baseLat = 35.8558;
    const baseLng = 128.4875;
    const angle = coordinatesRef.current.length * 0.3;
    const simulatedLat = baseLat + (Math.sin(angle) * 0.003 * (coordinatesRef.current.length + 1)) / 10;
    const simulatedLng = baseLng + (Math.cos(angle) * 0.003 * (coordinatesRef.current.length + 1)) / 10;

    coordinatesRef.current.push({
      lat: simulatedLat,
      lng: simulatedLng,
      timestamp: Date.now(),
    });
    drawCanvasRoute();
  };

  // Toggle continuous simulation
  const toggleContinuousSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      if (trackingState !== 'running') {
        handleStartWorkout();
      }
      setIsSimulating(true);
      const interval = window.setInterval(() => {
        const stepKm = activityType === 'cycling' ? 0.03 : 0.015;
        setDistanceKm((prev) => Number((prev + stepKm).toFixed(2)));
        setCurrentSpeedKmH(activityType === 'cycling' ? 22.4 : 10.8);

        const baseLat = 35.8558;
        const baseLng = 128.4875;
        const count = coordinatesRef.current.length;
        const angle = count * 0.25;
        const radius = 0.0015;
        const simulatedLat = baseLat + Math.sin(angle) * radius;
        const simulatedLng = baseLng + Math.cos(angle) * radius;

        coordinatesRef.current.push({
          lat: simulatedLat,
          lng: simulatedLng,
          timestamp: Date.now(),
        });
        drawCanvasRoute();
      }, 1000);
      simIntervalRef.current = interval;
    }
  };

  // Draw simple stylish GPS track path on canvas
  const drawCanvasRoute = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.clearRect(0, 0, width, height);

    // Grid lines for sporty feel
    ctx.strokeStyle = '#F1F0FB';
    ctx.lineWidth = 1;
    for (let x = 20; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const coords = coordinatesRef.current;
    if (coords.length < 2) {
      // Just draw center pulsing pin
      ctx.fillStyle = '#6C5CE7';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#DDD6FE';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 14, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    // Find min/max
    let minLat = coords[0].lat;
    let maxLat = coords[0].lat;
    let minLng = coords[0].lng;
    let maxLng = coords[0].lng;

    coords.forEach((c) => {
      if (c.lat < minLat) minLat = c.lat;
      if (c.lat > maxLat) maxLat = c.lat;
      if (c.lng < minLng) minLng = c.lng;
      if (c.lng > maxLng) maxLng = c.lng;
    });

    const padding = 35;
    const latSpan = maxLat - minLat || 0.001;
    const lngSpan = maxLng - minLng || 0.001;

    const mapX = (lng: number) => padding + ((lng - minLng) / lngSpan) * (width - padding * 2);
    const mapY = (lat: number) => height - (padding + ((lat - minLat) / latSpan) * (height - padding * 2));

    // Draw route path
    ctx.beginPath();
    ctx.strokeStyle = activityType === 'cycling' ? '#059669' : '#6C5CE7';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    coords.forEach((c, idx) => {
      const x = mapX(c.lng);
      const y = mapY(c.lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Start point
    const startX = mapX(coords[0].lng);
    const startY = mapY(coords[0].lat);
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Current point
    const curr = coords[coords.length - 1];
    const currX = mapX(curr.lng);
    const currY = mapY(curr.lat);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(currX, currY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Complete and record workout
  const handleFinishWorkout = () => {
    stopGpsWatch();
    stopTimer();
    stopSimulation();

    // Fallback if distance is 0 but test run was clicked
    const finalDist = distanceKm > 0 ? distanceKm : 0.8;
    const finalSeconds = elapsedSeconds > 0 ? elapsedSeconds : 300;

    // Calculations
    const carbonKg = calculateCarbonSavedKg(activityType, finalDist);
    const earnedPoints = calculateEcoPoints(finalDist, isMateEnabled && Boolean(partnerMateName.trim()));

    // Pace calculation (min/km)
    const paceSecondsPerKm = finalDist > 0 ? Math.round(finalSeconds / finalDist) : 360;
    const paceMinutes = Math.floor(paceSecondsPerKm / 60);
    const paceRemSeconds = paceSecondsPerKm % 60;
    const paceStr = `${paceMinutes}'${paceRemSeconds.toString().padStart(2, '0')}"`;

    // Speed km/h
    const speedKmH = finalSeconds > 0 ? Number(((finalDist / (finalSeconds / 3600))).toFixed(1)) : 10.0;

    // Calories: approx 65 kcal per km for running, 35 kcal per km for cycling
    const calPerKm = activityType === 'cycling' ? 38 : activityType === 'walking' ? 45 : 68;
    const calories = Math.round(finalDist * calPerKm);

    const titlePrefix =
      activityType === 'cycling' ? '계명대 에코 라이딩' : activityType === 'walking' ? '캠퍼스 에코 워킹' : '계명대 캠퍼스 러닝';

    const activityData: Omit<WorkoutActivity, 'id' | 'createdAt'> = {
      type: activityType,
      title: `${titlePrefix} (${finalDist}km)`,
      distanceKm: finalDist,
      durationSeconds: finalSeconds,
      averagePace: paceStr,
      averageSpeedKmH: speedKmH,
      carbonSavedKg: carbonKg,
      ecoPointsEarned: earnedPoints,
      caloriesBurned: calories,
      partnerMateName: isMateEnabled && partnerMateName.trim() ? partnerMateName.trim() : undefined,
      partnerPostId: initialMatePostId || undefined,
      routeCoordinates: coordinatesRef.current,
    };

    const { activity, newProfile } = recordWorkoutActivity(activityData);
    setFinishedActivity(activity);
    setTrackingState('finished');
    onWorkoutFinished(activity, newProfile);
  };

  // Format timer
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Computed values
  const currentCarbonKg = calculateCarbonSavedKg(activityType, distanceKm);
  const currentPoints = calculateEcoPoints(distanceKm, isMateEnabled && Boolean(partnerMateName.trim()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-[#FAF9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] text-white flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-gray-900">GPS 실시간 운동 & 탄소 절감</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  LIVE 마일리지
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                GPS로 이동 거리를 측정하여 탄소 절감량과 제휴 포인트를 자동 적립합니다.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopGpsWatch();
              stopTimer();
              stopSimulation();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {trackingState !== 'finished' ? (
            <>
              {/* Activity Selector & Mate Selection (editable before or during) */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={trackingState === 'running'}
                    onClick={() => setActivityType('running')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      activityType === 'running'
                        ? 'border-[#6C5CE7] bg-[#F4F2FF] text-[#6C5CE7] font-black shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    } ${trackingState === 'running' ? 'opacity-70' : ''}`}
                  >
                    <div className="text-xl mb-1">🏃‍♂️</div>
                    <div className="text-xs font-bold">야외 러닝</div>
                    <div className="text-[10px] text-gray-400">100P/km</div>
                  </button>

                  <button
                    type="button"
                    disabled={trackingState === 'running'}
                    onClick={() => setActivityType('cycling')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      activityType === 'cycling'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-black shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    } ${trackingState === 'running' ? 'opacity-70' : ''}`}
                  >
                    <div className="text-xl mb-1">🚴</div>
                    <div className="text-xs font-bold">자전거 라이딩</div>
                    <div className="text-[10px] text-gray-400">탄소 절감 UP</div>
                  </button>

                  <button
                    type="button"
                    disabled={trackingState === 'running'}
                    onClick={() => setActivityType('walking')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      activityType === 'walking'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-black shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    } ${trackingState === 'running' ? 'opacity-70' : ''}`}
                  >
                    <div className="text-xl mb-1">🚶</div>
                    <div className="text-xs font-bold">캠퍼스 워킹</div>
                    <div className="text-[10px] text-gray-400">일상 걷기</div>
                  </button>
                </div>

                {/* Mate Partner Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF8FF] to-white border border-[#E9E4FD] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isMateEnabled}
                        onChange={(e) => setIsMateEnabled(e.target.checked)}
                        className="w-4 h-4 accent-[#6C5CE7] rounded"
                      />
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        계명대 메이트와 동반 운동
                      </span>
                    </label>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500" />
                      마일리지 1.5배 부스트
                    </span>
                  </div>

                  {isMateEnabled && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={partnerMateName}
                        onChange={(e) => setPartnerMateName(e.target.value)}
                        placeholder="함께 운동하는 계명대 학우 이름/학과 입력"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#6C5CE7]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Main Live Dashboard Screen */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 text-white p-5 sm:p-6 shadow-xl border border-gray-800 space-y-4">
                {/* Visual Route Canvas */}
                <div className="relative w-full h-36 bg-gray-950/80 rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>계명대 대운동장/캠퍼스 GPS 트랙</span>
                  </div>
                  {gpsAccuracy && (
                    <div className="absolute top-2.5 right-3 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded-md">
                      정확도 ±{Math.round(gpsAccuracy)}m
                    </div>
                  )}
                </div>

                {/* Primary Stats: Distance & Time */}
                <div className="grid grid-cols-2 gap-4 text-center py-1 border-b border-gray-800">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      DISTANCE (이동 거리)
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                        {distanceKm.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-gray-400">km</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      TIME (운동 시간)
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                      {formatTime(elapsedSeconds)}
                    </div>
                  </div>
                </div>

                {/* Auto-Converted Eco Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  {/* Carbon Saved */}
                  <div className="p-2.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400">
                      <Leaf className="w-3 h-3" />
                      <span>탄소 절감량</span>
                    </div>
                    <div className="text-lg font-black font-mono text-emerald-300">
                      {currentCarbonKg.toFixed(3)}
                    </div>
                    <span className="text-[10px] text-emerald-500">kg CO₂</span>
                  </div>

                  {/* Points Earned */}
                  <div className="p-2.5 rounded-2xl bg-[#6C5CE7]/20 border border-[#6C5CE7]/40 space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>에코 마일리지</span>
                    </div>
                    <div className="text-lg font-black font-mono text-amber-300">
                      +{currentPoints.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-indigo-300">포인트 (P)</span>
                  </div>

                  {/* Speed / Pace */}
                  <div className="p-2.5 rounded-2xl bg-gray-800/60 border border-gray-700/50 space-y-0.5">
                    <div className="text-[10px] font-bold text-gray-300">
                      {activityType === 'cycling' ? '현재 속도' : '평균 속도'}
                    </div>
                    <div className="text-lg font-black font-mono text-white">
                      {currentSpeedKmH > 0 ? currentSpeedKmH.toFixed(1) : (distanceKm > 0 ? (distanceKm / (elapsedSeconds / 3600 || 1)).toFixed(1) : '0.0')}
                    </div>
                    <span className="text-[10px] text-gray-400">km/h</span>
                  </div>
                </div>

                {gpsError && (
                  <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-[11px] text-amber-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>{gpsError}</span>
                  </div>
                )}
              </div>

              {/* Indoor & Desktop Simulation Quick Test Box */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    ⚡ 시뮬레이션 / 실내 테스트 버튼
                  </span>
                  <span className="text-[10px] text-gray-500">
                    실제 야외 GPS 또는 테스트 주행 지원
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => addSimulatedDistance(0.4)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    +400m (트랙 1바퀴)
                  </button>
                  <button
                    type="button"
                    onClick={() => addSimulatedDistance(1.2)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    +1.2km (미션 달성)
                  </button>
                  <button
                    type="button"
                    onClick={() => addSimulatedDistance(3.0)}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    +3.0km (캠퍼스 둘레길)
                  </button>
                  <button
                    type="button"
                    onClick={toggleContinuousSimulation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSimulating
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#6C5CE7] text-white hover:bg-[#5B4BC4]'
                    }`}
                  >
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>{isSimulating ? '실시간 주행 중지' : '실시간 시뮬레이션'}</span>
                  </button>
                </div>
              </div>

              {/* Workout Controls */}
              <div className="pt-2 flex items-center gap-3">
                {trackingState === 'idle' ? (
                  <button
                    type="button"
                    onClick={handleStartWorkout}
                    className="w-full py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6C5CE7]/30 transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>GPS 운동 측정 시작하기</span>
                  </button>
                ) : trackingState === 'running' ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePauseWorkout}
                      className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Pause className="w-5 h-5 fill-white" />
                      <span>일시정지</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishWorkout}
                      className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Square className="w-5 h-5 fill-white" />
                      <span>종료 & 마일리지 적립</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleResumeWorkout}
                      className="flex-1 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>다시 재개</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishWorkout}
                      className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Square className="w-5 h-5 fill-white" />
                      <span>종료 & 마일리지 적립</span>
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Finished Workout Celebration Screen */
            <div className="py-4 space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                🎉
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  친환경 캠퍼스 운동 완주 완료!
                </span>
                <h3 className="text-2xl font-black text-gray-900">
                  탄소 절감 마일리지가 적립되었습니다
                </h3>
                <p className="text-xs text-gray-500">
                  적립된 에코 포인트로 제휴 스포츠 장비, 기프티콘, 단백질 보충제를 바로 교환할 수 있습니다.
                </p>
              </div>

              {finishedActivity && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-[#FAF9FF] border border-[#E9E4FD] text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 font-semibold">총 이동거리</span>
                    <p className="text-base font-black text-gray-900">
                      {finishedActivity.distanceKm} <span className="text-xs font-normal">km</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 font-semibold">운동 시간</span>
                    <p className="text-base font-black text-gray-900">
                      {formatTime(finishedActivity.durationSeconds)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-600 font-semibold">탄소 절감량</span>
                    <p className="text-base font-black text-emerald-600">
                      {finishedActivity.carbonSavedKg} <span className="text-xs font-normal">kg</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#6C5CE7] font-semibold">적립 마일리지</span>
                    <p className="text-base font-black text-[#6C5CE7]">
                      +{finishedActivity.ecoPointsEarned.toLocaleString()} <span className="text-xs font-normal">P</span>
                    </p>
                  </div>
                </div>
              )}

              {finishedActivity?.partnerMateName && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    <strong>{finishedActivity.partnerMateName}</strong> 메이트와 동반 운동하여 1.5배 보너스가 적용되었습니다!
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShop();
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5E4EE0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#6C5CE7]/25 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>적립 포인트로 기프티콘·장비 사러가기</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingState('idle');
                    setDistanceKm(0);
                    setElapsedSeconds(0);
                    setFinishedActivity(null);
                    coordinatesRef.current = [];
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  한 번 더 측정하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
