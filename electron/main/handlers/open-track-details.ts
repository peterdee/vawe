import { BrowserWindow } from 'electron';
import path from 'node:path';

export default function openTrackDetails(
  detailsWindow: BrowserWindow | null,
  VITE_DEV_SERVER_URL: string | undefined,
  indexHtml: string,
  preload: string,
) {
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
}
