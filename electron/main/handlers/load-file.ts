import type { BrowserWindow } from 'electron';
import { readFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import type { LoadFileRequestPayload } from 'types';

export default async function loadFile(
  payload: LoadFileRequestPayload,
  browserWindow: BrowserWindow,
) {
  const {
    id = '',
    path = '',
  } = payload;
  if (!(id && path)) {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      {
        blob: null,
        id,
      },
    );
  }

  try {
    const file = await readFile(path);
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      {
        blob: new Blob([file]),
        id,
      },
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadFileResponse,
      {
        blob: null,
        id,
      },
    );
  }
}
