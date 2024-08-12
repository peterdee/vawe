import type { Server } from 'socket.io';

import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default async function requestTracklist(
  connection: types.ExtendedSocket,
  server: Server,
  message?: types.SocketMessage<types.Track[]>,
  callback?: (payload: types.Track[]) => void,
) {
  if (connection.clientType === 'remote' && callback) {
    const sockets = await server.sockets.fetchSockets();
    const player: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
      (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === 'player',
    )[0];
    if (player) {
      console.log(
        `request tracks by remote`,
        message,
        JSON.stringify(message),
      );
      const response: types.Track[] = await connection.timeout(5000).to(player.id).emitWithAck(
        WS_EVENTS.requestTracklist,
        message,
      );
      console.log('received response', response);
      callback(response);
    }
  }

  // const target: types.ExtendedRemoteSocket = (sockets as types.ExtendedRemoteSocket[]).filter(
  //   (remoteSocket: types.ExtendedRemoteSocket) => remoteSocket.clientType === targetClientType,
  // )[0];
  // console.log('request tracklist', `${connection.clientType} -> ${targetClientType}`);
  // if (target) {
  //   console.log(
  //     `request tracks emitted by ${connection.clientType}`,
  //     message,
  //     JSON.stringify(message),
  //   );
  //   connection.to(target.id).emit(WS_EVENTS.requestTracklist, message);
  // }
}
