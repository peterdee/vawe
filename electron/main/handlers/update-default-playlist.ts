import { encode } from 'strencojs';
import { writeFile } from 'node:fs/promises';

import { DEFAULT_PLAYLIST_NAME } from '../../constants';
import type * as types from 'types';

export default function updateDefaultPlaylist(tracklist: types.Track[]): Promise<void> {
  return writeFile(
    `${process.cwd()}/${DEFAULT_PLAYLIST_NAME}`,
    encode(JSON.stringify({ value: tracklist })),
    {
      flush: true,
    }
  );
}
