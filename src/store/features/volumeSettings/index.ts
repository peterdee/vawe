import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface VolumeSettingsState {
  isMuted: boolean;
  volume: number;
}

const initialState: VolumeSettingsState = {
  isMuted: false,
  volume: 0.5,
};

export const volumeSettingsSlice = createSlice({
  initialState,
  name: 'volumeSettings',
  reducers: {
    changeMute: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    changeVolume: (state, action: PayloadAction<number>) => {
      if (state.isMuted) {
        state.isMuted = false;
      }
      state.volume = action.payload;
    },
  },
});

export const {
  changeMute,
  changeVolume,
} = volumeSettingsSlice.actions;

export default volumeSettingsSlice.reducer;
