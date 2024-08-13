import React, { useCallback, useContext } from 'react';
import Player from '@wavesurfer/react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { changeCurrentTrackElapsedTime } from '@/store/features/tracklist';
import { SocketContext } from '@/contexts/socket';
import type * as types from 'types';
import { UNIT } from '@/constants';
import { WS_EVENTS } from '../../../../constants';

interface WavesurferPlayerProps {
  onFinish: (instance: types.WaveSurferInstance) => void;
  onReady: (instance: types.WaveSurferInstance) => void;
}

function WavesurferPlayer(props: WavesurferPlayerProps): React.JSX.Element {
  const {
    onFinish,
    onReady,
  } = props;

  const { connection } = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();

  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );

  const onTime = useCallback(
    (wavesurfer: types.WaveSurferInstance) => {
      if (wavesurfer) {
        const time = wavesurfer.getCurrentTime();
        dispatch(changeCurrentTrackElapsedTime(time));
        if (connection && connection.connected) {
          console.log('elapsed', time);
          connection.emit(
            WS_EVENTS.changeCurrentTrackElapsedTime,
            time,
          );
        }
      }
    },
    [connection],
  );

  return (
    <div className="m-1">
      <Player
        cursorColor="black"
        cursorWidth={2}
        height={UNIT * 2}
        onReady={onReady}
        onFinish={onFinish}
        onTimeupdate={onTime}
        progressColor="darkgreen"
        url={currentTrackObjectURL}
        waveColor="lightgreen"
      />
    </div>
  );
}

export default React.memo(WavesurferPlayer);
