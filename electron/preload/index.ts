import {
  contextBridge,
  ipcRenderer,
  type IpcRendererEvent,
} from 'electron';

import { IPC_EVENTS } from '../constants';
import * as types from 'types';

// VAWE
contextBridge.exposeInMainWorld(
  'backend',
  {
    // handle file drop: parse dropped items
    handleDrop(filePaths: string[]): Promise<any> {
      return ipcRenderer.invoke(IPC_EVENTS.handleDrop, filePaths);
    },
    // request default playlist loading
    loadDefaultPlaylistRequest(): Promise<any> {
      return ipcRenderer.invoke(IPC_EVENTS.loadDefaultPlaylistRequest);
    },
    // pass default playlist to renderer
    loadDefaultPlaylistResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.LoadDefaultPlaylistResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.loadFileResponse, callback);
    },
    // request file data as Blob
    loadFileRequest(payload: types.LoadFileRequestPayload): Promise<any> {
      return ipcRenderer.invoke(IPC_EVENTS.loadFileRequest, payload);
    },
    // pass requested file data to renderer
    loadFileResponse(callback: ((payload: types.LoadFileResponsePayload) => void)) {
      ipcRenderer.on(
        IPC_EVENTS.loadFileResponse,
        (_, value: types.LoadFileResponsePayload) => callback(value),
      );
    },
    // handle adding file to the playlist
    onAddFile(callback: ((event: IpcRendererEvent, entry: types.ParsedFile) => void)) {
      ipcRenderer.on(IPC_EVENTS.handleAddFile, callback);
    },
    // receive audio file metadata
    onReceiveMetadata(callback: ((metadata: types.Metadata) => void)) {
      ipcRenderer.on(
        IPC_EVENTS.handleReceiveMetadata,
        (_, value: types.Metadata) => callback(value),
      );
    },
    // request audio file metadata
    requestMetadata(path: string): Promise<any> {
      return ipcRenderer.invoke(IPC_EVENTS.handleRequestMetadata, path);
    },
  },
);

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
});

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
