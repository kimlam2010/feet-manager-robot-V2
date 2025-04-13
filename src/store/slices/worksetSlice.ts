import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Robot } from './robotSlice';

export interface Workset {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  robots: string[]; // Array of robot IDs
  createdAt: string;
  updatedAt: string;
}

interface WorksetState {
  worksets: Workset[];
  selectedWorkset: Workset | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorksetState = {
  worksets: [],
  selectedWorkset: null,
  isLoading: false,
  error: null,
};

const worksetSlice = createSlice({
  name: 'workset',
  initialState,
  reducers: {
    fetchWorksetsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWorksetsSuccess: (state, action: PayloadAction<Workset[]>) => {
      state.worksets = action.payload;
      state.isLoading = false;
    },
    fetchWorksetsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectWorkset: (state, action: PayloadAction<string>) => {
      state.selectedWorkset = state.worksets.find(workset => workset.id === action.payload) || null;
    },
    createWorkset: (state, action: PayloadAction<Omit<Workset, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newWorkset: Workset = {
        ...action.payload,
        id: Date.now().toString(), // Temporary ID, should be replaced with server-generated ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.worksets.push(newWorkset);
    },
    updateWorkset: (state, action: PayloadAction<{ id: string; updates: Partial<Workset> }>) => {
      const workset = state.worksets.find(w => w.id === action.payload.id);
      if (workset) {
        Object.assign(workset, {
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        });
        if (state.selectedWorkset?.id === action.payload.id) {
          state.selectedWorkset = { ...workset };
        }
      }
    },
    deleteWorkset: (state, action: PayloadAction<string>) => {
      state.worksets = state.worksets.filter(w => w.id !== action.payload);
      if (state.selectedWorkset?.id === action.payload) {
        state.selectedWorkset = null;
      }
    },
    addRobotToWorkset: (state, action: PayloadAction<{ worksetId: string; robotId: string }>) => {
      const workset = state.worksets.find(w => w.id === action.payload.worksetId);
      if (workset && !workset.robots.includes(action.payload.robotId)) {
        workset.robots.push(action.payload.robotId);
        workset.updatedAt = new Date().toISOString();
        if (state.selectedWorkset?.id === action.payload.worksetId) {
          state.selectedWorkset = { ...workset };
        }
      }
    },
    removeRobotFromWorkset: (state, action: PayloadAction<{ worksetId: string; robotId: string }>) => {
      const workset = state.worksets.find(w => w.id === action.payload.worksetId);
      if (workset) {
        workset.robots = workset.robots.filter(id => id !== action.payload.robotId);
        workset.updatedAt = new Date().toISOString();
        if (state.selectedWorkset?.id === action.payload.worksetId) {
          state.selectedWorkset = { ...workset };
        }
      }
    },
  },
});

export const {
  fetchWorksetsStart,
  fetchWorksetsSuccess,
  fetchWorksetsFailure,
  selectWorkset,
  createWorkset,
  updateWorkset,
  deleteWorkset,
  addRobotToWorkset,
  removeRobotFromWorkset,
} = worksetSlice.actions;

export default worksetSlice.reducer; 