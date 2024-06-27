import { dialog } from 'electron';
import { encode } from 'strencojs';

import * as types from 'types';

export default async function savePlaylist(playlist: types.ParsedFile[]): Promise<void> {
  const encodedPlaylist = encode(JSON.stringify({ value: playlist }));
  console.log(encodedPlaylist);
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
    console.log(dialogResult);
  } catch (error) {
    console.log('error', error);
  }
}
