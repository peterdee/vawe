import React from 'react';
import Player from '@wavesurfer/react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeCurrentTrackElapsedTime } from '@/store/features/tracklist';
import type * as types from 'types';

interface WavesurferPlayerProps {
  onFinish: (instance: types.WaveSurferInstance) => void;
  onReady: (instance: types.WaveSurferInstance) => void;
}

function WavesurferPlayer(props: WavesurferPlayerProps): React.JSX.Element {
  const {
    onFinish,
    onReady,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );

  const onTime = (wavesurfer: types.WaveSurferInstance) => {
    if (wavesurfer) {
      dispatch(changeCurrentTrackElapsedTime(wavesurfer.getCurrentTime()));
    }
  };

  return (
    <div className="m-1">
      <Player
        cursorColor="black"
        cursorWidth={2}
        height={32}
        onReady={onReady}
        onFinish={onFinish}
        onTimeupdate={onTime}
        progressColor="darkgreen"
        url={currentTrackObjectURL}
        waveColor="lightgreen"
      />
    </div>
  );
}

export default React.memo(WavesurferPlayer);
