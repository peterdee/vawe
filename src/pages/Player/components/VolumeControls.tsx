import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeMute, changeVolume } from '@/store/features/volumeSettings';
import { COLORS, UNIT } from '@/constants';
import IconVolumeHigh from '@/components/IconVolumeHigh';
import IconVolumeLow from '@/components/IconVolumeLow';
import IconVolumeMedium from '@/components/IconVolumeMedium';
import IconVolumeMuted from '@/components/IconVolumeMuted';
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
      <ButtonWithIcon
        globalStyles="mr-1"
        onClick={onChangeMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        { isMuted && (
          <IconVolumeMuted
            height={UNIT * 2}
            iconColorBase={COLORS.accent}
            iconColorHover={COLORS.accentHighlight}
            width={UNIT * 2}
          />
        ) }
        { !isMuted && (
          <>
            { volume > 0.6 && (
              <IconVolumeHigh
                height={UNIT * 2}
                iconColorBase={COLORS.accent}
                iconColorHover={COLORS.accentHighlight}
                width={UNIT * 2}
              />
            ) }
            { volume <= 0.6 && volume > 0.3 && (
              <IconVolumeMedium
                height={UNIT * 2}
                iconColorBase={COLORS.accent}
                iconColorHover={COLORS.accentHighlight}
                width={UNIT * 2}
              />
            ) }
            { volume <= 0.3 && (
              <IconVolumeLow
                height={UNIT * 2}
                iconColorBase={COLORS.accent}
                iconColorHover={COLORS.accentHighlight}
                width={UNIT * 2}
              />
            ) }
          </>
        ) }
      </ButtonWithIcon>
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
