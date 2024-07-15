import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ModalsState {
  errorModalMessage: string;
  showCoverModal: boolean;
  showErrorModal: boolean;
  showSettingsModal: boolean;
}

const initialState: ModalsState = {
  errorModalMessage: '',
  showCoverModal: false,
  showErrorModal: false,
  showSettingsModal: false,
};

export const modalsSlice = createSlice({
  initialState,
  name: 'modals',
  reducers: {
    changeShowCoverModal: (state, action: PayloadAction<boolean>) => {
      state.showCoverModal = action.payload;
    },
    changeShowErrorModal: (
      state,
      action: PayloadAction<{ message: string; showModal: boolean; }>,
    ) => {
      state.errorModalMessage = action.payload.message;
      state.showErrorModal = action.payload.showModal;
    },
    changeShowSettingsModal: (state, action: PayloadAction<boolean>) => {
      state.showSettingsModal = action.payload;
    },
  },
});

export const {
  changeShowCoverModal,
  changeShowErrorModal,
  changeShowSettingsModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
