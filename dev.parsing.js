import { availableParallelism } from 'node:os';
import { fork } from 'node:child_process';

const EVENT_NAMES = {
  foundFile: 'found-file',
  queuePath: 'queue-path',
  workerFinished: 'worker-finished',
};

const NUMBER_OF_WORKERS = availableParallelism();

// queue
const queue = [];

// files
const files = [];

// workers pool
const isFree = new Array(NUMBER_OF_WORKERS);
const workers = new Array(NUMBER_OF_WORKERS);

async function startParsing(initialPath = '') {
  const now = Date.now();
  const spawnWorkers = new Array(NUMBER_OF_WORKERS);
  for (let i = 0; i < NUMBER_OF_WORKERS; i += 1) {
    const worker = fork('./dev.worker.js');

    spawnWorkers[i] = new Promise((resolve) => {
      worker.on(
        'spawn',
        () => {
          isFree[i] = true;
          workers[i] = worker;
          return resolve();
        },
      );
    });

    worker.on(
      'message',
      (data) => {
        if (data.event) {
          switch (data.event) {
            case EVENT_NAMES.foundFile: {
              files.push(data.value);
              break;
            };
            case EVENT_NAMES.queuePath: {
              const freeWorker = isFree.indexOf(true);
              if (freeWorker >= 0) {
                isFree[freeWorker] = false;
                workers[freeWorker].send(data.value);
              } else {
                queue.push(data.value);
              }
              break;
            };
            default: {
              if (queue.length > 0) {
                workers[i].send(queue.shift());
              } else {
                isFree[i] = true;
                if (isFree.every((free) => free)) {
                  console.log('files found:', files.length);
                  console.log('time spent:', Date.now() - now);
                  process.exit(0);
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

startParsing('/Users/peter/Music');
