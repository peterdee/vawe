import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import formatDuration from '@/utilities/format-duration';
import type { RootState } from '@/store';
import { SocketContext } from '@/contexts/socket';
import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';
import '../styles.css';

function ElapsedTime(): React.JSX.Element {
  const { connection } = useContext(SocketContext);

  const [previous, setPrevious] = useState<number>(0);

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );
  const elapsedTime = useSelector<RootState, number>(
    (state) => state.tracklist.currentTrackElapsedTime,
  );

  useEffect(
    () => {
      if (connection && connection.connected && elapsedTime - previous > 1) {
        console.log('elapsed', elapsedTime);
        connection.emit(
          WS_EVENTS.changeCurrentTrackElapsedTime,
          elapsedTime,
        );
        setPrevious(elapsedTime)
      }
    },
    [elapsedTime, previous],
  );

  return (
    <div className="f ai-center ns playtime">
      <div className="ml-1 t-right playtime-element">
        {
          currentTrack && currentTrackObjectURL
            ? formatDuration(elapsedTime)
            : '--:--'
        }
      </div>
      <div className="mh-half t-center playtime-separator">
        /
      </div>
      <div className="mr-1 playtime-element">
          {
            currentTrack && currentTrackObjectURL
              ? formatDuration(currentTrack.durationSeconds)
              : '--:--'
          }
      </div>
    </div>
  );
}

export default React.memo(ElapsedTime);
