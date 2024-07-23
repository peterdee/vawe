import { Menu, shell } from 'electron';

const isMac = process.platform === 'darwin';

export default function createMenuTemplate(): Menu {
  const template = [
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
          click: () => console.log('click'),
          label: 'Open playlist',
        },
        {
          click: () => console.log('click'),
          label: 'Save playlist',
        },
        { type: 'separator' },
        {
          click: () => console.log('click'),
          label: 'Shuffle playlist',
        },
        {
          click: () => console.log('click'),
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
            await shell.openExternal('https://github.com/peterdee/vawe/issues');
          },
          label: 'Report an issue',
        },
        {
          click: async () => {
            await shell.openExternal('https://github.com/peterdee/vawe');
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
