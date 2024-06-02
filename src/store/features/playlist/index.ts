import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PlaylistEntry } from '@/models';

export interface PlaylistState {
  tracks: PlaylistEntry[];
}

const initialState: PlaylistState = {
  tracks: [],
};

export const playlistSlice = createSlice({
  initialState,
  name: 'playlist',
  reducers: {
    addTrack: (state, action: PayloadAction<PlaylistEntry>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(
        (track: PlaylistEntry): boolean => track.id != action.payload,
      );
    },
  },
});

export const {
  addTrack,
  removeTrack,
} = playlistSlice.actions;

export default playlistSlice.reducer;
