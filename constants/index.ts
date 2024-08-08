import type * as types from 'types';

export const CLIENT_TYPE: types.ClientType = 'player';

export const DEFAULT_PLAYLIST_NAME = 'vawe-default.va';

export const DEFAULT_SERVER_ADDRESS = 'http://localhost:5077';

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
  changeCurrentTrack: 'CHANGE_CURRENT_TRACK',
  changeCurrentTrackElapsedTime: 'CHANGE_CURRENT_TRACK_ELAPSED_TIME',
  changeIsMuted: 'CHANGE_IS_MUTED',
  changeIsPlaying: 'CHANGE_IS_PLAYING',
  changeVolume: 'CHANGE_VOLUME',
  clearTracklist: 'CLEAR_TRACKLIST',
  connectClient: 'connect',
  connectToServer: 'connection',
  disconnectFromServer: 'disconnect',
  loadPlaylist: 'LOAD_PLAYLIST',
  removeIdFromQueue: 'REMOVE_ID_FROM_QUEUE',
  removeTrack: 'REMOVE_TRACK',
  requestCurrentTrack: 'REQUEST_CURRENT_TRACK',
  requestPlaybackState: 'REQUEST_PLAYBACK_STATE',
  requestTracklist: 'REQUEST_TRACKLIST',
};
