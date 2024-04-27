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
    onReceiveMetadata: (
      callback: ({ id, metadata }: { id: string, metadata: Metadata | null }) => void,
    ) => void;
    requestMetadata: (payload: RequestMetadataPayload) => void;
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

export interface RequestMetadataPayload {
  id: string;
  path: string;
}
