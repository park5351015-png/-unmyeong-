import {
  WorkoutActivity,
  EcoMission,
  RedeemedVoucher,
  UserEcoProfile,
  EcoRewardItem,
} from '../types';
import {
  INITIAL_ECO_MISSIONS,
  CARBON_SAVINGS_PER_KM,
  BASE_POINTS_PER_KM,
  MATE_BOOST_MULTIPLIER,
} from '../data/ecoRewards';

const ECO_PROFILE_KEY = 'unmyeong_eco_profile_v1';
const ECO_MISSIONS_KEY = 'unmyeong_eco_missions_v1';

// Initial profile with a friendly welcome bonus so users can test immediately
const DEFAULT_PROFILE: UserEcoProfile = {
  points: 6200, // Initial welcome bonus + campus eco incentive
  totalDistanceKm: 14.2,
  totalCarbonSavedKg: 2.45,
  completedWorkoutsCount: 4,
  workoutHistory: [
    {
      id: 'past_act_1',
      type: 'running',
      title: '계명대 대운동장 저녁 러닝',
      distanceKm: 3.2,
      durationSeconds: 1140, // 19 min
      averagePace: "5'56\"",
      averageSpeedKmH: 10.1,
      carbonSavedKg: 0.54,
      ecoPointsEarned: 480,
      caloriesBurned: 220,
      partnerMateName: '이준혁 (스포츠마케팅학과)',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'past_act_2',
      type: 'cycling',
      title: '강창교-금호강 자전거길 라이딩',
      distanceKm: 7.5,
      durationSeconds: 1350,
      averagePace: "3'00\"",
      averageSpeedKmH: 20.0,
      carbonSavedKg: 1.44,
      ecoPointsEarned: 1125,
      caloriesBurned: 310,
      partnerMateName: '김민지 (컴퓨터공학과)',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ],
  redeemedVouchers: [
    {
      id: 'vch_sample_1',
      rewardId: 'reward_compose_americano',
      itemName: '컴포즈커피 아이스 아메리카노',
      brand: '컴포즈커피',
      pointsSpent: 1500,
      barcode: '9845 2381 9012 3341',
      pinCode: 'CPZ-8821-KMU',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80',
      redeemedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      isUsed: false,
    },
  ],
};

export const getEcoProfile = (): UserEcoProfile => {
  try {
    const raw = localStorage.getItem(ECO_PROFILE_KEY);
    if (!raw) {
      saveEcoProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse eco profile', e);
    return DEFAULT_PROFILE;
  }
};

export const saveEcoProfile = (profile: UserEcoProfile): void => {
  try {
    localStorage.setItem(ECO_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save eco profile', e);
  }
};

export const getEcoMissions = (): EcoMission[] => {
  try {
    const raw = localStorage.getItem(ECO_MISSIONS_KEY);
    if (!raw) {
      // Seed with initial missions and link to profile distance
      const profile = getEcoProfile();
      const seeded = INITIAL_ECO_MISSIONS.map((m) => {
        let current = 0;
        if (m.targetType === 'running') current = Math.min(m.targetValue, 1.2);
        if (m.targetType === 'cycling') current = Math.min(m.targetValue, 5.0);
        if (m.targetType === 'mate') current = 1;
        if (m.targetType === 'carbon') current = Math.min(m.targetValue, profile.totalCarbonSavedKg);
        if (m.targetType === 'distance') current = Math.min(m.targetValue, 3.0);

        const isCompleted = current >= m.targetValue;
        return {
          ...m,
          currentValue: current,
          isCompleted,
        };
      });
      saveEcoMissions(seeded);
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get eco missions', e);
    return INITIAL_ECO_MISSIONS;
  }
};

export const saveEcoMissions = (missions: EcoMission[]): void => {
  try {
    localStorage.setItem(ECO_MISSIONS_KEY, JSON.stringify(missions));
  } catch (e) {
    console.error('Failed to save eco missions', e);
  }
};

// Calculate carbon saved
export const calculateCarbonSavedKg = (
  type: 'running' | 'cycling' | 'walking',
  distanceKm: number
): number => {
  const factor = CARBON_SAVINGS_PER_KM[type] || 0.168;
  return Number((distanceKm * factor).toFixed(3));
};

// Calculate eco points earned
export const calculateEcoPoints = (
  distanceKm: number,
  hasPartnerMate: boolean
): number => {
  const base = Math.round(distanceKm * BASE_POINTS_PER_KM);
  return hasPartnerMate ? Math.round(base * MATE_BOOST_MULTIPLIER) : base;
};

// Record finished workout activity
export const recordWorkoutActivity = (
  activity: Omit<WorkoutActivity, 'id' | 'createdAt'>
): { activity: WorkoutActivity; newProfile: UserEcoProfile } => {
  const profile = getEcoProfile();
  const missions = getEcoMissions();

  const newActivity: WorkoutActivity = {
    ...activity,
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const updatedProfile: UserEcoProfile = {
    ...profile,
    points: profile.points + activity.ecoPointsEarned,
    totalDistanceKm: Number((profile.totalDistanceKm + activity.distanceKm).toFixed(2)),
    totalCarbonSavedKg: Number((profile.totalCarbonSavedKg + activity.carbonSavedKg).toFixed(3)),
    completedWorkoutsCount: profile.completedWorkoutsCount + 1,
    workoutHistory: [newActivity, ...profile.workoutHistory],
  };

  saveEcoProfile(updatedProfile);

  // Update missions
  const updatedMissions = missions.map((m) => {
    let addValue = 0;
    if (m.targetType === activity.type) addValue = activity.distanceKm;
    else if (m.targetType === 'distance') addValue = activity.distanceKm;
    else if (m.targetType === 'carbon') addValue = activity.carbonSavedKg;
    else if (m.targetType === 'mate' && activity.partnerMateName) addValue = 1;

    const nextCurrent = Number(Math.min(m.targetValue, m.currentValue + addValue).toFixed(2));
    const isCompleted = nextCurrent >= m.targetValue;
    return {
      ...m,
      currentValue: nextCurrent,
      isCompleted,
    };
  });

  saveEcoMissions(updatedMissions);

  return { activity: newActivity, newProfile: updatedProfile };
};

// Claim a mission reward
export const claimMissionReward = (
  missionId: string
): { success: boolean; pointsAdded: number; newProfile: UserEcoProfile } => {
  const profile = getEcoProfile();
  const missions = getEcoMissions();

  const mission = missions.find((m) => m.id === missionId);
  if (!mission || !mission.isCompleted || mission.isClaimed) {
    return { success: false, pointsAdded: 0, newProfile: profile };
  }

  const updatedMissions = missions.map((m) =>
    m.id === missionId ? { ...m, isClaimed: true } : m
  );
  saveEcoMissions(updatedMissions);

  const updatedProfile: UserEcoProfile = {
    ...profile,
    points: profile.points + mission.rewardPoints,
  };
  saveEcoProfile(updatedProfile);

  return {
    success: true,
    pointsAdded: mission.rewardPoints,
    newProfile: updatedProfile,
  };
};

// Purchase / Redeem reward item using eco points
export const redeemEcoReward = (
  reward: EcoRewardItem
): { success: boolean; error?: string; voucher?: RedeemedVoucher; newProfile: UserEcoProfile } => {
  const profile = getEcoProfile();

  if (profile.points < reward.pointsCost) {
    return {
      success: false,
      error: `포인트가 부족합니다. (현재: ${profile.points.toLocaleString()} P / 필요: ${reward.pointsCost.toLocaleString()} P)`,
      newProfile: profile,
    };
  }

  const randomBarcode = Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000).toString()
  ).join(' ');

  const randomPin = `${reward.brand.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-KMU`;

  const now = new Date();
  const expires = new Date(now.getTime() + 86400000 * 60); // 60 days validity

  const voucher: RedeemedVoucher = {
    id: `vch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    rewardId: reward.id,
    itemName: reward.name,
    brand: reward.brand,
    pointsSpent: reward.pointsCost,
    barcode: randomBarcode,
    pinCode: randomPin,
    imageUrl: reward.imageUrl,
    redeemedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    isUsed: false,
  };

  const updatedProfile: UserEcoProfile = {
    ...profile,
    points: profile.points - reward.pointsCost,
    redeemedVouchers: [voucher, ...profile.redeemedVouchers],
  };

  saveEcoProfile(updatedProfile);

  return {
    success: true,
    voucher,
    newProfile: updatedProfile,
  };
};
