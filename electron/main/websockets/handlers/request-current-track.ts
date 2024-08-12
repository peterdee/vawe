import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default async function requestCurrentTrack(
  connection: types.ExtendedSocket,
  server: Server,
  message?: types.SocketMessage<string>,
) {
  const sockets = await server.sockets.fetchSockets();
  const targetClientType: types.ClientType = connection.clientType === 'player'
    ? 'remote'
    : 'player';
  const target: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
    (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === targetClientType,
  )[0];
  console.log('request current track', `${connection.clientType} -> ${targetClientType}`);
  if (target) {
    console.log(
      `request ct emitted by ${connection.clientType}`,
      message,
      JSON.stringify(message),
    );
    connection.to(target.id).emit(WS_EVENTS.requestCurrentTrack, message);
  }
}