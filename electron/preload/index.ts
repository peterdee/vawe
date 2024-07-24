import {
  contextBridge,
  ipcRenderer,
  type IpcRendererEvent,
} from 'electron';

import { IPC_EVENTS } from '../constants';
import type * as types from 'types';

// VAWE
contextBridge.exposeInMainWorld(
  'backend',
  {
    // add files
    addFilesRequest(payload: string[]) {
      ipcRenderer.invoke(IPC_EVENTS.addFilesRequest, payload);
    },
    addFilesResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.Track,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.addFilesResponse, callback);
    },
    // load default playlist
    loadDefaultPlaylistRequest() {
      ipcRenderer.invoke(IPC_EVENTS.loadDefaultPlaylistRequest);
    },
    loadDefaultPlaylistResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.LoadDefaultPlaylistResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.loadDefaultPlaylistResponse, callback);
    },
    // load file
    loadFileRequest(payload: types.LoadFileRequestPayload) {
      return ipcRenderer.invoke(IPC_EVENTS.loadFileRequest, payload);
    },
    loadFileResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.LoadFileResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.loadFileResponse, callback);
    },
    // load metadata
    loadMetadataRequest(payload: string) {
      ipcRenderer.invoke(IPC_EVENTS.loadMetadataRequest, payload);
    },
    loadMetadataResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.LoadMetadataResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.loadMetadataResponse, callback);
    },
    // menu bar actions
    menuClearPlaylistRequest(callback: () => void) {
      ipcRenderer.on(IPC_EVENTS.menuClearPlaylistRequest, callback);
    },
    menuSavePlaylistRequest(callback: () => void) {
      ipcRenderer.on(IPC_EVENTS.menuShufflePlaylistRequest, callback);
    },
    menuShufflePlaylistRequest(callback: () => void) {
      ipcRenderer.on(IPC_EVENTS.menuShufflePlaylistRequest, callback);
    },
    // open playlist via dialog window
    openPlaylistRequest() {
      ipcRenderer.invoke(IPC_EVENTS.openPlaylistRequest);
    },
    openPlaylistResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.OpenPlaylistResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.openPlaylistResponse, callback);
    },
    // open track details in a separate window
    openTrackDetails() {
      ipcRenderer.invoke(IPC_EVENTS.openTrackDetails);
    },
    // save playlist via dialog window
    savePlaylistRequest(payload: types.Track[]) {
      ipcRenderer.invoke(IPC_EVENTS.savePlaylistRequest, payload);
    },
    savePlaylistResponse(
      callback: (
        event: IpcRendererEvent,
        payload: types.SavePlaylistResponsePayload,
      ) => void,
    ) {
      ipcRenderer.on(IPC_EVENTS.savePlaylistResponse, callback);
    },
    // update default playlist
    updateDefaultPlaylistRequest(payload: types.Track[]) {
      ipcRenderer.invoke(IPC_EVENTS.updateDefaultPlaylistRequest, payload);
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
