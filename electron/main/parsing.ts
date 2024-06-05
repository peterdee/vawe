import { availableParallelism } from 'node:os';
import type { BrowserWindow } from 'electron';
import { fork, type ChildProcess } from 'node:child_process';
import { join } from 'path';

import { EVENT_NAMES, RENDERER_EVENTS } from '../common';
import type {
  ParsedFile,
  WorkerMessage,
} from '../common/types';

const NUMBER_OF_WORKERS = availableParallelism();

const queue: string[] = [];

const files: ParsedFile[] = [];

const isFree: boolean[] = new Array(NUMBER_OF_WORKERS);
const workers: ChildProcess[] = new Array(NUMBER_OF_WORKERS);

export default async function parseDroppedFiles(
  fileList: string[],
  browserWindow: BrowserWindow,
): Promise<void> {
  const spawnWorkers: Promise<boolean>[] = new Array(NUMBER_OF_WORKERS);
  for (let i = 0; i < NUMBER_OF_WORKERS; i += 1) {
    const worker = fork(join(__dirname, 'worker.js'));

    spawnWorkers[i] = new Promise<boolean>((resolve) => {
      worker.on(
        'spawn',
        () => {
          isFree[i] = true;
          workers[i] = worker;
          resolve(true);
        },
      );
    });

    worker.on(
      'message',
      (data: WorkerMessage<unknown>) => {
        if (data.event) {
          switch (data.event) {
            case EVENT_NAMES.foundFile: {
              const typedData = data as WorkerMessage<ParsedFile>;
              browserWindow.webContents.send(RENDERER_EVENTS.handleAddFile, typedData.value);
              break;
            };
            case EVENT_NAMES.queuePath: {
              const typedData = data as WorkerMessage<string>;
              const freeWorker = isFree.indexOf(true);
              if (freeWorker >= 0) {
                isFree[freeWorker] = false;
                workers[freeWorker].send(typedData.value);
              } else {
                queue.push(typedData.value);
              }
              break;
            };
            default: {
              if (queue.length > 0) {
                workers[i].send(queue.shift() as string);
              } else {
                isFree[i] = true;
                if (isFree.every((free) => free)) {
                  workers.forEach((worker) => {
                    worker.kill();
                  });
                }
              }
            };
          }
        }
      },
    );
  }
  await Promise.all(spawnWorkers);

  for (let path of fileList) {
    queue.push(path);
  }

  console.log(fileList);
  if (queue.length > 0) {
    const limit = queue.length > NUMBER_OF_WORKERS
      ? NUMBER_OF_WORKERS
      : queue.length;
    for (let i = 0; i < limit; i += 1) {
      isFree[i] = false;
      workers[i].send(queue[i]);
    }
  }
}
