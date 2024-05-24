export interface HandleFileDropParameters {
  directories: string[];
  files: string[];
}

export interface ParsedFile {
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
