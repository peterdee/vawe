import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeLoop } from '@/store/features/playlistSettings';


function PlaylistSettings(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );

  return (
    <div className="f mt-1 mh-1">
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
