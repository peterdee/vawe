export const DEFAULT_PLAYLIST_NAME = 'vawe-default.va';

export const EXTERNAL_LINKS = {
  menuReportIssue: 'https://github.com/peterdee/vawe/issues',
  menuSourceCode: 'https://github.com/peterdee/vawe',
};

export const FORMATS = ['.flac', '.mp3', '.wav'];

export const IPC_ERROR_MESSAGES = {
  missingRequiredParameters: 'missing required parameters',
};

export const IPC_EVENTS = {
  addFilesRequest: 'addFilesRequest',
  addFilesResponse: 'addFilesResponse',
  loadDefaultPlaylistRequest: 'loadDefaultPlaylistRequest',
  loadDefaultPlaylistResponse: 'loadDefaultPlaylistResponse',
  loadFileRequest: 'loadFileRequest',
  loadFileResponse: 'loadFileResponse',
  loadMetadataRequest: 'loadMetadataRequest',
  loadMetadataResponse: 'loadMetadataResponse',
  menuClearPlaylistRequest: 'menuClearPlaylistRequest',
  menuSavePlaylistRequest: 'menuSavePlaylistRequest',
  menuShufflePlaylistRequest: 'menuShufflePlaylistRequest',
  openPlaylistRequest: 'openPlaylistRequest',
  openPlaylistResponse: 'openPlaylistResponse',
  openTrackDetails: 'openTrackDetails',
  removeTrackFromPlaylistRequest: 'removeTrackFromPlaylistRequest',
  removeTrackFromPlaylistResponse: 'removeTrackFromPlaylistResponse',
  savePlaylistRequest: 'savePlaylistRequest',
  savePlaylistResponse: 'savePlaylistResponse',
  updateDefaultPlaylistRequest: 'updateDefaultPlaylistRequest',
};

export const SERVER = {
  connectTimeoutMS: 30000, // 30 seconds
  maxDisconnectionDurationMS: 300000, // 5 minutes
  port: 5077,
};

export const WS_EVENTS = {
  addTrack: 'ADD_TRACK',
  onTimeUpdate: 'ON_TIME_UPDATE',
  loadPlaylist: 'LOAD_PLAYLIST',
  removeTrack: 'REMOVE_TRACK',
  updatePlaybackState: 'UPDATE_PLAYBACK_STATE',
};
