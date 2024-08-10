import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default async function requestPlaybackState(
  connection: types.ExtendedSocket,
  server: Server,
  message?: types.SocketMessage<types.PlaybackStatePayload>,
) {
  const sockets = await server.sockets.fetchSockets();
  const targetClientType: types.ClientType = connection.clientType === 'player'
    ? 'remote'
    : 'player';
  const target: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
    (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === targetClientType,
  )[0];
  if (target) {
    console.log(`request playback emitted by ${connection.clientType}`, message);
    connection.to(target.id).emit(WS_EVENTS.requestPlaybackState, message);
  }
}
