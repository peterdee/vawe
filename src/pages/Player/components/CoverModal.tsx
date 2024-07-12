import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';
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

  const ref = useRef<HTMLDivElement>(null);

  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const coverLink = useMemo(
    () => currentTrackMetadata
      && currentTrackMetadata.metadata
      && currentTrackMetadata.metadata.covers
      && currentTrackMetadata.metadata.covers.length > 0
      && currentTrackMetadata.metadata.covers[0].objectURL || '',
    [currentTrackMetadata],
  );

  const handleCloseModal = () => {
    dispatch(changeShowCoverModal(false));
  };

  const handleDownload = useCallback(
    () => {
      const link = document.createElement('a');
      link.href = coverLink;
      link.setAttribute('style', 'display: none;');
      link.setAttribute('download', 'cover.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [coverLink],
  );
  
  useClickOutside<void>(ref, handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f j-end mh-auto cover-modal-image-wrap"
        ref={ref}
        style={{
          backgroundImage: `url(${coverLink})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      >
        <ButtonWithIcon
          onClick={handleDownload}
          stopPropagation
        >
          <IconDownload
            height={iconSize}
            iconColorBase="black"
            title="Dowlnoad cover"
            width={iconSize}
          />
        </ButtonWithIcon>
        <ButtonWithIcon
          globalStyles="ml-1"
          onClick={handleCloseModal}
          stopPropagation
        >
          <IconClose
            height={iconSize}
            iconColorBase="black"
            title="Close"
            width={iconSize}
          />
        </ButtonWithIcon>
      </div>
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
