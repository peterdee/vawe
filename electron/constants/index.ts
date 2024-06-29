export const DEFAULT_PLAYLIST_NAME = 'vawe-default.va';

export const FORMATS = ['.flac', '.mp3', '.wav'];

export const IPC_EVENTS = {
  handleAddFile: 'handle:addFile',
  handleDrop: 'handle:drop',
  handleRequestMetadata: 'handle:requestMetadata',
  handleReceiveMetadata: 'handle:receiveMetadata',
  loadFileRequest: 'loadFileRequest',
  loadFileResponse: 'loadFileResponse',
  loadDefaultPlaylistRequest: 'loadDefaultPlaylistRequest',
  loadDefaultPlaylistResponse: 'loadDefaultPlaylistResponse',
  openPlaylistRequest: 'openPlaylistRequest',
  openPlaylistResponse: 'openPlaylistResponse',
  savePlaylistRequest: 'savePlaylistRequest',
  savePlaylistResponse: 'savePlaylistResponse',
  updateDefaultPlaylistRequest: 'changeDefaultPlaylistRequest',
};
