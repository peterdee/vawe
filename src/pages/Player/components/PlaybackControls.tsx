import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeIsPlaying } from '@/store/features/playbackSettings';
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
    <div className="flex pv-1">
      <button
        className="button"
        onClick={() => handleChangeTrack('previous')}
        type="button"
      >
        Previous
      </button>
      <button
        className="button ml-1"
        onClick={handlePlayPause}
        type="button"
      >
        { isPlaying ? 'Pause' : 'Play' }
      </button>
      <button
        className="button ml-1"
        onClick={handleStopPlayback}
        type="button"
      >
        Stop
      </button>
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
