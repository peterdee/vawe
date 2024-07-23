import React from 'react';
import { useSelector } from 'react-redux';

import { COLORS, UNIT } from '@/constants';
import formatDuration from '@/utilities/format-duration';
import IconLoop from '@/components/IconLoop';
import type { RootState } from '@/store';
import type * as types from 'types';

function BottomPanel(): React.JSX.Element {
  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const totalPlaytime = tracks.reduce(
    (value: number, track: types.Track): number => value + track.durationSeconds,
    0,
  );

  return (
    <div className="f j-space-between ai-center ph-1 mb-1 ns bottom-panel">
      <div>
        { `Total playtime: ${formatDuration(totalPlaytime)}` }
      </div>
      <div>
        <IconLoop
          iconColorBase={isLooped ? COLORS.accent : COLORS.muted}
          height={UNIT * 1.5}
          title={`Playlist loop ${isLooped ? 'enabled' : 'disabled'}`}
          width={UNIT * 1.5}
        />
      </div>
    </div>
  )
}

export default React.memo(BottomPanel);
