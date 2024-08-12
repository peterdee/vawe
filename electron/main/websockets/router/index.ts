import type { Server } from 'socket.io';

import loadPlaylist from '../handlers/load-playlist';
import requestCurrentTrack from '../handlers/request-current-track';
import requestPlaybackState from '../handlers/request-playback-state';
import requestTracklist from '../handlers/request-tracklist';
import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default function router(connection: types.ExtendedSocket, server: Server) {
  connection.on(
    WS_EVENTS.loadPlaylist,
    (
      message?: types.SocketMessage<types.Track[]>,
    ) => loadPlaylist(connection, server, message),
  );
  connection.on(
    WS_EVENTS.requestCurrentTrack,
    (
      message?: types.SocketMessage<string>,
    ) => requestCurrentTrack(connection, server, message),
  );
  connection.on(
    WS_EVENTS.requestPlaybackState,
    (
      message?: types.SocketMessage<types.PlaybackStatePayload>,
    ) => requestPlaybackState(connection, server, message),
  );
  connection.on(
    WS_EVENTS.requestTracklist,
    (
      message?: types.SocketMessage<types.Track[]>,
      callback?: (payload: types.Track[]) => void,
    ) => requestTracklist(connection, server, message, callback),
  );
}
