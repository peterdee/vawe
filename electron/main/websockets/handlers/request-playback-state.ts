import type { Server } from 'socket.io';

import { DEFAULT_TIMEOUT, WS_EVENTS } from '../../../../constants';
import type * as types from 'types';

const EVENT = WS_EVENTS.requestPlaybackState;

export default async function requestPlaybackState(
  connection: types.ExtendedSocket,
  server: Server,
  callback: (payload: types.SocketResponse<types.PlaybackStatePayload>) => void,
) {
  if (connection.clientType === 'remote') {
    const sockets = await server.sockets.fetchSockets();
    const player: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[])
      .filter(
        (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === 'player',
      )[0];
    if (player) {
      try {
        const response: types.SocketResponse<types.PlaybackStatePayload> = await connection
          .timeout(DEFAULT_TIMEOUT)
          .to(player.id)
          .emitWithAck(EVENT);
        callback(response);
      } catch (error) {
        callback({
          error: error as Error,
          event: EVENT,
        });
      }
    }
  }
}
