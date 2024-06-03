import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static-electron';
import ffprobePath from 'ffprobe-static-electron';
import { readdir } from 'node:fs/promises';

import { EVENT_NAMES, FORMATS } from './common';

ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);

process.on(
  'message',
  async (path: string) => {
    if (!process.send) {
      return null;
    }

    try {
      const contents = await readdir(path, { withFileTypes: true });
      if (contents.length === 0) {
        return process.send({ event: EVENT_NAMES.workerFinished });
      }
  
      for (let item of contents) {  
        if (item.isFile()) {
          const filePath = join(path, item.name);
          const format = extname(filePath);
          if (!FORMATS.includes(format)) {
            continue;
          }

          const fileMetadata = await new Promise<ffmpeg.FfprobeData>(
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
              lengthSeconds: fileMetadata.format.duration || 0,
              name: item.name,
              path: join(path, item.name),
              sizeBytes: fileMetadata.format.size || 0,
            },
          });
        }
        if (item.isDirectory()) {
          process.send({
            event: EVENT_NAMES.queuePath,
            value: join(path, item.name),
          });
        }
      }
  
      return process.send({ event: EVENT_NAMES.workerFinished });
    } catch {
      return process.send({ event: EVENT_NAMES.workerFinished });
    }
  },
);
