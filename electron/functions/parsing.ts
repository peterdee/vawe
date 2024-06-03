import { availableParallelism } from 'node:os';
import { fork, type ChildProcess } from 'node:child_process';

import { EVENT_NAMES } from './common';
import type { ParsedFile, WorkerMessage } from './types';

const NUMBER_OF_WORKERS = availableParallelism();

const queue: string[] = [];

const files: ParsedFile[] = [];

const isFree: boolean[] = new Array(NUMBER_OF_WORKERS);
const workers: ChildProcess[] = new Array(NUMBER_OF_WORKERS);

async function parseDirectory(initialPath = '') {
  const spawnWorkers: Promise<boolean>[] = new Array(NUMBER_OF_WORKERS);
  for (let i = 0; i < NUMBER_OF_WORKERS; i += 1) {
    const worker = fork('./parsing-worker.js');

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
              files.push(typedData.value);
              break;
            };
            case EVENT_NAMES.queuePath: {
              const freeWorker = isFree.indexOf(true);
              const typedData = data as WorkerMessage<string>;
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

  isFree[0] = false;
  workers[0].send(initialPath);
}

parseDirectory('/Users/peter/Music');
