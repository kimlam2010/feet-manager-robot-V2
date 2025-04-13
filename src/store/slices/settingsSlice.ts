import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
}

interface PerformanceSettings {
  enableAnimations: boolean;
  enableRealTimeUpdates: boolean;
  updateInterval: number; // in milliseconds
}

interface SettingsState {
  theme: Theme;
  language: string;
  notifications: NotificationSettings;
  performance: PerformanceSettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: {
    mode: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
  },
  language: 'en',
  notifications: {
    email: true,
    push: true,
    sound: true,
  },
  performance: {
    enableAnimations: true,
    enableRealTimeUpdates: true,
    updateInterval: 5000,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Partial<Theme>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updatePerformanceSettings: (state, action: PayloadAction<Partial<PerformanceSettings>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    resetSettings: (state) => {
      return { ...initialState, language: state.language }; // Preserve language setting
    },
    loadSettingsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadSettingsSuccess: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload, isLoading: false, error: null };
    },
    loadSettingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updatePerformanceSettings,
  resetSettings,
  loadSettingsStart,
  loadSettingsSuccess,
  loadSettingsFailure,
} = settingsSlice.actions;

export default settingsSlice.reducer; 