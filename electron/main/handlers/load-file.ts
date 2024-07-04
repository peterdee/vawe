import type { BrowserWindow } from 'electron';
import { parseFile } from 'music-metadata';
import { readFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import type * as types from 'types';

export default async function loadFile(
  payload: types.LoadFileRequestPayload,
  browserWindow: BrowserWindow,
) {
  const {
    id = '',
    path = '',
  } = payload;

  const responsePayload: types.LoadFileResponsePayload = {
    buffer: null,
    id,
    metadata: null,
  };

  if (!(id && path)) {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      responsePayload,
    );
  }

  try {
    responsePayload.buffer = await readFile(path);
    responsePayload.metadata = await parseFile(path);
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      responsePayload,
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      responsePayload,
    );
  }
}
