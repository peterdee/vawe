import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default async function requestPlaybackState(
  connection: types.ExtendedSocket,
  server: Server,
  message: types.SocketMessage<types.PlaybackStatePayload>,
) {
  const sockets = await server.sockets.fetchSockets();
  const target: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
    (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === message.target,
  )[0];
  if (target) {
    connection.to(target.id).emit(WS_EVENTS.requestPlaybackState, message);
  }
}
