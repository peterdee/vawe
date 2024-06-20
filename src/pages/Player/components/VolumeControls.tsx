import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeMute, changeVolume } from '@/store/features/volumeSettings';
import * as types from 'types';

interface VolumeControlsProps {
  wavesurfer: types.WaveSurferInstance;
}

function VolumeControls(props: VolumeControlsProps): React.JSX.Element {
  const { wavesurfer } = props;

  const dispatch = useDispatch<AppDispatch>();

  const isMuted = useSelector<RootState, boolean>(
    (state) => state.volumeSettings.isMuted,
  );
  const volume = useSelector<RootState, number>(
    (state) => state.volumeSettings.volume,
  );

  const onChangeMute = () => {
    dispatch(changeMute(!isMuted));
    if (wavesurfer) {
      wavesurfer.setVolume(isMuted ? volume : 0);
    }
  };

  const onChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(changeVolume(value));
    if (wavesurfer) {
      wavesurfer.setVolume(value);
    }
  };

  return (
    <div className="f ai-center">
      <button
        className="button mr-1"
        onClick={onChangeMute}
        type="button"
      >
        { isMuted ? 'Unmute' : 'Mute' }
      </button>
      <input
        className="volume-slider"
        max={1}
        min={0}
        onChange={onChangeVolume}
        step={0.01}
        type="range"
        value={volume}
      />
    </div>
  );
}

export default React.memo(VolumeControls);
