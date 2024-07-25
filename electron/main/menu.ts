import {
  type BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
  shell,
} from 'electron';

import { EXTERNAL_LINKS, IPC_EVENTS } from '../constants';
import openPlaylist from './handlers/open-playlist';

const isMac = process.platform === 'darwin';

export default function createMenuTemplate(browserWindow: BrowserWindow): Menu {
  const template: MenuItemConstructorOptions[] = [
    {
      accelerator: 'Ctrl+F',
      label: 'File',
      submenu: [
        {
          click: () => console.log('click'),
          label: 'Add files and directories',
        },
        { type: 'separator' },
        { role: isMac
          ? 'close'
          : 'quit',
        },
      ],
    },
    {
      accelerator: 'Ctrl+P',
      label: 'Playlist',
      submenu: [
        {
          click: () => openPlaylist(browserWindow),
          label: 'Open playlist',
        },
        {
          click: () => browserWindow.webContents.send(
            IPC_EVENTS.menuSavePlaylistRequest,
          ),
          label: 'Save playlist',
        },
        { type: 'separator' },
        {
          click: () => browserWindow.webContents.send(
            IPC_EVENTS.menuShufflePlaylistRequest,
          ),
          label: 'Shuffle playlist',
        },
        {
          click: () => browserWindow.webContents.send(
            IPC_EVENTS.menuClearPlaylistRequest,
          ),
          label: 'Clear playlist',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: isMac
        ? [
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        ]
        : [
          { role: 'minimize' },
          { role: 'zoom' },
          { role: 'close' },
        ],
    },
    {
      role: 'help',
      submenu: [
        {
          click: async () => {
            await shell.openExternal(EXTERNAL_LINKS.menuReportIssue);
          },
          label: 'Report an issue',
        },
        {
          click: async () => {
            await shell.openExternal(EXTERNAL_LINKS.menuSourceCode);
          },
          label: 'View source code',
        },
      ],
    }
  ];

  if (isMac) {
    template.unshift({
      label: 'VAWE',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  return Menu.buildFromTemplate(template);
}
