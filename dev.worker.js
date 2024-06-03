import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'node:path';
import { readdir, stat } from 'node:fs/promises';

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
          const stats = await stat(filePath);
          process.send({
            event: EVENT_NAMES.foundFile,
            value: {
              createdAt: stats.birthtimeMs,
              id: createId(),
              name: item.name,
              path: join(path, item.name),
              size: stats.size,
            },
          })
        }
        if (item.isDirectory()) {
          process.send({
            event: EVENT_NAMES.queuePath,
            value: join(path, item.name),
          })
        }
      }
  
      return process.send({ event: EVENT_NAMES.workerFinished });
    } catch {
      return process.send({ event: EVENT_NAMES.workerFinished });
    }
  },
);
