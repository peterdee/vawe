import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeIsPlaying } from '@/store/features/playbackSettings';
import IconNext from '@/components/IconNext';
import IconPause from '@/components/IconPause';
import IconPlay from '@/components/IconPlay';
import * as types from 'types';

interface PlaybackControlsProps {
  handleChangeTrack: (changeTo: types.ChangeTrackTo) => void;
  wavesurfer: types.WaveSurferInstance;
}

function PlaybackControls(props: PlaybackControlsProps): React.JSX.Element {
  const {
    handleChangeTrack,
    wavesurfer,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const isPlaying = useSelector<RootState, boolean>(
    (state) => state.playbackSettings.isPlaying,
  );

  const handlePlayPause = async () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        await wavesurfer.play();
      }
      dispatch(changeIsPlaying(!isPlaying));
    } else {
      handleChangeTrack('next');
    }
  };

  const handleStopPlayback = () => {
    dispatch(changeIsPlaying(false));
    if (wavesurfer) {
      wavesurfer.stop();
    }
  };

  return (
    <div className="f">
      <button
        className="button"
        onClick={() => handleChangeTrack('previous')}
        type="button"
      >
        Previous
      </button>
      <ButtonWithIcon
        globalStyles="ml-1"
        onClick={handlePlayPause}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        { isPlaying && (
          <IconPause iconColorBase="lightgreen" />
        ) }
        { !isPlaying && (
          <IconPlay iconColorBase="lightgreen" />
        ) }
      </ButtonWithIcon>
      <button
        className="button ml-1"
        onClick={handleStopPlayback}
        type="button"
      >
        Stop
      </button>
      <IconNext height={42} />
      <button
        className="button ml-1"
        onClick={() => handleChangeTrack('next')}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

export default React.memo(PlaybackControls);
