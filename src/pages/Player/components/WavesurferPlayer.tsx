import React from 'react';
import Player from '@wavesurfer/react';
import { useSelector } from 'react-redux';

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

  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );

  return (
    <div className="m-1">
      <Player
        cursorColor="black"
        cursorWidth={2}
        height={100}
        onReady={onReady}
        onFinish={onFinish}
        progressColor="darkgreen"
        url={currentTrackObjectURL}
        waveColor="lightgreen"
      />
    </div>
  );
}

export default React.memo(WavesurferPlayer);
