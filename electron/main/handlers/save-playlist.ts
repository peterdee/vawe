import { type BrowserWindow, dialog } from 'electron';
import { encode } from 'strencojs';
import { writeFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import * as types from 'types';

export default async function savePlaylist(
  payload: types.ParsedFile[],
  browserWindow: BrowserWindow,
): Promise<void> {
  const encodedPlaylist = encode(JSON.stringify({ value: payload }));

  try {
    const dialogResult = await dialog.showSaveDialog({
      title: 'Save VAWE playlist',
      buttonLabel: 'Save playlist',
      filters: [{ name: '', extensions: ['va'] }],
      properties: [
        'createDirectory',
        'dontAddToRecent',
        'showOverwriteConfirmation',
      ],
    });

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
      encodedPlaylist,
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
