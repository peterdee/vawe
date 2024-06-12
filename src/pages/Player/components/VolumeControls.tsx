import React from 'react';

interface VolumeControlsProps {
  handleVolumeChange: (value: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
}

function VolumeControls(props: VolumeControlsProps): React.JSX.Element {
  const {
    handleVolumeChange,
    isMuted,
    toggleMute,
    volume,
  } = props;

  return (
    <div className="f">
      <button
        className="mr-1"
        onClick={toggleMute}
        type="button"
      >
        { isMuted ? 'Unmute' : 'Mute' }
      </button>
      <input
        max={1}
        min={0}
        onChange={(event) => handleVolumeChange(Number(event.target.value))}
        step={0.01}
        type="range"
        value={volume}
      />
    </div>
  );
}

export default React.memo(VolumeControls);
