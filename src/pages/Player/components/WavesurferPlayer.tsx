import React from 'react';
import Player from '@wavesurfer/react';

import * as types from 'types';

interface WavesurferPlayerProps {
  objectURL: string;
  onFinish: (instance: types.WaveSurferInstance) => void;
  onReady: (instance: types.WaveSurferInstance) => void;
}

function WavesurferPlayer(props: WavesurferPlayerProps): React.JSX.Element {
  const {
    objectURL = '',
    onFinish,
    onReady,
  } = props;

  return (
    <div className="m-1">
      <Player
        cursorColor="black"
        cursorWidth={2}
        height={100}
        onReady={onReady}
        onFinish={onFinish}
        progressColor="darkgreen"
        url={objectURL}
        waveColor="lightgreen"
      />
    </div>
  );
}

export default React.memo(WavesurferPlayer);
