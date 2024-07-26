import { type BrowserWindow, dialog } from 'electron';

import parseFiles from './parse-files';

export default async function menuAddFiles(browserWindow: BrowserWindow) {
  try {
    const dialogResult = await dialog.showOpenDialog(
      browserWindow,
      {
        buttonLabel: 'Add',
        message: 'Select files and directories that will be added to the playlist',
        properties: [
          'dontAddToRecent',
          'multiSelections',
          'openDirectory',
          'openFile',
        ],
        title: 'Add files and directories',
      },
    );
    if (dialogResult.canceled) {
      return null;
    }
    return parseFiles(dialogResult.filePaths, browserWindow);
  } catch {
    return null;
  }
}
