import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { COLORS, UNIT } from '@/constants';
import type { RootState } from '@/store';
import type * as types from 'types';
import '../styles.css';

function TrackCover(): React.JSX.Element {
  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const [coverLink, setCoverLink] = useState<string>('');

  useEffect(
    () => {
      if (currentTrackMetadata
        && currentTrackMetadata.metadata.common.picture
        && currentTrackMetadata.metadata.common.picture.length > 0) {
        const coverData = currentTrackMetadata.metadata.common.picture[0].data;
        setCoverLink(URL.createObjectURL(new Blob([coverData])));
      }

      return () => {
        if (coverLink) {
          URL.revokeObjectURL(coverLink);
        }
      };
    },
    [currentTrackMetadata],
  );

  // TODO: double click on cover to open it in a modal

  // TODO: context menu click to save cover

  // TODO: cover should be a background-image to prevent image dragging

  return (
    <div className="f j-center w-100vh mh-1 track-cover">
      { coverLink && (
        <img
          alt="Cover"
          className="track-cover"
          src={coverLink}
        />
      ) }
      { !coverLink && (
        <svg
          height={UNIT * 10}
          viewBox="0 0 24 24"
          width={UNIT * 10}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M0 0h24v24H0z"
              fill="none"
            />
            <path
              d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 14c2.213 0 4-1.787 4-4s-1.787-4-4-4-4 1.787-4 4 1.787 4 4 4zm0-5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"
              fill={COLORS.accentHighlight}
            />
          </g>
        </svg>
      ) }
    </div>
  );
}

export default React.memo(TrackCover);
