import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import shuffleArray from '@/utilities/shuffle-array';
import * as types from 'types';

export interface TracklistState {
  currentTrack: types.ParsedFile | null;
  currentTrackObjectURL: string;
  queue: string[];
  selectedTrackId: string;
  tracks: types.ParsedFile[];
}

const initialState: TracklistState = {
  currentTrack: null,
  currentTrackObjectURL: '',
  queue: [],
  selectedTrackId: '',
  tracks: [],
};

export const tracklistSlice = createSlice({
  initialState,
  name: 'tracklist',
  reducers: {
    addTrack: (state, action: PayloadAction<types.ParsedFile>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    addTrackMetadata: (
      state,
      action: PayloadAction<{ id: string, metadata: types.Metadata | null }>,
    ) => {
      state.tracks = state.tracks.map((track: types.ParsedFile): types.ParsedFile => {
        if (track.id === action.payload.id) {
          track.metadata = action.payload.metadata;
        }
        return track;
      });
    },
    changeCurrentTrack: (state, action: PayloadAction<string>) => {
      const [track] = state.tracks.filter(
        (item: types.ParsedFile): boolean => item.id === action.payload,
      );
      state.currentTrack = track;
    },
    changeCurrentTrackObjectURL: (state, action: PayloadAction<string>) => {
      if (state.currentTrackObjectURL) {
        URL.revokeObjectURL(state.currentTrackObjectURL);
      }
      state.currentTrackObjectURL = action.payload;
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
      state.queue = [];
      state.selectedTrackId = '';
      state.tracks = [];
    },
    loadDefaultPlaylist: (state, action: PayloadAction<types.ParsedFile[]>) => {
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
      state.selectedTrackId = '';
      state.tracks = state.tracks.filter(
        (track: types.ParsedFile): boolean => track.id !== action.payload,
      );
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
  changeSelectedTrackId,
  changeSelectedTrackIdWithKeys,
  clearTracklist,
  loadDefaultPlaylist,
  removeIdFromQueue,
  removeTrack,
  shuffleTracklist,
  toggleQueueTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
