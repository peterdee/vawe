import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../store';
import { CLIENT_TYPE, WS_EVENTS } from '../../constants';
import log from '../utilities/logger';
import type * as types from 'types';

interface SocketContextData {
  connection: Socket | null;
  createConnection: (() => void) | null;
}

const defaultContextValue: SocketContextData = {
  connection: null,
  createConnection: null,
};

export const SocketContext = createContext(defaultContextValue);

const SocketProvider = (props: React.PropsWithChildren): React.JSX.Element => {
  const [connection, setConnection] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const isMuted = useSelector<RootState, boolean>(
    (state) => state.volumeSettings.isMuted,
  );
  const isPlaying = useSelector<RootState, boolean>(
    (state) => state.tracklist.isPlaying,
  );
  const serverAddress = useSelector<RootState, string>(
    (state) => state.appSettings.serverAddress,
  );
  const tracklist = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );
  const volume = useSelector<RootState, number>(
    (state) => state.volumeSettings.volume,
  );

  const createConnection = useCallback(
    (): null | void => {
      if (isConnected) {
        return null;
      }
      const newConnection = io(
        serverAddress,
        {
          autoConnect: true,
          query: {
            clientType: CLIENT_TYPE,
          },
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 10000,
          retries: 10,
        },
      );

      newConnection.on(
        WS_EVENTS.connectClient,
        () => {
          setConnection(newConnection);
          setIsConnected(true);
          log('connected as', newConnection.id);
        },
      );

      newConnection.io.on(
        'error',
        (error) => {
          // TODO: do not reconnect if server is offline
          log('could not connect to the server', error);
        },
      );
    },
    [isConnected],
  );

  useEffect(
    () => {
      const requestCurrentTrackHandler = (
        callback: (payload: types.SocketResponse<string>) => void,
      ) => callback({
        event: WS_EVENTS.requestCurrentTrack,
        payload: currentTrack && currentTrack.id || '',
      });
    
      const requestPlaybackStateHandler = (
        callback: (payload: types.SocketResponse<types.PlaybackStatePayload>) => void,
      ) => callback({
        event: WS_EVENTS.requestPlaybackState,
        payload: {
          isMuted,
          isPlaying,
          volume,
        },
      });
    
      const requestTracklistHandler = (
        callback: (payload: types.SocketResponse<types.Track[]>) => void,
      ) => callback({
        event: WS_EVENTS.requestTracklist,
        payload: tracklist,
      });

      if (connection && connection.connected) {
        log('register event listeners');
        connection.on(WS_EVENTS.requestCurrentTrack, requestCurrentTrackHandler);
        connection.on(WS_EVENTS.requestPlaybackState, requestPlaybackStateHandler);
        connection.on(WS_EVENTS.requestTracklist, requestTracklistHandler);
      }

      return () => {
        if (connection && connection.connected) {
          log('remove event listeners');
          connection.off(WS_EVENTS.requestCurrentTrack, requestCurrentTrackHandler);
          connection.off(WS_EVENTS.requestPlaybackState, requestPlaybackStateHandler);
          connection.off(WS_EVENTS.requestTracklist, requestTracklistHandler);
        }
      }
    },
    [
      connection,
      currentTrack,
      dispatch,
      isMuted,
      isPlaying,
      tracklist,
      volume,
    ],
  );

  return (
    <SocketContext.Provider value={{ connection, createConnection }}>
      { props.children }
    </SocketContext.Provider>
  );
};

export default SocketProvider;
