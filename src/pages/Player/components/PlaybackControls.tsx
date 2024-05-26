import React from 'react';

import type { ChangeTrackTo } from '@/models';

interface PlaybackControlsProps {
  handleChangeTrack: (changeTo: ChangeTrackTo) => void;
  handlePlayPause: () => void;
  handleStopPlayback: () => void;
  isPlaying: boolean;
}

function PlaybackControls(props: PlaybackControlsProps): React.JSX.Element {
  const {
    handleChangeTrack,
    handlePlayPause,
    handleStopPlayback,
    isPlaying,
  } = props;

  return (
    <div className="flex p-1">
      <button
        onClick={() => handleChangeTrack('previous')}
        type="button"
      >
        Previous
      </button>
      <button
        className="ml-1"
        onClick={handlePlayPause}
        type="button"
      >
        { isPlaying ? 'Pause' : 'Play' }
      </button>
      <button
        className="ml-1"
        onClick={handleStopPlayback}
        type="button"
      >
        Stop
      </button>
      <button
        className="ml-1"
        onClick={() => handleChangeTrack('next')}
        type="button"
      >
        Next
      </button>
    </div>
  );
}

export default React.memo(PlaybackControls);
