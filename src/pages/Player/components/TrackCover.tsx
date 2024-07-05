import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

  return (
    <div className="f j-center w-100vh track-cover">
      <img
        alt="Cover"
        className="track-cover"
        src={coverLink}
      />
    </div>
  );
}

export default React.memo(TrackCover);
