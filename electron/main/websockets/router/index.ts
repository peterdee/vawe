import type { Server } from 'socket.io';

import changeCurrentTrackElapsedTime from '../handlers/change-current-track-elapsed-time';
import requestCurrentTrack from '../handlers/request-current-track';
import requestPlaybackState from '../handlers/request-playback-state';
import requestTracklist from '../handlers/request-tracklist';
import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default function router(connection: types.ExtendedSocket, server: Server) {
  connection.on(
    WS_EVENTS.changeCurrentTrackElapsedTime,
    (value: number) => changeCurrentTrackElapsedTime(
      connection,
      server,
      value,
    ),
  );
  connection.on(
    WS_EVENTS.requestCurrentTrack,
    (
      callback: (
        payload: types.SocketResponse<string>,
      ) => void,
    ) => requestCurrentTrack(connection, server, callback),
  );
  connection.on(
    WS_EVENTS.requestPlaybackState,
    (
      callback: (
        payload: types.SocketResponse<types.PlaybackStatePayload>,
      ) => void,
    ) => requestPlaybackState(connection, server, callback),
  );
  connection.on(
    WS_EVENTS.requestTracklist,
    (
      callback: (
        payload: types.SocketResponse<types.Track[]>,
      ) => void,
    ) => requestTracklist(connection, server, callback),
  );
}
