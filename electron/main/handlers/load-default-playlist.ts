import type { BrowserWindow } from 'electron';
import { readFile } from 'node:fs/promises';

import {
  DEFAULT_PLAYLIST_NAME,
  IPC_EVENTS,
} from '../../constants';

export default async function loadDefaultPlaylist(browserWindow: BrowserWindow) {
  const defaultPlaylistPath = `${process.cwd()}/${DEFAULT_PLAYLIST_NAME}`;

  try {
    const playlist = await readFile(defaultPlaylistPath, { encoding: 'utf8' });
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      { playlist },
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      {
        playlist: '',
      },
    );
  }
}
