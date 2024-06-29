import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
} from 'electron';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

import getMetadata from './handlers/get-metadata';
import { IPC_EVENTS } from '../constants';
import loadDefaultPlaylist from './handlers/load-default-playlist';
import loadFile from './handlers/load-file';
import openPlaylist from './handlers/open-playlist';
import parseFiles from './handlers/parse-files';
import savePlaylist from './handlers/save-playlist';
import * as types from 'types';
import { update } from './update'
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
    title: 'VAWE',
    center: false,
    height: 800,
    width: 1200,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      nodeIntegration: false,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      contextIsolation: true,
      // sandbox: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(() => {
  // parse dropped files
  ipcMain.handle(
    IPC_EVENTS.handleDrop,
    (_, payload: string[]) => parseFiles(payload, win as BrowserWindow),
  );
  // get audio file metadata
  ipcMain.handle(
    IPC_EVENTS.handleRequestMetadata,
    (_, payload: types.RequestMetadataPayload) => getMetadata(
      payload,
      win as BrowserWindow,
    ),
  );
  // get default playlist
  ipcMain.handle(
    IPC_EVENTS.loadDefaultPlaylistRequest,
    () => loadDefaultPlaylist(win as BrowserWindow),
  );
  // get audio file
  ipcMain.handle(
    IPC_EVENTS.loadFileRequest,
    (_, payload: types.LoadFileRequestPayload) => loadFile(
      payload,
      win as BrowserWindow,
    ),
  );
  // open playlist
  ipcMain.handle(IPC_EVENTS.openPlaylistRequest, () => openPlaylist(win as BrowserWindow));
  // save playlist
  ipcMain.handle(
    IPC_EVENTS.savePlaylistRequest,
    (_, payload: types.ParsedFile[]) => savePlaylist(payload, win as BrowserWindow),
  );
  // update default playlist
  ipcMain.handle(
    IPC_EVENTS.updateDefaultPlaylistRequest,
    (_, payload: types.ParsedFile[]) => updateDefaultPlaylist(payload),
  );

  createWindow();
});

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
