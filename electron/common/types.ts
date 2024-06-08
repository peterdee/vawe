export interface AudioStream {
  bitsPerSample: string | number;
  channelLayout: string;
  channels: number;
  sampleRate: number;
}

export interface Metadata {
  bitrate: number;
  durationSeconds: number;
  sizeBytes: number;
  streams: AudioStream[];
}

export interface ParsedFile {
  durationSeconds: number;
  fileIsAccessible: boolean;
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
}
