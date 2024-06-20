import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';

import { ENABLE_REDUX_DEVTOOLS } from '@/configuration';
import playbackSettings from './features/playbackSettings';
import playlistSettings from './features/playlistSettings';
import tracklist from './features/tracklist';
import volumeSettings from './features/volumeSettings';

const rootReducer = combineReducers({
  playbackSettings,
  playlistSettings,
  tracklist: persistReducer(
    {
      key: 'tracklist',
      storage: storageSession,
    },
    tracklist,
  ),
  volumeSettings,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
  },
  rootReducer,
);

export const store = configureStore({
  devTools: ENABLE_REDUX_DEVTOOLS,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        REHYDRATE,
      ],
    },
  }),
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
