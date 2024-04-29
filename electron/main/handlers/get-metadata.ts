import type { BrowserWindow } from 'electron';
import ffmpeg from 'fluent-ffmpeg';

import { ffprobePath } from '../../utilities/ffprobe-path';
import { IPC_EVENTS } from '../../constants';

ffmpeg.setFfprobePath(ffprobePath);

export default function getMetadata(path: string = '', browserWindow: BrowserWindow) {
  ffmpeg.ffprobe(
    path,
    (error: Error, metadata: ffmpeg.FfprobeData) => {
      if (error) {
        return browserWindow.webContents.send(
          IPC_EVENTS.handleReceiveMetadata,
          null,
        );
      }
      return browserWindow.webContents.send(
        IPC_EVENTS.handleReceiveMetadata,
        {
          bitrate: metadata.format.bit_rate || 0,
          durationSeconds: metadata.format.duration || 0,
          sizeBytes: metadata.format.size || 0,
          streams: metadata.streams.map((stream) => ({
            bitsPerSample: stream.bits_per_raw_sample || 0,
            channelLayout: stream.channelss_layout || '',
            channels: stream.channels || 0,
            sampleRate: stream.sample_rate || 0,
          })),
        },
      );
    },
  );
}
