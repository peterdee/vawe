export type ChangeTrackTo = 'next' | 'previous';

export interface FileEntry {
  addedAt: number;
  name: string;
  path: string;
  sizeBytes: number;
  type: string;
}

export interface PlaylistEntry extends FileEntry {
  fileIsAccessible: boolean;
  id: string;
  lengthSeconds: number;
}
