import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

async function parseDirectory(path = '') {
  const contents = await readdir(path, { withFileTypes: true });
  if (contents.length === 0) {
    return null;
  }

  for (let item of contents) {
    if (item.name === 'node_modules') {
      continue;
    }
    if (item.isFile()) {
      console.log('got file', item.name, 'in', path);
    } else {
      parseDirectory(join(path, item.name));
    }
  }
}

parseDirectory('');
