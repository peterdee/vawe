import type { BrowserWindow } from 'electron';
import { parseFile } from 'music-metadata';

import { IPC_ERROR_MESSAGES, IPC_EVENTS } from '../../constants';
import type * as types from 'types';

export default async function loadMetadata(
  payload: types.LoadMetadataRequestPayload,
  browserWindow: BrowserWindow,
) {
  const { id = '', path = '' } = payload;
  const responsePayload: types.LoadMetadataResponsePayload = {
    id,
    error: null,
    metadata: null,
  };
  if (!(id && path)) {
    responsePayload.error = new Error(IPC_ERROR_MESSAGES.missingRequiredParameters);
    return browserWindow.webContents.send(IPC_EVENTS.loadMetadataResponse, responsePayload);
  }
  try {
    responsePayload.metadata = await parseFile(path);
    return browserWindow.webContents.send(IPC_EVENTS.loadMetadataResponse, responsePayload);
  } catch (error) {
    responsePayload.error = error as Error;
    return browserWindow.webContents.send(IPC_EVENTS.loadMetadataResponse, responsePayload);
  }
}
