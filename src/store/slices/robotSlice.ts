import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RobotStatus {
  battery: number;
  isOnline: boolean;
  lastSeen: string;
  currentTask: string | null;
}

export interface Robot {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: RobotStatus;
  worksetId: string | null;
}

interface RobotState {
  robots: Robot[];
  selectedRobot: Robot | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RobotState = {
  robots: [],
  selectedRobot: null,
  isLoading: false,
  error: null,
};

const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    fetchRobotsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRobotsSuccess: (state, action: PayloadAction<Robot[]>) => {
      state.robots = action.payload;
      state.isLoading = false;
    },
    fetchRobotsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectRobot: (state, action: PayloadAction<string>) => {
      state.selectedRobot = state.robots.find(robot => robot.id === action.payload) || null;
    },
    updateRobotStatus: (state, action: PayloadAction<{ robotId: string; status: Partial<RobotStatus> }>) => {
      const robot = state.robots.find(r => r.id === action.payload.robotId);
      if (robot) {
        robot.status = { ...robot.status, ...action.payload.status };
      }
      if (state.selectedRobot?.id === action.payload.robotId) {
        state.selectedRobot = { ...state.selectedRobot, status: { ...state.selectedRobot.status, ...action.payload.status } };
      }
    },
    assignToWorkset: (state, action: PayloadAction<{ robotId: string; worksetId: string }>) => {
      const robot = state.robots.find(r => r.id === action.payload.robotId);
      if (robot) {
        robot.worksetId = action.payload.worksetId;
      }
      if (state.selectedRobot?.id === action.payload.robotId) {
        state.selectedRobot = { ...state.selectedRobot, worksetId: action.payload.worksetId };
      }
    },
  },
});

export const {
  fetchRobotsStart,
  fetchRobotsSuccess,
  fetchRobotsFailure,
  selectRobot,
  updateRobotStatus,
  assignToWorkset,
} = robotSlice.actions;

export default robotSlice.reducer; 