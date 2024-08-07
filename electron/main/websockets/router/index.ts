import type { Server } from 'socket.io';

import requestPlaybackState from '../handlers/request-playback-state';
import requestTracklist from '../handlers/request-tracklist';
import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default function router(connection: types.ExtendedSocket, server: Server) {
  connection.on(
    WS_EVENTS.requestPlaybackState,
    (
      message: types.SocketMessage<types.PlaybackStatePayload>,
    ) => requestPlaybackState(connection, server, message),
  );
  connection.on(
    WS_EVENTS.requestTracklist,
    (
      message: types.SocketMessage<types.Track[]>,
    ) => requestTracklist(connection, server, message),
  );
}
