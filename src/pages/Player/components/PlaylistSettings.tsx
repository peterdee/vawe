import React from 'react';

interface PlaylistSettingsProps {
  isLooped: boolean;
  isShuffled: boolean;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

function PlaylistSettings(props: PlaylistSettingsProps): React.JSX.Element {
  const {
    isLooped,
    isShuffled,
    toggleLoop,
    toggleShuffle,
  } = props;

  return (
    <div className="f">
      <button
        onClick={toggleLoop}
        type="button"
      >
        { isLooped ? 'Disable playlist loop' : 'Enable playlist loop' }
      </button>
      <button
        className="ml-1"
        onClick={toggleShuffle}
        type="button"
      >
        { isShuffled ? 'Disable shuffling' : 'Enable shuffling' }
      </button>
    </div>
  );
}

export default React.memo(PlaylistSettings);
