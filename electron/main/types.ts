export interface ParsedFile {
  fileIsAccessible: boolean;
  id: string;
  lengthSeconds: number;
  name: string;
  path: string;
  sizeBytes: number;
}

export interface WorkerMessage<T = void> {
  event: string;
  value: T extends void ? undefined : T;
}
