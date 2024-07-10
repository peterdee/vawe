import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeShowCoverModal } from '@/store/features/playlistSettings';
import IconClose from '@/components/IconClose';
import IconDownload from '@/components/IconDownload';
import ModalBackground from '@/components/ModalBackground';
import type * as types from 'types';
import { UNIT } from '../../../constants';
import useClickOutside from '@/hooks/use-click-outsude';

const iconSize = UNIT * 2.5;

function CoverModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const closeRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const handleCloseModal = () => {
    dispatch(changeShowCoverModal(false));
  };
  
  useClickOutside<void>(closeRef, handleCloseModal);
  useClickOutside<void>(downloadRef, handleCloseModal);

  return (
    <ModalBackground>
      <div className="f j-end p-1 cover-modal-wrap-top">
        <div ref={downloadRef}>
          <ButtonWithIcon
            onClick={() => console.log('download')}
            title="Dowlnoad cover"
          >
            <IconDownload
              height={iconSize}
              iconColorBase="black"
              width={iconSize}
            />
          </ButtonWithIcon>
        </div>
        <div ref={closeRef}>
          <ButtonWithIcon
            globalStyles="ml-1"
            onClick={handleCloseModal}
          >
            <IconClose
              height={iconSize}
              iconColorBase="black"
              width={iconSize}
            />
          </ButtonWithIcon>
        </div>
      </div>
      <div className="f d-col j-space-between p-1 settings-modal-wrap">
        asd
      </div>
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
