import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeShowSettingsModal } from '@/store/features/playlistSettings';
import ModalBackground from '@/components/ModalBackground';

function PlaylistSettingsModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseModal = () => {
    dispatch(changeShowSettingsModal(false));
  };

  return (
    <ModalBackground closeModal={handleCloseModal}>
      <div className="f d-col settings-modal-wrap">
        Settings
      </div>
    </ModalBackground>
  );
}

export default React.memo(PlaylistSettingsModal);
