import { UserProfile, DailyMetrics, MealEntry, DailyLog } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'vibe_users';
const CURRENT_USER_KEY = 'vibe_current_user';
const OTP_KEY = 'vibe_temp_otp';

// Simulate DB operations
export const db = {
  getUsers: (): Record<string, any> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  },

  saveUser: (email: string, data: any) => {
    const users = db.getUsers();
    users[email] = { ...users[email], ...data };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): UserProfile | null => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    const users = db.getUsers();
    return users[email]?.profile || null;
  },

  login: (email: string, pass: string): boolean => {
    const users = db.getUsers();
    if (users[email] && users[email].password === pass) {
      localStorage.setItem(CURRENT_USER_KEY, email);
      return true;
    }
    return false;
  },

  register: (email: string, pass: string) => {
    const users = db.getUsers();
    if (users[email]) throw new Error("User already exists");
    
    // Generate Random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(OTP_KEY, JSON.stringify({ email, pass, otp, timestamp: Date.now() }));
    return otp; 
  },

  verifyOTP: (inputOtp: string): boolean => {
    const raw = localStorage.getItem(OTP_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    
    if (data.otp === inputOtp) {
      db.saveUser(data.email, { password: data.pass, profile: {} });
      localStorage.removeItem(OTP_KEY);
      localStorage.setItem(CURRENT_USER_KEY, data.email);
      return true;
    }
    return false;
  },

  saveProfile: (profile: UserProfile) => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (email) {
      db.saveUser(email, { profile });
    }
  },

  getMetrics: (date: string): DailyMetrics | null => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return null;
    const users = db.getUsers();
    return users[email]?.metrics?.[date] || null;
  },

  saveMetrics: (date: string, metrics: DailyMetrics) => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (email) {
      const users = db.getUsers();
      const user = users[email];
      if (!user.metrics) user.metrics = {};
      user.metrics[date] = metrics;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  saveMeal: (date: string, meal: MealEntry) => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if(email) {
        const users = db.getUsers();
        const user = users[email];
        if(!user.meals) user.meals = {};
        if(!user.meals[date]) user.meals[date] = [];
        user.meals[date].push(meal);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  getMeals: (date: string): MealEntry[] => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (!email) return [];
    const users = db.getUsers();
    return users[email]?.meals?.[date] || [];
  },

  // Generic Daily Logs (Audio, Sleep, Stress, Diagnostics)
  saveLog: (date: string, key: keyof DailyLog, data: any) => {
    const email = localStorage.getItem(CURRENT_USER_KEY);
    if (email) {
        const users = db.getUsers();
        const user = users[email];
        if (!user.logs) user.logs = {};
        if (!user.logs[date]) user.logs[date] = {};
        user.logs[date][key] = data;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  getLogs: (date: string): DailyLog => {
      const email = localStorage.getItem(CURRENT_USER_KEY);
      if (!email) return {};
      const users = db.getUsers();
      return users[email]?.logs?.[date] || {};
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};