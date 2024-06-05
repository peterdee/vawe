import { availableParallelism } from 'node:os';
import { fork, type ChildProcess } from 'node:child_process';
import { join } from 'path';

import { EVENT_NAMES } from '../common';
import type {
  ParsedFile,
  WorkerMessage,
} from './types';

const NUMBER_OF_WORKERS = availableParallelism();

const queue: string[] = [];

const files: ParsedFile[] = [];

const isFree: boolean[] = new Array(NUMBER_OF_WORKERS);
const workers: ChildProcess[] = new Array(NUMBER_OF_WORKERS);

// import { dirname } from 'path';
// import { fileURLToPath } from 'url';
    
// const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function parseDroppedFiles(fileList: File[]): Promise<void> {
  console.log(__dirname);
  const spawnWorkers: Promise<boolean>[] = new Array(NUMBER_OF_WORKERS);
  for (let i = 0; i < NUMBER_OF_WORKERS; i += 1) {
    const worker = fork(join(__dirname, 'parsing-worker.js'));
    console.log('forked worker', i);
    spawnWorkers[i] = new Promise<boolean>((resolve) => {
      worker.on(
        'spawn',
        () => {
          console.log('spawned worker', i);
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
              files.push(typedData.value);
              console.log('found file', typedData.value.name);
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
                  // TODO: return array of files
                  console.log('done');
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

  for (let file of fileList) {
    queue.push(file.path);
  }

  if (queue.length > 0) {
    const limit = queue.length > NUMBER_OF_WORKERS
      ? NUMBER_OF_WORKERS
      : queue.length;
    console.log('limit', limit)
    for (let i = 0; i < limit; i += 1) {
      isFree[i] = false;
      workers[i].send(queue[i]);
      console.log('sent data', queue[i]);
    }
  }
}
