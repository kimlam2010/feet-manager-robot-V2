import { configureStore } from '@reduxjs/toolkit';
import { robotReducer } from './slices/robotSlice';
import { worksetReducer } from './slices/worksetSlice';
import { authReducer } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    robot: robotReducer,
    workset: worksetReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      // Add any custom middleware here
    ]),
}); 