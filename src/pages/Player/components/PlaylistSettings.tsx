import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeLoop } from '@/store/features/playlistSettings';
import { clearTracklist, shuffleTracklist } from '@/store/features/tracklist';
import type * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function PlaylistSettings(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const handleOpenPlaylist = () => {
    extendedWindow.backend.openPlaylistRequest();
  };

  const handleSavePlaylist = () => {
    extendedWindow.backend.savePlaylistRequest(tracks);
  };

  return (
    <div className="f mt-1 mh-1">
      <button
        className="button"
        onClick={() => dispatch(clearTracklist())}
        type="button"
      >
        Clear playlist
      </button>
      <button
        className="button ml-1"
        onClick={() => dispatch(shuffleTracklist())}
        type="button"
      >
        Shuffle playlist
      </button>
      <button
        className="button ml-1"
        onClick={handleOpenPlaylist}
        type="button"
      >
        Open playlist
      </button>
      <button
        className="button ml-1"
        onClick={handleSavePlaylist}
        type="button"
      >
        Save playlist
      </button>
      <button
        className="button ml-1"
        onClick={() => dispatch(changeLoop(!isLooped))}
        type="button"
      >
        { isLooped ? 'Disable playlist loop' : 'Enable playlist loop' }
      </button>
    </div>
  );
}

export default React.memo(PlaylistSettings);
