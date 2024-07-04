import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import shuffleArray from '@/utilities/shuffle-array';
import type * as types from 'types';

export interface TracklistState {
  currentTrack: types.Track | null;
  currentTrackObjectURL: string;
  isPlaying: boolean;
  queue: string[];
  metadata: types.TrackMetadata[];
  selectedTrackId: string;
  tracks: types.Track[];
}

const initialState: TracklistState = {
  currentTrack: null,
  currentTrackObjectURL: '',
  isPlaying: false,
  metadata: [],
  queue: [],
  selectedTrackId: '',
  tracks: [],
};

export const tracklistSlice = createSlice({
  initialState,
  name: 'tracklist',
  reducers: {
    addTrack: (state, action: PayloadAction<types.Track>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    addTrackMetadata: (
      state,
      action: PayloadAction<types.TrackMetadata>,
    ) => {
      const { id, metadata } = action.payload;
      if (state.metadata.length === 0) {
        state.metadata = [{ id, metadata }];
      } else {
        const ids = state.metadata.map((entry: types.TrackMetadata): string => entry.id);
        if (!ids.includes(id)) {
          state.metadata = [
            ...state.metadata,
            {
              id,
              metadata,
            },
          ];
        }
      }
    },
    changeCurrentTrack: (state, action: PayloadAction<string>) => {
      const [track] = state.tracks.filter(
        (item: types.Track): boolean => item.id === action.payload,
      );
      state.currentTrack = track;
    },
    changeCurrentTrackObjectURL: (state, action: PayloadAction<string>) => {
      if (state.currentTrackObjectURL) {
        URL.revokeObjectURL(state.currentTrackObjectURL);
      }
      state.currentTrackObjectURL = action.payload;
    },
    changeIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    changeSelectedTrackId: (state, action: PayloadAction<string>) => {
      state.selectedTrackId = action.payload;
    },
    changeSelectedTrackIdWithKeys: (state, action: PayloadAction<string>) => {
      const { selectedTrackId } = state;
      if (!selectedTrackId) {
        state.selectedTrackId = action.payload === 'arrowup'
          ? state.tracks[state.tracks.length - 1].id
          : state.selectedTrackId = state.tracks[0].id;
      } else {
        let nextTrackIndex = 0;
        for (let i = 0; i < state.tracks.length; i += 1) {
          if (state.tracks[i].id === selectedTrackId) {
            nextTrackIndex = i;
            break;
          }
        }
        nextTrackIndex = action.payload === 'arrowup'
          ? nextTrackIndex - 1
          : nextTrackIndex + 1;
        if (!state.tracks[nextTrackIndex] && action.payload === 'arrowdown') {
          nextTrackIndex = 0;
        }
        if (nextTrackIndex < 0 && action.payload === 'arrowup') {
          nextTrackIndex = state.tracks.length - 1;
        }
        state.selectedTrackId = state.tracks[nextTrackIndex].id;
      }
    },
    clearTracklist: (state) => {
      if (state.currentTrackObjectURL) {
        URL.revokeObjectURL(state.currentTrackObjectURL);
      }
      state.currentTrack = initialState.currentTrack;
      state.currentTrackObjectURL = '';
      state.metadata = [];
      state.queue = [];
      state.selectedTrackId = '';
      state.tracks = [];
    },
    loadPlaylist: (state, action: PayloadAction<types.Track[]>) => {
      state.tracks = action.payload;
    },
    removeIdFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((id: string): boolean => id !== action.payload);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      if (state.currentTrack && state.currentTrack.id === action.payload) {
        state.currentTrack = null;
        if (state.currentTrackObjectURL) {
          URL.revokeObjectURL(state.currentTrackObjectURL);
        }
        state.currentTrackObjectURL = '';
      }
      state.queue = state.queue.filter(
        (id: string): boolean => id !== action.payload, 
      );
      const selectedTrackIdIndex = state
        .tracks
        .map((track: types.Track): string => track.id)
        .indexOf(action.payload);
      state.metadata = state.metadata.filter(
        (entry: types.TrackMetadata): boolean => entry.id !== action.payload,
      );
      state.tracks = state.tracks.filter(
        (track: types.Track): boolean => track.id !== action.payload,
      );
      if (state.tracks.length >= 1) {
        state.selectedTrackId = selectedTrackIdIndex <= state.tracks.length - 1
          ? state.tracks[selectedTrackIdIndex].id
          : state.tracks[selectedTrackIdIndex - 1].id;
      } else {
        state.selectedTrackId = '';
      }
    },
    shuffleTracklist: (state) => {
      state.tracks = shuffleArray(state.tracks);
    },
    toggleQueueTrack: (state, action: PayloadAction<string>) => {
      if (!state.queue) {
        state.queue = [];
      }
      if (state.queue.includes(action.payload)) {
        state.queue = state.queue.filter((id: string): boolean => id !== action.payload);
      } else {
        state.queue = [
          ...state.queue,
          action.payload,
        ];
      }
    },
  },
});

export const {
  addTrack,
  addTrackMetadata,
  changeCurrentTrack,
  changeCurrentTrackObjectURL,
  changeIsPlaying,
  changeSelectedTrackId,
  changeSelectedTrackIdWithKeys,
  clearTracklist,
  loadPlaylist,
  removeIdFromQueue,
  removeTrack,
  shuffleTracklist,
  toggleQueueTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
