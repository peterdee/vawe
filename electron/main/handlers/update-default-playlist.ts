import type { BrowserWindow } from 'electron';
import { readFile } from 'node:fs/promises';

import {
  DEFAULT_PLAYLIST_NAME,
  IPC_EVENTS,
} from '../../constants';
import * as types from 'types';

export default async function updateDefaultPlaylist(
  tracklist: types.ParsedFile[],
  browserWindow: BrowserWindow,
) {
  const tracklistString = JSON.stringify({ value: tracklist });

  try {
    await writeFile(defaultPlaylistPath, { encoding: 'utf8' });
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
