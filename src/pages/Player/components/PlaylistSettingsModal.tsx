import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeShowSettingsModal } from '@/store/features/playlistSettings';
import { clearTracklist, shuffleTracklist } from '@/store/features/tracklist';
import LinkButton from '@/components/LinkButton';
import ModalBackground from '@/components/ModalBackground';
import type * as types from 'types';
import useClickOutside from '@/hooks/use-click-outsude';

const extendedWindow = window as types.ExtendedWindow;

function PlaylistSettingsModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const ref = useRef<HTMLDivElement>(null);

  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const handleCloseModal = () => {
    dispatch(changeShowSettingsModal(false));
  };
  
  const handleClearPlaylist = () => {
    dispatch(clearTracklist());
    handleCloseModal();
  };

  const handleOpenPlaylist = () => {
    extendedWindow.backend.openPlaylistRequest();
    handleCloseModal();
  };

  const handleSavePlaylist = () => {
    extendedWindow.backend.savePlaylistRequest(tracks);
    handleCloseModal();
  };

  const handleShufflePlaylist = () => {
    dispatch(shuffleTracklist());
    handleCloseModal();
  };

  useClickOutside<void>(ref, handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f d-col p-1 settings-modal-wrap"
        ref={ref}
      >
        <h2>
          Playlist settings
        </h2>
        <LinkButton
          globalClasses="mt-1"
          onClick={handleOpenPlaylist}
        >
          Open playlist
        </LinkButton>
        <LinkButton
          globalClasses="mt-1"
          onClick={handleSavePlaylist}
        >
          Save playlist
        </LinkButton>
        <hr className="mv-1" />
        <LinkButton
          onClick={handleShufflePlaylist}
        >
          Shuffle playlist
        </LinkButton>
        <LinkButton
          globalClasses="mt-1"
          onClick={handleClearPlaylist}
        >
          Clear playlist
        </LinkButton>
      </div>
    </ModalBackground>
  );
}

export default React.memo(PlaylistSettingsModal);
