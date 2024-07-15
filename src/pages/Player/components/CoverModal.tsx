import React, {
  useCallback,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeShowCoverModal } from '@/store/features/modals';
import { COLORS, UNIT } from '../../../constants';
import IconClose from '@/components/IconClose';
import IconDownload from '@/components/IconDownload';
import ModalBackground from '@/components/ModalBackground';
import type * as types from 'types';

const iconSize = UNIT * 2.5;

function CoverModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const coverFormat = useMemo(
    () => currentTrackMetadata
      && currentTrackMetadata.metadata
      && currentTrackMetadata.metadata.covers
      && currentTrackMetadata.metadata.covers.length > 0
      && currentTrackMetadata.metadata.covers[0].format || '',
    [currentTrackMetadata],
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
      const fileName = coverLink.split('/').reverse()[0].split('-')[0];
      let format = 'jpg';
      if (coverFormat === 'image/png') {
        format = 'png';
      }
      link.setAttribute('download', `${fileName}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [
      coverFormat,
      coverLink,
    ],
  );
  
  return (
    <ModalBackground>
      <div className="f p-1 cover-modal-controls-wrap">
        <ButtonWithIcon
          onClick={handleDownload}
          stopPropagation
        >
          <IconDownload
            height={iconSize}
            iconColorBase="black"
            iconColorHover={COLORS.accent}
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
            iconColorHover={COLORS.accent}
            title="Close"
            width={iconSize}
          />
        </ButtonWithIcon>
      </div>
      <div
        className="f j-end mh-auto cover-modal-image-wrap"
        style={{
          backgroundImage: `url(${coverLink})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
