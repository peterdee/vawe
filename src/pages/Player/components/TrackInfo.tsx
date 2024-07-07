import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { COLORS, UNIT } from '@/constants';
import type { RootState } from '@/store';
import type * as types from 'types';
import '../styles.css';

function TrackInfo(): React.JSX.Element {
  const [coverLink, setCoverLink] = useState<string>('');

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  useEffect(
    () => {
      if (currentTrackMetadata
        && currentTrackMetadata.metadata.pictureLinks
        && currentTrackMetadata.metadata.pictureLinks.length > 0) {
        setCoverLink(currentTrackMetadata.metadata.pictureLinks[0]);
      } else {
        setCoverLink('');
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

  // TODO: cover picture size should be controlled via settings
  const size = UNIT * 15;

  return (
    <div className="f ai-center w-100vh mh-1 pt-1">
      <div
        className="f j-center"
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        { coverLink && (
          <img
            alt="Cover"
            src={coverLink}
            style={{
              height: `${size}px`,
              width: `${size}px`,
            }}
          />
        ) }
        { !coverLink && (
          <svg
            height={size}
            viewBox="0 0 24 24"
            width={size}
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
      <div className="f ml-1">
        { currentTrack && currentTrack.name || 'VAWE' }
      </div>
    </div>
  );
}

export default React.memo(TrackInfo);
