import React from 'react';
import { useSelector } from 'react-redux';

import formatDuration from '@/utilities/format-duration';
import type { RootState } from '@/store';
import type * as types from 'types';

function BottomPanel(): React.JSX.Element {
  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const totalPlaytime = tracks.reduce(
    (value: number, track: types.Track): number => {
      return value + track.durationSeconds;
    },
    0,
  );

  return (
    <div className="f ph-1 mb-1 ns bottom-panel">
      {`Total playtime: ${formatDuration(totalPlaytime)}`}
    </div>
  )
}

export default React.memo(BottomPanel);
