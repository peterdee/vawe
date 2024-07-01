import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import * as types from 'types';
import formatDuration from '@/utilities/format-duration';

function BottomPanel(): React.JSX.Element {
  const tracks = useSelector<RootState, types.ParsedFile[]>(
    (state) => state.tracklist.tracks,
  );

  const totalPlaytime = tracks.reduce(
    (value: number, track: types.ParsedFile): number => {
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
