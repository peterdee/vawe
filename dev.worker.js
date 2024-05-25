import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static-electron';
import ffprobePath from 'ffprobe-static-electron';
import { readdir } from 'node:fs/promises';

ffmpeg.setFfprobePath(ffprobePath.path);
ffmpeg.setFfmpegPath(ffmpegPath.path);

const EVENT_NAMES = {
  foundFile: 'found-file',
  queuePath: 'queue-path',
  workerFinished: 'worker-finished',
};

const FORMATS = ['.flac', '.mp3', '.wav'];

process.on(
  'message',
  async (path = '') => {
    /** @type {import('fs').Dirent[]} */
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

          /** @type {import('fluent-ffmpeg').FfprobeData} */
          const fileMetadata = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(
              filePath,
              (error, metadata) => {
                if (error) {
                  return reject(error);
                }
                return resolve(metadata);
              },
            );
          });

          console.log(fileMetadata.format);
 
          process.send({
            event: EVENT_NAMES.foundFile,
            value: {
              id: createId(),
              lengthSeconds: fileMetadata.format.duration,
              name: item.name,
              path: join(path, item.name),
              sizeBytes: fileMetadata.format.size,
            },
          })
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