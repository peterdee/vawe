import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeShowCoverModal } from '@/store/features/playlistSettings';
import IconClose from '@/components/IconClose';
import ModalBackground from '@/components/ModalBackground';
import type * as types from 'types';
import useClickOutside from '@/hooks/use-click-outsude';

function CoverModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const ref = useRef<HTMLDivElement>(null);

  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const handleCloseModal = () => {
    dispatch(changeShowCoverModal(false));
  };
  
  useClickOutside<void>(ref, handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f d-col j-space-between p-1 settings-modal-wrap"
        ref={ref}
      >
        asd
      </div>
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
