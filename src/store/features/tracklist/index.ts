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
      const trackIds = state.tracks.map((track: types.ParsedFile): string => track.id);
      const shuffledIds = shuffleArray(trackIds);
      const shuffledTracks = new Array(shuffledIds.length);
      shuffledIds.forEach((id: string) => {
        shuffledTracks.push(
          state.tracks.filter((track: types.ParsedFile): boolean => track.id === id)[0],
        );
      });
      state.tracks = shuffledTracks;
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
  clearTracklist,
  removeTrack,
  shuffleTracklist,
  toggleQueueTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
