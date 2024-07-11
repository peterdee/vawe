import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import {
  changeLoop,
  changeShowSettingsModal,
} from '@/store/features/playlistSettings';
import {
  clearTracklist,
  shuffleTracklist,
} from '@/store/features/tracklist';
import IconClose from '@/components/IconClose';
import LinkButton from '@/components/LinkButton';
import ModalBackground from '@/components/ModalBackground';
import StyledSwitch from '@/components/StyledSwitch';
import type * as types from 'types';
import useClickOutside from '@/hooks/use-click-outsude';

const extendedWindow = window as types.ExtendedWindow;

function PlaylistSettingsModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const ref = useRef<HTMLDivElement>(null);

  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
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

  const handleLoopPlaylist = useCallback(
    () => {
      dispatch(changeLoop(!isLooped));
    },
    [isLooped],
  );

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

  useClickOutside<void>([ref], handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f d-col j-space-between p-1 settings-modal-wrap"
        ref={ref}
      >
        <div className="f ai-center j-space-between ns">
          <h2>
            Playlist settings
          </h2>
          <ButtonWithIcon
            onClick={handleCloseModal}
          >
            <IconClose />
          </ButtonWithIcon>
        </div>
        <LinkButton
          onClick={handleOpenPlaylist}
        >
          Open playlist
        </LinkButton>
        <LinkButton
          onClick={handleSavePlaylist}
        >
          Save playlist
        </LinkButton>
        <hr />
        <StyledSwitch
          checked={isLooped}
          globalClasses="j-space-between"
          labelText="Loop playlist"
          onChange={handleLoopPlaylist}
        />
        <LinkButton
          onClick={handleShufflePlaylist}
        >
          Shuffle playlist
        </LinkButton>
        <LinkButton
          onClick={handleClearPlaylist}
        >
          Clear playlist
        </LinkButton>
      </div>
    </ModalBackground>
  );
}

export default React.memo(PlaylistSettingsModal);
