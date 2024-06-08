import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ParsedFile} from '@/models';

export interface PlaylistState {
  tracks: ParsedFile[];
}

const initialState: PlaylistState = {
  tracks: [],
};

export const playlistSlice = createSlice({
  initialState,
  name: 'playlist',
  reducers: {
    addTrack: (state, action: PayloadAction<ParsedFile>) => {
      state.tracks = [
        ...state.tracks,
        action.payload,
      ];
    },
    removeTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(
        (track: ParsedFile): boolean => track.id != action.payload,
      );
    },
  },
});

export const {
  addTrack,
  removeTrack,
} = playlistSlice.actions;

export default playlistSlice.reducer;
