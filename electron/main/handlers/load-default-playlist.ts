import type { BrowserWindow } from 'electron';
import { decode } from 'strencojs';
import { readFile } from 'node:fs/promises';

import {
  DEFAULT_PLAYLIST_NAME,
  IPC_EVENTS,
} from '../../../constants';
import type * as types from 'types';

export default async function loadDefaultPlaylist(browserWindow: BrowserWindow) {
  const responsePayload: types.LoadDefaultPlaylistResponsePayload = {
    playlist: [],
  };
  try {
    // TODO: default playlist path may be different after the build
    const encodedString = await readFile(
      `${process.cwd()}/${DEFAULT_PLAYLIST_NAME}`,
      { encoding: 'utf8' },
    );
    const playlist: { value: types.Track[] } = JSON.parse(decode(encodedString));
    responsePayload.playlist = playlist.value;
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      responsePayload,
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      responsePayload,
    );
  }
}
