import {
  createServer,
  type Server as HTTPServer,
} from 'node:http';
import { Server } from 'socket.io';

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
    'connection',
    (socket) => {
      console.log('connected', socket.id);

      socket.on(WS_EVENTS.addTrack, (track: types.Track) => {
        console.log('added track', track);
      });

      socket.on(WS_EVENTS.loadPlaylist, (playlist: types.Track[]) => {
        console.log('playlist loaded', playlist.length);
      });

      socket.on(WS_EVENTS.removeTrack, (id: string) => {
        console.log('removed track id', id);
      });

      socket.on('disconnect', () => console.log('disconnected', socket.id));
    },
  );
  
  return httpServer;
}
