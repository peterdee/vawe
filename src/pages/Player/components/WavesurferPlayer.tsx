import React, { useEffect, useState } from 'react';
import Player from '@wavesurfer/react';
import { useSelector } from 'react-redux';

import formatDuration from '@/utilities/format-duration';
import type { RootState } from '@/store';
import * as types from 'types';

interface WavesurferPlayerProps {
  onFinish: (instance: types.WaveSurferInstance) => void;
  onReady: (instance: types.WaveSurferInstance) => void;
}

function WavesurferPlayer(props: WavesurferPlayerProps): React.JSX.Element {
  const {
    onFinish,
    onReady,
  } = props;

  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const currentTrack = useSelector<RootState, types.ParsedFile | null>(
    (state) => state.tracklist.currentTrack,
  );
  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );

  const onTime = (wavesurfer: types.WaveSurferInstance) => {
    if (wavesurfer) {
      setElapsedTime(wavesurfer.getCurrentTime());
    }
  };

  useEffect(
    () => {
      setElapsedTime(0);
    },
    [currentTrackObjectURL],
  );

  return (
    <div className="f d-col m-1">
      <div>
        <Player
          cursorColor="black"
          cursorWidth={2}
          height={100}
          onReady={onReady}
          onFinish={onFinish}
          onTimeupdate={onTime}
          progressColor="darkgreen"
          url={currentTrackObjectURL}
          waveColor="lightgreen"
        />
      </div>
      <div className="f j-space-between mt-quarter ai-center ns playtime">
        { currentTrackObjectURL && (
          <>
            <div>
              { formatDuration(elapsedTime) }
            </div>
            <div>
              {
                currentTrack && currentTrackObjectURL
                  ? formatDuration(currentTrack.durationSeconds)
                  : '00:00'
              }
            </div>
          </>
        ) }
      </div>
    </div>
  );
}

export default React.memo(WavesurferPlayer);
