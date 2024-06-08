export type ChangeTrackTo = 'next' | 'previous';

type BaseWindow = Window & typeof globalThis;

export type ExtendedWindow = BaseWindow & {
  backend: {
    handleDrop: (files: string[]) => Promise<ParsedFile[]>;
    onAddFile: (callback: (entry: ParsedFile) => void) => void;
  },
}

export interface ParsedFile {
  fileIsAvailable: boolean;
  id: string;
  lengthSeconds: number;
  name: string;
  path: string;
  sizeBytes: number;
}
