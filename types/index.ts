import type { IpcRendererEvent } from 'electron';
import type WaveSurfer from 'wavesurfer.js';

export type WaveSurferInstance = WaveSurfer | null;

export interface AudioStream {
  bitsPerSample: string | number;
  channelLayout: string;
  channels: number;
  sampleRate: number;
}

export type ChangeTrackTo = 'current' | 'next' | 'previous';

export type CurrentTrack = ParsedFile | null;

type BaseWindow = Window & typeof globalThis;

export type ExtendedWindow = BaseWindow & {
  backend: {
    handleDrop: (files: string[]) => void;
    loadDefaultPlaylistRequest: () => void;
    loadDefaultPlaylistResponse: (callback: (
      event: IpcRendererEvent,
      payload: LoadDefaultPlaylistResponsePayload,
    ) => void) => void;
    loadFileRequest: (payload: LoadFileRequestPayload) => void;
    loadFileResponse: (callback: (payload: LoadFileResponsePayload) => void) => void;
    onAddFile: (callback: (event: IpcRendererEvent, entry: ParsedFile) => void) => void;
    onReceiveMetadata: (
      callback: ({ id, metadata }: { id: string, metadata: Metadata | null }) => void,
    ) => void;
    requestMetadata: (payload: RequestMetadataPayload) => void;
    updateDefaultPlaylistRequest: (payload: ParsedFile[]) => void;
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

export interface LoadDefaultPlaylistResponsePayload {
  playlist: ParsedFile[];
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
