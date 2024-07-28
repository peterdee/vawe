import type { BrowserWindow } from 'electron';

import { IPC_EVENTS } from '../../constants';

export default function removeTrackFromPlaylist(
  id: string,
  browserWindow: BrowserWindow,
) {
  return browserWindow.webContents.send(IPC_EVENTS.removeTrackFromPlaylistResponse, id);
}
