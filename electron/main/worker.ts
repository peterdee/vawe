import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static-electron';
import ffprobePath from 'ffprobe-static-electron';
import { readdir, stat } from 'node:fs/promises';

import { EVENT_NAMES, FORMATS } from '../common';

ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);

async function handleFile(filePath: string): Promise<null | void> {
  if (!process.send) {
    return null;
  }
  const metadata = await new Promise<ffmpeg.FfprobeData>(
    (resolve, reject) => {
      ffmpeg.ffprobe(
        filePath,
        (error: Error, metadata: ffmpeg.FfprobeData) => {
          if (error) {
            return reject(error);
          }
          return resolve(metadata);
        },
      );
    },
  );
  process.send({
    event: EVENT_NAMES.foundFile,
    value: {
      id: createId(),
      lengthSeconds: metadata.format.duration || 0,
      name: metadata.format.filename,
      path: filePath,
      sizeBytes: metadata.format.size || 0,
    },
  });
}

process.on(
  'message',
  async (path: string) => {
    if (!process.send) {
      return null;
    }

    console.log('worker received data', path);
    try {
      const stats = await stat(path);

      if (stats.isFile() && FORMATS.includes(extname(path))) {
        await handleFile(path);
      }
      if (stats.isDirectory()) {
        const contents = await readdir(path, { withFileTypes: true });
        if (contents.length === 0) {
          return process.send({ event: EVENT_NAMES.workerFinished });
        }
        for (let item of contents) {
          const itemPath = join(path, item.name);
          if (item.isFile() && FORMATS.includes(extname(itemPath))) {
            await handleFile(itemPath);
          }
          if (item.isDirectory()) {
            process.send({
              event: EVENT_NAMES.queuePath,
              value: itemPath,
            });
          }
        }
      }
      return process.send({ event: EVENT_NAMES.workerFinished });
    } catch {
      return process.send({ event: EVENT_NAMES.workerFinished });
    }
  },
);
