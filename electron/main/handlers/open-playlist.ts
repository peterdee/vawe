import { type BrowserWindow, dialog } from 'electron';
import { decode } from 'strencojs';
import { readFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import * as types from 'types';

export default async function openPlaylist(browserWindow: BrowserWindow): Promise<void> {
  const responsePayload: types.OpenPlaylistResponsePayload = {
    errorMessage: '',
    playlist: null,
  };

  try {
    const dialogResult = await dialog.showOpenDialog({
      title: 'Open VAWE playlist',
      buttonLabel: 'Open playlist',
      filters: [{ name: '', extensions: ['va'] }],
      properties: [
        'createDirectory',
        'dontAddToRecent',
      ],
    });

    if (dialogResult.canceled) {
      return browserWindow.webContents.send(
        IPC_EVENTS.openPlaylistResponse,
        'cancelled',
      );
    }
    if (!dialogResult.filePaths) {
      return browserWindow.webContents.send(
        IPC_EVENTS.openPlaylistResponse,
        'internalError',
      );
    }

    const encodedString = await readFile(
      '',
      { encoding: 'utf8' },
    );
    const playlist: { value: types.ParsedFile[] } = JSON.parse(decode(encodedString));
    responsePayload.playlist = playlist.value;
    return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
  } catch (error) {
    // TODO: check error type
    responsePayload.errorMessage = 'internalError';
    return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
  }
}
