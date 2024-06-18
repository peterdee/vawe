import type WaveSurfer from 'wavesurfer.js';

export type WaveSurferInstance = WaveSurfer;

export interface AudioStream {
  bitsPerSample: string | number;
  channelLayout: string;
  channels: number;
  sampleRate: number;
}

export type ChangeTrackTo = 'next' | 'previous';

export type CurrentTrack = (ParsedFile & { objectUrl: string }) | null;

type BaseWindow = Window & typeof globalThis;

export type ExtendedWindow = BaseWindow & {
  backend: {
    handleDrop: (files: string[]) => void;
    loadFileRequest: (payload: LoadFileRequestPayload) => void;
    loadFileResponse: (callback: (payload: LoadFileResponsePayload) => void) => void;
    onAddFile: (callback: (entry: ParsedFile) => void) => void;
    onReceiveMetadata: (
      callback: ({ id, metadata }: { id: string, metadata: Metadata | null }) => void,
    ) => void;
    requestMetadata: (payload: RequestMetadataPayload) => void;
  },
}

export interface LoadFileRequestPayload {
  id: string;
  path: string;
}

export interface LoadFileResponsePayload {
  buffer: Buffer | null;
  id: string;
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
