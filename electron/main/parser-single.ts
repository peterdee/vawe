import {
  basename, 
  extname,
  join,
} from 'node:path';
import type { BrowserWindow } from 'electron';
import { createId } from '@paralleldrive/cuid2';
import ffmpeg from 'fluent-ffmpeg';
import os from 'node:os';
import { readdir, stat } from 'node:fs/promises';

import { FORMATS, RENDERER_EVENTS } from '../common';

// ffprobe path for development
const platformDirectory = os.platform() === 'darwin' ? 'mac' : os.platform();
const binaryName = `ffprobe${platformDirectory === 'win32' ? '.exe' : ''}`;
ffmpeg.setFfprobePath(join(
  process.cwd(),
  `./ffprobe/${platformDirectory}/${binaryName}`,
));

function handleFile(
  filePath: string,
  name: string,
  browserWindow: BrowserWindow,
) {
  return ffmpeg.ffprobe(
    filePath,
    (error: Error, metadata: ffmpeg.FfprobeData) => {
    if (!error) {
      browserWindow.webContents.send(
        RENDERER_EVENTS.handleAddFile,
        {
          fileIsAccessible: true,
          id: createId(),
          lengthSeconds: metadata.format.duration || 0,
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
      for (let item of contents) {
        setTimeout(() => handlePath(join(path, item), browserWindow));
      }
    }
  } catch {
    return null;
  }
}

export default function parser(
  paths: string[],
  browserWindow: BrowserWindow,
) {
  for (let path of paths) {
    handlePath(path, browserWindow);
  }
}
