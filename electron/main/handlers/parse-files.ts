import {
  basename, 
  extname,
  join,
} from 'node:path';
import type { BrowserWindow } from 'electron';
import { createId } from '@paralleldrive/cuid2';
import { parseFile } from 'music-metadata';
import { readdir, stat } from 'node:fs/promises';
import type * as types from 'types';

import { FORMATS, IPC_EVENTS } from '../../constants';

async function handleFile(
  filePath: string,
  name: string,
  browserWindow: BrowserWindow,
) {
  const metadata = await parseFile(
    filePath,
    {
      duration: true,
    },
  );

  let trackName = name;
  if (metadata.common.title) {
    trackName = metadata.common.title;
    if (metadata.common.artist) {
      trackName = `${metadata.common.artist} - ${trackName}`;
    }
  }

  const responsePayload: types.Track = {
    durationSeconds: metadata.format.duration || 0,
    id: createId(),
    isAccessible: true,
    name: trackName,
    path: filePath,
    withCover: (metadata.common.picture && metadata.common.picture.length > 0) || false,
  };
  return browserWindow.webContents.send(IPC_EVENTS.addFilesResponse, responsePayload);
}

async function handlePath(
  path: string = '',
  browserWindow: BrowserWindow,
): Promise<null | void> {
  try {
    const stats = await stat(path);
    if (stats.isFile() && FORMATS.includes(extname(path))) {
      setTimeout(() => handleFile(path, basename(path), browserWindow));
    }
    if (stats.isDirectory()) {
      const contents = await readdir(path);
      for (const item of contents) {
        setTimeout(() => handlePath(join(path, item), browserWindow));
      }
    }
  } catch {
    return null;
  }
}

export default function parseFiles(
  paths: string[],
  browserWindow: BrowserWindow,
) {
  for (const path of paths) {
    handlePath(path, browserWindow);
  }
}
