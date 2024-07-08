import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addTrack,
  changeCurrentTrack,
  changeCurrentTrackMetadata,
  changeCurrentTrackObjectURL,
  changeIsPlaying,
  changeSelectedTrackIdWithKeys,
  loadPlaylist,
  removeIdFromQueue,
  removeTrack,
  toggleQueueTrack,
} from '@/store/features/tracklist';
import type { AppDispatch, RootState } from '@/store';
import BottomPanel from './components/BottomPanel';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeShowSettingsModal } from '@/store/features/playlistSettings';
import ElapsedTime from './components/ElapsedTime';
import IconPlaylistSettings from '@/components/IconPlaylistSettings';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import PlaylistSettings from './components/PlaylistSettings';
import TrackInfo from './components/TrackInfo';
import type * as types from 'types';
import VolumeControls from './components/VolumeControls';
import WavesurferPlayer from './components/WavesurferPlayer';
import './styles.css';
import PlaylistSettingsModal from './components/PlaylistSettingsModal';

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
  const selectedTrackId = useSelector<RootState, string>(
    (state) => state.tracklist.selectedTrackId,
  );
  const queue = useSelector<RootState, string[]>(
    (state) => state.tracklist.queue,
  );
  const showSettingsModal = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.showSettingsModal,
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
        5000,
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
        (_, { buffer, id, metadata }: types.LoadFileResponsePayload): null | void => {
          if (buffer === null) {
            return null;
          }
          const objectURL = URL.createObjectURL(new Blob([buffer]));
          dispatch(changeCurrentTrackObjectURL(objectURL));
          dispatch(changeCurrentTrack(id));
          if (metadata) {
            const pictureLinks: string[] = [];
            if (metadata.common
              && metadata.common.picture
              && metadata.common.picture.length > 0) {
              metadata.common.picture.forEach((value) => {
                if (value.data) {
                  pictureLinks.push(URL.createObjectURL(new Blob([value.data])));
                }
              });
            }
            dispatch(changeCurrentTrackMetadata({
              id,
              metadata: {
                common: {
                  ...metadata.common,
                  picture: undefined,
                },
                format: metadata.format,
                pictureLinks,
              },
            }));
          }
        },
      );

      extendedWindow.backend.loadMetadataResponse((_, { error, id, metadata }) => {
        if (error) {
          console.log('error loading metadata', error);
        }
        if (!error && metadata) {
          dispatch(changeCurrentTrackMetadata({ id, metadata }));
        }
      });

      extendedWindow.backend.openPlaylistResponse(
        (_, payload) => {
          if (!payload.errorMessage && payload.playlist) {
            dispatch(loadPlaylist(payload.playlist));
          } else {
            // TODO: handle error response
            console.log(payload);
          }
        },
      );

      extendedWindow.backend.savePlaylistResponse(
        (_, payload) => {
          console.log('playlist save response', payload);
        },
      );
    },
    [],
  );

  const handleChangeTrack = useCallback(
    (changeTo: types.ChangeTrackTo): null | Promise<void> | void => {
      if (tracks.length === 0) {
        return null;
      }

      if (queue.length > 0) {
        const [nextTrack] = tracks.filter(
          (track: types.Track): boolean => track.id === queue[0],
        );
        extendedWindow.backend.loadFileRequest({
          id: nextTrack.id,
          path: nextTrack.path,
        });
        dispatch(removeIdFromQueue(nextTrack.id));
        return null;
      }

      if (!currentTrack) {
        const track = changeTo === 'previous'
          ? tracks[tracks.length - 1]
          : tracks[0];
        return extendedWindow.backend.loadFileRequest({
          id: track.id,
          path: track.path,
        });
      }
      if (tracks.length === 1) {
        wavesurfer?.stop();
        dispatch(changeIsPlaying(true));
        wavesurfer?.play();
      } else {
        let currentTrackIndex = 0;
        for (let i = 0; i < tracks.length; i += 1) {
          if (tracks[i].id === currentTrack.id) {
            currentTrackIndex = i;
            break;
          }
        }
        
        if (changeTo === 'current' && currentTrack && !wavesurfer) {
          return extendedWindow.backend.loadFileRequest({
            id: currentTrack.id,
            path: currentTrack.path,
          });
        }

        let nextIndex = 0;
        if (changeTo === 'next') {
          nextIndex = currentTrackIndex + 1;
        }
        if (changeTo === 'previous') {
          nextIndex = currentTrackIndex - 1;
        }
        if (nextIndex < 0) {
          nextIndex = tracks.length - 1;
        }
        if (nextIndex > tracks.length - 1) {
          nextIndex = 0;
        }
        return extendedWindow.backend.loadFileRequest({
          id: tracks[nextIndex].id,
          path: tracks[nextIndex].path,
        });
      }
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
        })
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

  const handleShowSettingsModal = () => {
    console.log('toggle')
    dispatch(changeShowSettingsModal(true));
  };

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
          >
            <IconPlaylistSettings />
          </ButtonWithIcon>
        </div>
      </div>
      <PlaylistSettings />
      <Playlist />
      <BottomPanel />
    </div>
  )
}

export default React.memo(Player);
