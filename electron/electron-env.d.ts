/// <reference types="vite-electron-plugin/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VSCODE_DEBUG?: 'true';
    VITE_PUBLIC: string;
  }
}
