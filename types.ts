
export enum AppState {
  PERMISSIONS = 'PERMISSIONS',
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_VERIFY = 'AUTH_VERIFY',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MEAL_ANALYSIS = 'MEAL_ANALYSIS',
  AUDIO_ANALYSIS = 'AUDIO_ANALYSIS',
  SLEEP_ANALYSIS = 'SLEEP_ANALYSIS',
  STRESS_ANALYSIS = 'STRESS_ANALYSIS',
  DIAGNOSTICS = 'DIAGNOSTICS',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  CHAT = 'CHAT',
}

export interface UserProfile {
  email?: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  sleepHours: string;
  activityLevel: string;
  dietaryPref: string;
  medicalHistory: string;
  goals: string;
}

export interface DailyMetrics {
  date: string;
  vibeScore: number;
  nutritionScore: number;
  stressScore: number;
  sleepScore: number;
  postureScore: number;
  activityScore: number;
  biologicalAge: number;
  chronologicalAge: number;
  stressLevelTag: string;
  restingHR: number;
  hrv: number;
  energyLevel: number;
  hydrationLevel: number;
  suggestions: string[];
  mealQualitySummary: string;
  activitySummary: string;
  sleepSummary: string;
  dailyHabits: string[];
}

export interface MealEntry {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  description: string;
  timestamp: number;
  analysis: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  score: number;
}

export interface DailyLog {
  audioAnalysis?: string;
  sleepData?: { hours: number; quality: string; time: string };
  stressData?: { level: number; note: string };
  diagnosticResult?: { type: string; result: string };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}
