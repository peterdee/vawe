import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ModalsState {
  showCoverModal: boolean;
  showSettingsModal: boolean;
}

const initialState: ModalsState = {
  showCoverModal: false,
  showSettingsModal: false,
};

export const modalsSlice = createSlice({
  initialState,
  name: 'modals',
  reducers: {
    changeShowCoverModal: (state, action: PayloadAction<boolean>) => {
      state.showCoverModal = action.payload;
    },
    changeShowSettingsModal: (state, action: PayloadAction<boolean>) => {
      state.showSettingsModal = action.payload;
    },
  },
});

export const {
  changeShowCoverModal,
  changeShowSettingsModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
