import { type BrowserWindow, dialog } from 'electron';
import { encode } from 'strencojs';
import { writeFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import type * as types from 'types';

export default async function savePlaylist(
  payload: types.Track[],
  browserWindow: BrowserWindow,
): Promise<void> {
  try {
    const dialogResult = await dialog.showSaveDialog(
      browserWindow,
      {
        buttonLabel: 'Save playlist',
        filters: [{ name: '', extensions: ['va'] }],
        properties: [
          'createDirectory',
          'dontAddToRecent',
          'showOverwriteConfirmation',
        ],
        title: 'Save VAWE playlist',
      },
    );

    if (dialogResult.canceled) {
      return browserWindow.webContents.send(
        IPC_EVENTS.savePlaylistResponse,
        'cancelled',
      );
    }
    if (!dialogResult.filePath) {
      return browserWindow.webContents.send(
        IPC_EVENTS.savePlaylistResponse,
        'internalError',
      );
    }

    await writeFile(
      dialogResult.filePath,
      encode(JSON.stringify({ value: payload })),
      {
        flush: true,
      }
    );

    return browserWindow.webContents.send(
      IPC_EVENTS.savePlaylistResponse,
      'ok',
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.savePlaylistResponse,
      'internalError',
    );
  }
}
