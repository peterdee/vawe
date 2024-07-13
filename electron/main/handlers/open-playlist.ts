import { type BrowserWindow, dialog } from 'electron';
import { decode } from 'strencojs';
import { readFile } from 'node:fs/promises';

import { IPC_EVENTS } from '../../constants';
import type * as types from 'types';

export default async function openPlaylist(browserWindow: BrowserWindow): Promise<void> {
  const responsePayload: types.OpenPlaylistResponsePayload = {
    errorMessage: '',
    playlist: null,
  };

  try {
    const dialogResult = await dialog.showOpenDialog(
      browserWindow,
      {
        buttonLabel: 'Open selected playlist',
        filters: [{ name: '', extensions: ['va'] }],
        message: 'Select a playlist to open',
        properties: [
          'openFile',
          'dontAddToRecent',
        ],
        title: 'Open VAWE playlist',
      },
    );

    if (dialogResult.canceled) {
      responsePayload.errorMessage = 'cancelled';
      return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
    }
    if (dialogResult.filePaths.length === 0) {
      responsePayload.errorMessage = 'internalError';
      return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
    }

    const [path = ''] = dialogResult.filePaths;
    const encodedString = await readFile(path, { encoding: 'utf8' });

    const playlist: { value: types.Track[] } = JSON.parse(decode(encodedString));
    responsePayload.playlist = playlist.value;
    return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
  } catch (error) {
    const typedError = error as Error;
    if (typedError.message.toLowerCase().includes('provided string is empty')) {
      responsePayload.errorMessage = 'emptyFile';
      return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
    }
    if (typedError.message.toLowerCase().includes('invalid string format')) {
      responsePayload.errorMessage = 'invalidFormat';
      return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
    }
    responsePayload.errorMessage = 'internalError';
    return browserWindow.webContents.send(IPC_EVENTS.openPlaylistResponse, responsePayload);
  }
}
