import { configureStore } from '@reduxjs/toolkit';

import playback from './features/playback';
import playlist from './features/playlist';

export const store = configureStore({
  reducer: {
    playback,
    playlist,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
