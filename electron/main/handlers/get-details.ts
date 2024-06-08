import ffmpeg from 'fluent-ffmpeg';
import { join } from 'node:path';
import os from 'node:os';

import type { AudioStream, Metadata } from "../../common/types";

// ffprobe path for development
const binaryName = `ffprobe${os.platform() === 'win32' ? '.exe' : ''}`;
ffmpeg.setFfprobePath(join(
  process.cwd(),
  `./bin/${os.platform()}/${binaryName}`,
));

export default async function getDetails(path: string = ''): Promise<Metadata | null> {
  try {
    const metadata = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
      ffmpeg.ffprobe(
        path,
        (error: Error, metadata: ffmpeg.FfprobeData) => {
          if (error) {
            reject(error);
          } else {
            resolve(metadata);
          }
        },
      );
    });
    return {
      bitrate: metadata.format.bit_rate || 0,
      durationSeconds: metadata.format.duration || 0,
      sizeBytes: metadata.format.size || 0,
      streams: metadata.streams.map((stream) => ({
        bitsPerSample: stream.bits_per_raw_sample || 0,
        channelLayout: stream.channelss_layout || '',
        channels: stream.channels || 0,
        sampleRate: stream.sample_rate || 0,
      })),
    }
  } catch {
    return null;
  }
}
