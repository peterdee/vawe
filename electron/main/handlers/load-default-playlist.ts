import type { BrowserWindow } from 'electron';
import { decode } from 'strencojs';
import { readFile } from 'node:fs/promises';

import {
  DEFAULT_PLAYLIST_NAME,
  IPC_EVENTS,
} from '../../constants';
import * as types from 'types';

export default async function loadDefaultPlaylist(browserWindow: BrowserWindow) {
  try {
    const encodedString = await readFile(
      `${process.cwd()}/${DEFAULT_PLAYLIST_NAME}`,
      { encoding: 'utf8' },
    );
    const playlist: { value: types.ParsedFile[] } = JSON.parse(decode(encodedString));
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      { playlist: playlist.value },
    );
  } catch {
    return browserWindow.webContents.send(
      IPC_EVENTS.loadDefaultPlaylistResponse,
      { playlist: [] },
    );
  }
}
