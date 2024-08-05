import requestTracklist from '../handlers/request-tracklist';
import type * as types from 'types';
import { WS_EVENTS } from '../../../../constants';

export default function router(connection: types.ExtendedSocket) {
  connection.on(
    WS_EVENTS.requestTracklist,
    () => requestTracklist(connection),
  );
}
