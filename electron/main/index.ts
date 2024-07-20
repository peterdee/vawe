import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
} from 'electron';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

import { IPC_EVENTS } from '../constants';
import loadDefaultPlaylist from './handlers/load-default-playlist';
import loadFile from './handlers/load-file';
import loadMetadata from './handlers/load-metadata';
import openPlaylist from './handlers/open-playlist';
import parseFiles from './handlers/parse-files';
import savePlaylist from './handlers/save-playlist';
import type * as types from 'types';
import updateDefaultPlaylist from './handlers/update-default-playlist';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    center: false,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    title: 'VAWE',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload,
    },
    width: 1200,
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);

    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  });
}

app.whenReady().then(() => {
  // add files
  ipcMain.handle(
    IPC_EVENTS.addFilesRequest,
    (_, payload: string[]) => parseFiles(payload, win as BrowserWindow),
  );
  // load default playlist
  ipcMain.handle(
    IPC_EVENTS.loadDefaultPlaylistRequest,
    () => loadDefaultPlaylist(win as BrowserWindow),
  );
  // load file
  ipcMain.handle(
    IPC_EVENTS.loadFileRequest,
    (_, payload: types.LoadFileRequestPayload) => loadFile(
      payload,
      win as BrowserWindow,
    ),
  );
  // load metadata
  ipcMain.handle(
    IPC_EVENTS.loadMetadataRequest,
    (_, payload: types.LoadMetadataRequestPayload) => loadMetadata(
      payload,
      win as BrowserWindow,
    ),
  );
  // open playlist
  ipcMain.handle(
    IPC_EVENTS.openPlaylistRequest,
    () => openPlaylist(win as BrowserWindow),
  );
  // save playlist
  ipcMain.handle(
    IPC_EVENTS.savePlaylistRequest,
    (_, payload: types.Track[]) => savePlaylist(payload, win as BrowserWindow),
  );
  // update default playlist
  ipcMain.handle(
    IPC_EVENTS.updateDefaultPlaylistRequest,
    (_, payload: types.Track[]) => updateDefaultPlaylist(payload),
  );

  createWindow();
});

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// open track details window
ipcMain.handle(
  IPC_EVENTS.openTrackDetails,
  () => {
    const detailsWindow = new BrowserWindow({
      height: 420,
      icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
      maxWidth: 688,
      minHeight: 420,
      minWidth: 688,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload,
      },
      width: 688,
    });

    if (VITE_DEV_SERVER_URL) {
      detailsWindow.loadURL(`${VITE_DEV_SERVER_URL}details`);
    } else {
      detailsWindow.loadFile(indexHtml, { hash: 'details' });
    }
  },
);
