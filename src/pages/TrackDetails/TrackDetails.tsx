import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store';
import { changeTrackNotAccessible } from '@/store/features/tracklist';
import type * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function TrackDetails(): React.JSX.Element {
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

  const { id = '' } = useParams();

  useEffect(
    () => {
      extendedWindow.backend.loadMetadataRequest({
        id,
        path: tracks.filter((track: types.Track): boolean => track.id === id)[0].path,
      });

      extendedWindow.backend.loadMetadataResponse((_, { error, id, metadata }) => {
        if (error) {
          dispatch(changeTrackNotAccessible(id));
          // dispatch(changeShowErrorModal({
          //   message: 'Could not load metadata for a track!',
          //   showModal: true,
          // }));
          return setMetadataLoadingError(true);
        }
        console.log(metadata);
        // if (!error && metadata) {
        //   dispatch(changeCurrentTrackMetadata({ id, metadata }));
        // }
      });
    },
    [],
  );

  return (
    <div className="f d-col p-1">
      <h2>
        Track details
      </h2>
      <div>
        { id }
      </div>
    </div>
  );
}

export default React.memo(TrackDetails);
