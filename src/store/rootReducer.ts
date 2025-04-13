import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import robotReducer from './slices/robotSlice';
import worksetReducer from './slices/worksetSlice';
import settingsReducer from './slices/settingsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  robot: robotReducer,
  workset: worksetReducer,
  settings: settingsReducer,
}); 