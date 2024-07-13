import type { IAudioMetadata } from 'music-metadata';
import type { IpcRendererEvent } from 'electron';
import type WaveSurfer from 'wavesurfer.js';

export interface BaseIconProps {
  height?: number;
  iconColorBase?: string;
  iconColorHover?: string;
  isHovering?: boolean;
  title?: string;
  width?: number;
}

export type ChangeTrackTo = 'current' | 'next' | 'previous';

export type CurrentTrack = Track | null;

type BaseWindow = Window & typeof globalThis;

type Callback<T> = (
  event: IpcRendererEvent,
  payload: T,
) => void;

export interface CoverData {
  format?: string;
  objectURL?: string;
}

export type CustomAudioMetadata = Pick<IAudioMetadata, 'common' | 'format'> & {
  covers?: CoverData[];
};

export type ExtendedWindow = BaseWindow & {
  backend: {
    addFilesRequest: (payload: string[]) => void;
    addFilesResponse: (callback: Callback<Track>) => void;
    loadDefaultPlaylistRequest: () => void;
    loadDefaultPlaylistResponse: (callback: Callback<LoadDefaultPlaylistResponsePayload>) => void;
    loadFileRequest: (payload: LoadFileRequestPayload) => void;
    loadFileResponse: (callback: Callback<LoadFileResponsePayload>) => void;
    loadMetadataRequest: (payload: LoadMetadataRequestPayload) => void;
    loadMetadataResponse: (callback: Callback<LoadMetadataResponsePayload>) => void;
    openPlaylistRequest: () => void;
    openPlaylistResponse: (callback: Callback<OpenPlaylistResponsePayload>) => void;
    savePlaylistRequest: (payload: Track[]) => void;
    savePlaylistResponse: (callback: Callback<SavePlaylistResponsePayload>) => void;
    updateDefaultPlaylistRequest: (payload: Track[]) => void;
  },
}

export interface LoadDefaultPlaylistResponsePayload {
  playlist: Track[];
}

export interface LoadFileRequestPayload {
  id: string;
  path: string;
}

export interface LoadFileResponsePayload {
  buffer: Buffer | null;
  id: string;
  metadata: IAudioMetadata | null;
}

export interface LoadMetadataRequestPayload {
  id: string;
  path: string;
}

export interface LoadMetadataResponsePayload {
  error: Error | null;
  id: string;
  metadata: IAudioMetadata | null;
}

export interface OpenPlaylistResponsePayload {
  errorMessage: '' | 'cancelled' | 'emptyFile' | 'internalError' | 'invalidFormat';
  playlist: Track[] | null;
}

export interface Track {
  durationSeconds: number;
  id: string;
  isAccessible: boolean;
  name: string;
  path: string;
  withCover: boolean;
}

export interface TrackMetadata {
  id: string;
  metadata: CustomAudioMetadata;
}

export type SavePlaylistResponsePayload = 'cancelled' | 'internalError' | 'ok';

export type WaveSurferInstance = WaveSurfer | null;
