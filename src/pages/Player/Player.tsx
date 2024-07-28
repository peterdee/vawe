import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addTrack,
  changeCurrentTrack,
  changeCurrentTrackElapsedTime,
  changeCurrentTrackMetadata,
  changeCurrentTrackObjectURL,
  changeIsPlaying,
  changeSelectedTrackIdWithKeys,
  changeTrackNotAccessible,
  loadPlaylist,
  menuSavePlaylist,
  removeIdFromQueue,
  removeTrack,
  toggleQueueTrack,
} from '@/store/features/tracklist';
import type { AppDispatch, RootState } from '@/store';
import BottomPanel from './components/BottomPanel';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import CoverModal from './components/CoverModal';
import {
  changeShowErrorModal,
  changeShowSettingsModal,
} from '@/store/features/modals';
import ElapsedTime from './components/ElapsedTime';
import ErrorModal from './components/ErrorModal';
import getCoverURLs from '@/utilities/get-cover-urls';
import getNextTrack from '@/utilities/get-next-track';
import IconPlaylistSettings from '@/components/IconPlaylistSettings';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import PlaylistSettingsModal from './components/PlaylistSettingsModal';
import TrackInfo from './components/TrackInfo';
import type * as types from 'types';
import VolumeControls from './components/VolumeControls';
import WavesurferPlayer from './components/WavesurferPlayer';
import './styles.css';

const extendedWindow = window as types.ExtendedWindow;

function Player(): React.JSX.Element {
  const [wavesurfer, setWavesurfer] = useState<types.WaveSurferInstance>(null);

  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
  const isMuted = useSelector<RootState, boolean>(
    (state) => state.volumeSettings.isMuted,
  );
  const isPlaying = useSelector<RootState, boolean>(
    (state) => state.tracklist.isPlaying,
  );
  const queue = useSelector<RootState, string[]>(
    (state) => state.tracklist.queue,
  );
  const selectedTrackId = useSelector<RootState, string>(
    (state) => state.tracklist.selectedTrackId,
  );
  const showCoverModal = useSelector<RootState, boolean>(
    (state) => state.modals.showCoverModal,
  );
  const showErrorModal = useSelector<RootState, boolean>(
    (state) => state.modals.showErrorModal,
  );
  const showSettingsModal = useSelector<RootState, boolean>(
    (state) => state.modals.showSettingsModal,
  );
  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );
  const volume = useSelector<RootState, number>(
    (state) => state.volumeSettings.volume,
  );

  useEffect(
    () => {
      let title = 'VAWE';
      if (currentTrack && currentTrack.name) {
        title = `VAWE: ${currentTrack.name}`;
      }
      window.document.title = title;
    },
    [currentTrack],
  );

  useEffect(
    () => {
      const timer = setTimeout(
        () => {
          extendedWindow.backend.updateDefaultPlaylistRequest(tracks);
        },
        2000,
      );

      return () => {
        clearTimeout(timer);
      }
    },
    [tracks],
  );

  useEffect(
    () => {
      dispatch(changeIsPlaying(false));
      dispatch(changeCurrentTrackObjectURL(''));

      extendedWindow.backend.addFilesResponse(
        (_, value: types.Track) => dispatch(addTrack(value)),
      );

      extendedWindow.backend.loadDefaultPlaylistRequest();

      extendedWindow.backend.loadDefaultPlaylistResponse(
        (_, payload) => dispatch(loadPlaylist(payload.playlist)),
      );

      extendedWindow.backend.loadFileResponse(
        (
          _,
          {
            buffer,
            id,
            metadata,
          }: types.LoadFileResponsePayload,
        ): null | Promise<void> | void => {
          if (buffer === null) {
            dispatch(changeTrackNotAccessible(id));
            return handleChangeTrack('next');
          }
          const objectURL = URL.createObjectURL(new Blob([buffer]));
          dispatch(changeCurrentTrackObjectURL(objectURL));
          dispatch(changeCurrentTrack(id));
          if (metadata) {
            dispatch(changeCurrentTrackMetadata({
              id,
              metadata: {
                common: {
                  ...metadata.common,
                  picture: undefined,
                },
                covers: getCoverURLs(metadata),
                format: metadata.format,
              },
            }));
          }
        },
      );

      extendedWindow.backend.menuSavePlaylistRequest(() => dispatch(menuSavePlaylist()));

      extendedWindow.backend.openPlaylistResponse(
        (_, payload) => {
          const {
            errorMessage,
            playlist,
          } = payload;
          if (!errorMessage && playlist) {
            dispatch(loadPlaylist(playlist));
          } else {
            if (errorMessage === 'cancelled') {
              return null;
            }
            if (errorMessage === 'emptyFile') {
              dispatch(changeShowErrorModal({
                message: 'Selected playlist is empty!',
                showModal: true,
              }));
              return null;
            }
            if (errorMessage === 'invalidFormat') {
              dispatch(changeShowErrorModal({
                message: 'Playlist format is invalid!',
                showModal: true,
              }));
              return null;
            }
            dispatch(changeShowErrorModal({
              message: 'Could not open the playlist!',
              showModal: true,
            }));
          }
        },
      );

      extendedWindow.backend.removeTrackFromPlaylistResponse(
        (_, payload) => {
          console.log('remove track', payload);
          dispatch(removeTrack(payload));
        }
      );

      extendedWindow.backend.savePlaylistResponse(
        (_, payload) => {
          if (payload === 'internalError') {
            dispatch(changeShowErrorModal({
              message: 'Could not save the playlist!',
              showModal: true,
            }));
          }
        },
      );
    },
    [],
  );

  const handleChangeTrack = useCallback(
    (changeTo: types.ChangeTrackTo): null | Promise<void> | void => {
      if (queue.length > 0) {
        const [nextTrack] = tracks.filter(
          (track: types.Track): boolean => track.id === queue[0],
        );
        dispatch(removeIdFromQueue(nextTrack.id));
        return extendedWindow.backend.loadFileRequest({
          id: nextTrack.id,
          path: nextTrack.path,
        });
      }

      if (tracks.length === 1) {
        if (wavesurfer) {
          wavesurfer.stop();
          dispatch(changeIsPlaying(true));
          return wavesurfer.play();
        }
      }
      const result = getNextTrack(currentTrack, tracks, changeTo);
      if (!result) {
        dispatch(changeCurrentTrack(''));
        dispatch(changeCurrentTrackElapsedTime(0));
        dispatch(changeCurrentTrackObjectURL(''));
        dispatch(changeIsPlaying(false));
        return null;
      }
      return extendedWindow.backend.loadFileRequest(result);
    },
    [
      currentTrack,
      isLooped,
      isPlaying,
      queue,
      tracks,
      wavesurfer,
    ],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // arrows (horizontal): scroll track forwards or backwards
      if ((event.key.toLowerCase() === 'arrowleft'
        || event.key.toLowerCase() === 'arrowright')
        && wavesurfer) {
        wavesurfer.setTime(
          event.key.toLowerCase() === 'arrowleft'
            ? wavesurfer.getCurrentTime() - 5
            : wavesurfer.getCurrentTime() + 5,
        );
      }
      // arrows (vertical): change selected track
      if ((event.key.toLowerCase() === 'arrowdown'
        || event.key.toLowerCase() === 'arrowup')
        && tracks.length > 0) {
        dispatch(changeSelectedTrackIdWithKeys(event.key.toLowerCase()));
      }
      // backspace: delete track
      if (event.key.toLowerCase() === 'backspace' && selectedTrackId) {
        dispatch(removeTrack(selectedTrackId));
        if (selectedTrackId === currentTrack?.id) {
          dispatch(changeIsPlaying(false));
          wavesurfer?.stop();
          wavesurfer?.destroy();
          handleChangeTrack('next');
        }
      }
      // enter: play selected track
      if (event.key.toLowerCase() === 'enter' && selectedTrackId) {
        extendedWindow.backend.loadFileRequest({
          id: selectedTrackId,
          path: tracks.filter(
            (track: types.Track): boolean => track.id === selectedTrackId,
          )[0].path,
        });
      }
      // q: add track to queue 
      if (event.key.toLowerCase() === 'q' && selectedTrackId) {
        dispatch(toggleQueueTrack(selectedTrackId));
      }
    },
    [
      currentTrack,
      selectedTrackId,
      tracks,
      wavesurfer,
    ],
  );

  const handleShowSettingsModal = () => dispatch(changeShowSettingsModal(true));

  useEffect(
    () => {
      extendedWindow.addEventListener('keydown', handleKeyDown);

      return () => {
        extendedWindow.removeEventListener('keydown', handleKeyDown);
      };
    },
    [
      currentTrack,
      selectedTrackId,
      tracks,
      wavesurfer,
    ],
  );

  const wavesurferOnFinish = useCallback(
    (wavesurferInstance: types.WaveSurferInstance) => {
      dispatch(changeIsPlaying(false));
      const trackIds = tracks.map((track: types.Track): string => track.id);
      if (trackIds.indexOf(currentTrack?.id || '') === (trackIds.length - 1)
        && !isLooped) {
        return wavesurferInstance?.stop();
      }
      return handleChangeTrack('next');
    },
    [
      currentTrack,
      isLooped,
      tracks,
    ],
  );
  
  const wavesurferOnReady = (
    wavesurferInstance: types.WaveSurferInstance,
  ): void | Promise<void> =>  {
    if (wavesurferInstance) {
      dispatch(changeIsPlaying(true));
      wavesurferInstance.setVolume(isMuted ? 0 : volume);
      setWavesurfer(wavesurferInstance);
      return wavesurferInstance.play();
    }
  };
  
  return (
    <div className="f d-col j-start h-100vh">
      { showCoverModal && (
        <CoverModal />
      ) }
      { showErrorModal && (
        <ErrorModal />
      ) }
      { showSettingsModal && (
        <PlaylistSettingsModal />
      ) }
      <TrackInfo />
      <WavesurferPlayer
        onFinish={wavesurferOnFinish}
        onReady={wavesurferOnReady}
      />
      <div className="f j-space-between ai-center mh-1">
        <PlaybackControls
          handleChangeTrack={handleChangeTrack}
          wavesurfer={wavesurfer}
        />
        <ElapsedTime />
        <div className="f ai-center">
          <VolumeControls wavesurfer={wavesurfer} />
          <ButtonWithIcon
            globalStyles="ml-1"
            onClick={handleShowSettingsModal}
            stopPropagation
          >
            <IconPlaylistSettings />
          </ButtonWithIcon>
        </div>
      </div>
      <Playlist />
      <BottomPanel />
    </div>
  )
}

export default React.memo(Player);
