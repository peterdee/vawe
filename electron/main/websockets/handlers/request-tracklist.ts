import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default async function requestTracklist(
  connection: types.ExtendedSocket,
  server: Server,
  message: types.SocketMessage<types.Track[]>,
) {
  const sockets = await server.sockets.fetchSockets();
  const target: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
    (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === message.target,
  )[0];
  console.log('request tracks', target);
  if (target) {
    server.to(target.id).emit(WS_EVENTS.requestTracklist, message);
  }
}
