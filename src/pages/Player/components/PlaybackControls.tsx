import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeIsPlaying } from '@/store/features/playbackSettings';
import IconNext from '@/components/IconNext';
import IconPause from '@/components/IconPause';
import IconPlay from '@/components/IconPlay';
import IconPrevious from '@/components/IconPrevious';
import IconStop from '@/components/IconStop';
import * as types from 'types';
import { COLORS, UNIT } from '@/constants';

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
    <div className="f ai-center">
      <ButtonWithIcon
        onClick={() => handleChangeTrack('previous')}
        title="Previous"
      >
        <IconPrevious
          height={UNIT * 2}
          iconColorBase={COLORS.accent}
          iconColorHover={COLORS.accentHighlight}
          width={UNIT * 2}
        />
      </ButtonWithIcon>
      <ButtonWithIcon
        globalStyles="ml-1"
        onClick={handlePlayPause}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        { isPlaying && (
          <IconPause
            height={UNIT * 1.5}
            iconColorBase={COLORS.accent}
            iconColorHover={COLORS.accentHighlight}
            width={UNIT * 1.5}
          />
        ) }
        { !isPlaying && (
          <IconPlay
            height={UNIT * 1.5}
            iconColorBase={COLORS.accent}
            iconColorHover={COLORS.accentHighlight}
            width={UNIT * 1.5}
          />
        ) }
      </ButtonWithIcon>
      <ButtonWithIcon
        globalStyles="ml-1"
        onClick={handleStopPlayback}
        title="Stop"
      >
        <IconStop
          height={UNIT * 2}
          iconColorBase={COLORS.accent}
          iconColorHover={COLORS.accentHighlight}
          width={UNIT * 2}
        />
      </ButtonWithIcon>
      <ButtonWithIcon
        globalStyles="ml-1"
        onClick={() => handleChangeTrack('next')}
        title="Next"
      >
        <IconNext
          height={UNIT * 2}
          iconColorBase={COLORS.accent}
          iconColorHover={COLORS.accentHighlight}
          width={UNIT * 2}
        />
      </ButtonWithIcon>
    </div>
  );
}

export default React.memo(PlaybackControls);
