export type ChangeTrackTo = 'next' | 'previous';

type BaseWindow = Window & typeof globalThis;

export type ExtendedWindow = BaseWindow & {
  backend: {
    handleDrop: (files: File[]) => Promise<ParsedFile[]>;
  },
}

export interface ParsedFile {
  id: string;
  lengthSeconds: number;
  name: string;
  path: string;
  sizeBytes: number;
}

export interface PlaylistEntry extends ParsedFile {
  fileIsAccessible: boolean;
}
