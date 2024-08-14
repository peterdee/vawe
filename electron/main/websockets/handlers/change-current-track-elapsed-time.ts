import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

const EVENT = WS_EVENTS.changeCurrentTrackElapsedTime;

export default async function changeCurrentTrackElapsedTime(
  connection: types.ExtendedSocket,
  server: Server,
  value: number,
) {
  if (connection.clientType === 'player') {
    console.log('change elapsed');
    const sockets = await server.sockets.fetchSockets();
    const remote: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[])
      .filter(
        (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === 'remote',
      )[0];
    if (remote) {
      connection.to(remote.id).emit(EVENT, value);
    }
  }
}
