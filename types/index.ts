export interface AudioStream {
  bitsPerSample: string | number;
  channelLayout: string;
  channels: number;
  sampleRate: number;
}

export type ChangeTrackTo = 'next' | 'previous';

type BaseWindow = Window & typeof globalThis;

export type ExtendedWindow = BaseWindow & {
  backend: {
    handleDrop: (files: string[]) => Promise<ParsedFile[]>;
    onAddFile: (callback: (entry: ParsedFile) => void) => void;
    onReceiveMetadata: (callback: (metadata: Metadata) => void) => void;
    requestMetadata: (path: string) => void;
  },
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
  metadata: Metadata | null;
  name: string;
  path: string;
  sizeBytes: number;
}
