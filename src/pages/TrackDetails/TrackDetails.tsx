import { getItem } from '@/utilities/local-storage';
import React, { useEffect, useState } from 'react';

import type * as types from 'types';

function TrackDetails(): React.JSX.Element {
  const [metadata, setMetadata] = useState<types.CustomAudioMetadata | null>(null);
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  useEffect(
    () => {
      const storedMetadata = getItem<types.CustomAudioMetadata | null>('trackMetadata');
      if (!storedMetadata) {
        setMetadataLoadingError(true);
      } else {
        setMetadata(storedMetadata);
      }

      return () => {
        if (metadata && metadata.covers && metadata.covers.length > 0) {
          metadata.covers.forEach(
            (cover: types.CoverData) => URL.revokeObjectURL(cover.objectURL || ''),
          );
        }
      };
    },
    [],
  );

  return (
    <div className="f d-col p-1">
      { metadataLoadingError && (
        <div className="">
          Could not load metadata for a track!
        </div>
      ) }
      { !metadataLoadingError && (
        <>
          <h2>
            Track details
          </h2>
          <div>
            { `Artist: ${metadata?.common.artist}` }
          </div>
        </>
      ) }
    </div>
  );
}

export default React.memo(TrackDetails);
