import {
  basename, 
  extname,
  join,
} from 'node:path';
import type { BrowserWindow } from 'electron';
import { createId } from '@paralleldrive/cuid2';
import ffmpeg from 'fluent-ffmpeg';
import { readdir, stat } from 'node:fs/promises';

import { ffprobePath } from '../../utilities/ffprobe-path';
import { FORMATS, IPC_EVENTS } from '../../constants';

ffmpeg.setFfprobePath(ffprobePath);

function handleFile(
  filePath: string,
  name: string,
  browserWindow: BrowserWindow,
) {
  ffmpeg.ffprobe(
    filePath,
    (error: Error, metadata: ffmpeg.FfprobeData) => {
    if (!error) {
      browserWindow.webContents.send(
        IPC_EVENTS.handleAddFile,
        {
          fileIsAccessible: true,
          id: createId(),
          durationSeconds: metadata.format.duration || 0,
          name,
          path: filePath,
          sizeBytes: metadata.format.size || 0,
        },
      );
    }
  });
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
