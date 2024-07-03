import type { BrowserWindow } from 'electron';
import { parseFile } from 'music-metadata';
import { readFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import type {
  LoadFileRequestPayload,
  LoadFileResponsePayload,
} from 'types';

export default async function loadFile(
  payload: LoadFileRequestPayload,
  browserWindow: BrowserWindow,
) {
  const {
    id = '',
    path = '',
  } = payload;

  const responsePayload: LoadFileResponsePayload = {
    buffer: null,
    id,
  };

  if (!(id && path)) {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      responsePayload,
    );
  }

  try {
    responsePayload.buffer = await readFile(path);
    const res = await parseFile(path);
    console.log(JSON.stringify(res));
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
