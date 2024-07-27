import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { setItem } from '@/utilities/local-storage';
import shuffleArray from '@/utilities/shuffle-array';
import type * as types from 'types';

export interface TracklistState {
  currentTrack: types.Track | null;
  currentTrackElapsedTime: number;
  currentTrackMetadata: types.TrackMetadata | null;
  currentTrackObjectURL: string;
  isPlaying: boolean;
  queue: string[];
  selectedTrackId: string;
  tracks: types.Track[];
}

const initialState: TracklistState = {
  currentTrack: null,
  currentTrackElapsedTime: 0,
  currentTrackMetadata: null,
  currentTrackObjectURL: '',
  isPlaying: false,
  queue: [],
  selectedTrackId: '',
  tracks: [],
};

const extendedWindow = window as types.ExtendedWindow;

function revokeCoverURLs(metadata: types.TrackMetadata) {
  if (Array.isArray(metadata.metadata.covers)) {
    metadata.metadata.covers.forEach((cover: types.CoverData) => {
      if (cover.objectURL) {
        URL.revokeObjectURL(cover.objectURL);
      }
    });
  }
}

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
    changeCurrentTrack: (state, action: PayloadAction<string>) => {
      const [track] = state.tracks.filter(
        (item: types.Track): boolean => item.id === action.payload,
      );
      state.currentTrack = track;
      state.currentTrackElapsedTime = 0;
    },
    changeCurrentTrackElapsedTime: (state, action: PayloadAction<number>) => {
      state.currentTrackElapsedTime = action.payload;
    },
    changeCurrentTrackMetadata: (
      state,
      action: PayloadAction<types.TrackMetadata>,
    ) => {
      if (state.currentTrackMetadata) {
        revokeCoverURLs(state.currentTrackMetadata);
      }
      state.currentTrackMetadata = action.payload;
    },
    changeCurrentTrackObjectURL: (state, action: PayloadAction<string>) => {
      if (state.currentTrackObjectURL) {
        URL.revokeObjectURL(state.currentTrackObjectURL);
      }
      state.currentTrackObjectURL = action.payload;
    },
    changeDetailsMetadata: (
      state,
      action: PayloadAction<{ id: string; metadata: types.CustomAudioMetadata; }>,
    ) => {
      const { id, metadata } = action.payload;
      setItem(
        'trackMetadata',
        {
          ...metadata,
          id,
          path: state.tracks.filter((track: types.Track): boolean => id === track.id)[0].path,
        },
      );
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
    changeTrackNotAccessible: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.map((track: types.Track): types.Track => {
        if (track.id === action.payload) {
          return {
            ...track,
            isAccessible: false,
          };
        }
        return track;
      });
    },
    clearTracklist: (state) => {
      if (state.currentTrackObjectURL) {
        URL.revokeObjectURL(state.currentTrackObjectURL);
      }
      if (state.currentTrackMetadata) {
        revokeCoverURLs(state.currentTrackMetadata);
      }
      state.currentTrack = initialState.currentTrack;
      state.currentTrackElapsedTime = 0;
      state.currentTrackMetadata = initialState.currentTrackMetadata;
      state.currentTrackObjectURL = initialState.currentTrackObjectURL;
      state.queue = initialState.queue;
      state.selectedTrackId = initialState.selectedTrackId;
      state.tracks = initialState.tracks;
    },
    loadPlaylist: (state, action: PayloadAction<types.Track[]>) => {
      state.tracks = action.payload;
    },
    menuSavePlaylist: (state) => {
      extendedWindow.backend.savePlaylistRequest(
        state.tracks.map((draftTrack) => ({ ...draftTrack })),
      );
    },
    removeIdFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((id: string): boolean => id !== action.payload);
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      if (state.currentTrack && state.currentTrack.id === action.payload) {
        state.currentTrack = initialState.currentTrack;
        state.currentTrackElapsedTime = 0;
        if (state.currentTrackObjectURL) {
          URL.revokeObjectURL(state.currentTrackObjectURL);
        }
        if (state.currentTrackMetadata) {
          revokeCoverURLs(state.currentTrackMetadata);
        }
        state.currentTrackMetadata = initialState.currentTrackMetadata;
        state.currentTrackObjectURL = initialState.currentTrackObjectURL;
      }
      state.queue = state.queue.filter(
        (id: string): boolean => id !== action.payload, 
      );
      const selectedTrackIdIndex = state
        .tracks
        .map((track: types.Track): string => track.id)
        .indexOf(action.payload);
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
  changeCurrentTrack,
  changeCurrentTrackElapsedTime,
  changeCurrentTrackMetadata,
  changeCurrentTrackObjectURL,
  changeDetailsMetadata,
  changeIsPlaying,
  changeSelectedTrackId,
  changeSelectedTrackIdWithKeys,
  changeTrackNotAccessible,
  clearTracklist,
  loadPlaylist,
  menuSavePlaylist,
  removeIdFromQueue,
  removeTrack,
  shuffleTracklist,
  toggleQueueTrack,
} = tracklistSlice.actions;

export default tracklistSlice.reducer;
