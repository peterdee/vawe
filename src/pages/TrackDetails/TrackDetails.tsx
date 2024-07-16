import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store';
import { changeTrackNotAccessible } from '@/store/features/tracklist';
import type * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function TrackDetails(): React.JSX.Element {
  const [metadata, setMetadata] = useState<types.CustomAudioMetadata | null>(null);
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const { id = '' } = useParams();
      console.log('id', id);
  useEffect(
    () => {
      console.log('id', tracks);
      extendedWindow.backend.loadMetadataRequest({
        id,
        path: tracks.filter((track: types.Track): boolean => track.id === id)[0].path,
      });

      // extendedWindow.backend.loadMetadataResponse((_, { error, id, metadata }) => {
      //   if (error) {
      //     dispatch(changeTrackNotAccessible(id));
      //     return setMetadataLoadingError(true);
      //   }
      //   const covers: types.CoverData[] = [];
      //   if (metadata
      //     && metadata.common
      //     && metadata.common.picture
      //     && metadata.common.picture.length > 0
      //   ) {
      //     metadata.common.picture.forEach((value) => {
      //       if (value.data) {
      //         covers.push({
      //           format: value.format,
      //           objectURL: URL.createObjectURL(new Blob([value.data])),
      //         });
      //       }
      //     });

      //     return setMetadata({
      //       common: {
      //         ...metadata.common,
      //         picture: undefined,
      //       },
      //       covers,
      //       format: metadata.format,
      //     });
      //   }
      // });

      return () => {
        console.log('revoke');
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
            { id }
          </div>
        </>
      ) }
    </div>
  );
}

export default React.memo(TrackDetails);
