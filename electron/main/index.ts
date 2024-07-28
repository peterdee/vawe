import {
  app,
  BrowserWindow,
  Menu,
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
import removeTrackFromPlaylist from './handlers/remove-track-from-playlist';
import savePlaylist from './handlers/save-playlist';
import type * as types from 'types';
import updateDefaultPlaylist from './handlers/update-default-playlist';
import createMenuTemplate from './menu';

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

let detailsWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  mainWindow = new BrowserWindow({
    center: false,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    minHeight: 600,
    minWidth: 600,
    title: 'VAWE',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload,
    },
    width: 1200,
  });

  Menu.setApplicationMenu(createMenuTemplate(mainWindow));

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);

    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtml);
  }

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  });
}

app.whenReady().then(() => {
  // add files
  ipcMain.handle(
    IPC_EVENTS.addFilesRequest,
    (_, payload: string[]) => parseFiles(payload, mainWindow as BrowserWindow),
  );
  // load default playlist
  ipcMain.handle(
    IPC_EVENTS.loadDefaultPlaylistRequest,
    () => loadDefaultPlaylist(mainWindow as BrowserWindow),
  );
  // load file
  ipcMain.handle(
    IPC_EVENTS.loadFileRequest,
    (_, payload: types.LoadFileRequestPayload) => loadFile(
      payload,
      mainWindow as BrowserWindow,
    ),
  );
  // load metadata
  ipcMain.handle(
    IPC_EVENTS.loadMetadataRequest,
    (_, payload: types.LoadMetadataRequestPayload) => loadMetadata(
      payload,
      mainWindow as BrowserWindow,
    ),
  );
  // open playlist
  ipcMain.handle(
    IPC_EVENTS.openPlaylistRequest,
    () => openPlaylist(mainWindow as BrowserWindow),
  );
  // remove track from playlist (from track details window)
  ipcMain.handle(
    IPC_EVENTS.removeTrackFromPlaylistRequest,
    (_, payload: string) => removeTrackFromPlaylist(payload, mainWindow as BrowserWindow),
  );
  // save playlist
  ipcMain.handle(
    IPC_EVENTS.savePlaylistRequest,
    (_, payload: types.Track[]) => savePlaylist(payload, mainWindow as BrowserWindow),
  );
  // update default playlist
  ipcMain.handle(
    IPC_EVENTS.updateDefaultPlaylistRequest,
    (_, payload: types.Track[]) => updateDefaultPlaylist(payload),
  );

  createWindow();
});

app.on('window-all-closed', () => {
  detailsWindow = null;
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
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
    detailsWindow = new BrowserWindow({
      height: 420,
      icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
      maxWidth: 688,
      minHeight: 420,
      minWidth: 688,
      title: 'VAWE',
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

    detailsWindow.on('closed', () => {
      detailsWindow = null;
    });
  },
);
