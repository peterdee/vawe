import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../store';
import log from '../utilities/logger';
import { WS_EVENTS } from '../../constants';

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
  const dispatch = useDispatch<AppDispatch>();
  const [connection, setConnection] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const serverAddress = useSelector<RootState, string>(
    (state) => state.appSettings.serverAddress,
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
      if (connection && connection.connected) {
        log('register event listeners');
      }

      return () => {
        if (connection && connection.connected) {
          log('remove event listeners');
        }
      }
    },
    [
      connection,
      dispatch,
    ],
  );

  return (
    <SocketContext.Provider value={{ connection, createConnection }}>
      { props.children }
    </SocketContext.Provider>
  );
};

export default SocketProvider;
