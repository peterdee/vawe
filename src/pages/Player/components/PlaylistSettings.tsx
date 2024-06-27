import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeLoop, changeShuffle } from '@/store/features/playlistSettings';
import { clearTracklist, shuffleTracklist } from '@/store/features/tracklist';
import type { ExtendedWindow } from 'types';

const extendedWindow = window as ExtendedWindow;

function PlaylistSettings(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
  const isShuffled = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isShuffled,
  );

  return (
    <div className="f">
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
        onClick={extendedWindow.backend.savePlaylistRequest}
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
      <button
        className="button ml-1"
        onClick={() => dispatch(changeShuffle(!isShuffled))}
        type="button"
      >
        { isShuffled ? 'Disable shuffling' : 'Enable shuffling' }
      </button>
    </div>
  );
}

export default React.memo(PlaylistSettings);
