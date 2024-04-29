import { join } from 'node:path';
import os from 'node:os';

export const binaryName = `ffprobe${os.platform() === 'win32' ? '.exe' : ''}`;

// ffprobe path for development
// TODO: path for build
export const ffprobePath = join(
  process.cwd(),
  `./bin/${os.platform()}/${binaryName}`,
);
