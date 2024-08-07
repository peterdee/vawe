import {
  createServer,
  type Server as HTTPServer,
} from 'node:http';
import { Server } from 'socket.io';

import log from './log';
import router from './router';
import { SERVER, WS_EVENTS } from '../../../constants';
import type * as types from 'types';

export default function createWebsocketsServer(): HTTPServer {
  const httpServer = createServer();
  const websocketsServer = new Server(
    httpServer,
    {
      connectionStateRecovery: {
        maxDisconnectionDuration: SERVER.maxDisconnectionDurationMS,
        skipMiddlewares: true,
      },
      connectTimeout: SERVER.connectTimeoutMS,
      cors: {
        allowedHeaders: '*',
        origin: '*',
      },
      serveClient: false,
    },
  );
  
  websocketsServer.on(
    WS_EVENTS.connectToServer,
    (connection: types.ExtendedSocket) => {
      log('client connected:', connection.id);

      connection.clientType = (connection.handshake.query?.clientType
        || 'player') as types.Target;

      router(connection, websocketsServer);

      connection.on(
        WS_EVENTS.disconnectFromServer,
        () => log('client disconnected: ', connection.id),
      );
    },
  );
  
  return httpServer;
}
