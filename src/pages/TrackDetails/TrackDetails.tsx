import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function TrackDetails(): React.JSX.Element {
  const [metadata, setMetadata] = useState<types.CustomAudioMetadata | null>(null);
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  const { id = '' } = useParams();

  useEffect(
    () => {
      const path = window.localStorage.getItem('trackPath');
      if (!path) {
        setMetadataLoadingError(true);
      } else {
        console.log('here', id, path)
        extendedWindow.backend.loadMetadataRequest({ id, path });
      }

      extendedWindow.backend.loadMetadataResponse((_, { error, metadata }) => {
        if (error) {
          return setMetadataLoadingError(true);
        }

        console.log(metadata);
        const covers: types.CoverData[] = [];
        if (metadata
          && metadata.common
          && metadata.common.picture
          && metadata.common.picture.length > 0
        ) {
          metadata.common.picture.forEach((value) => {
            if (value.data) {
              covers.push({
                format: value.format,
                objectURL: URL.createObjectURL(new Blob([value.data])),
              });
            }
          });

          return setMetadata({
            common: {
              ...metadata.common,
              picture: undefined,
            },
            covers,
            format: metadata.format,
          });
        } else {
          setMetadataLoadingError(true);
        }
      });

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
