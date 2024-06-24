import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addTrack,
  addTrackMetadata,
  changeCurrentTrack,
  changeCurrentTrackObjectURL,
  removeTrack,
  toggleQueueTrack,
} from '@/store/features/tracklist';
import type { AppDispatch, RootState } from '@/store';
import { changeIsPlaying } from '@/store/features/playbackSettings';
import formatTrackName from '@/utilities/format-track-name';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import PlaylistSettings from './components/PlaylistSettings';
import * as types from 'types';
import VolumeControls from './components/VolumeControls';
import WavesurferPlayer from './components/WavesurferPlayer';
import './styles.css';

const extendedWindow = window as types.ExtendedWindow;

function Player(): React.JSX.Element {
  const [wavesurfer, setWavesurfer] = useState<types.WaveSurferInstance>(null);

  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.ParsedFile | null>(
    (state) => state.tracklist.currentTrack,
  );
  const currentTrackObjectURL = useSelector<RootState, string>(
    (state) => state.tracklist.currentTrackObjectURL,
  );
  const selectedTrackId = useSelector<RootState, string>(
    (state) => state.tracklist.selectedTrackId,
  );
  const isLooped = useSelector<RootState, boolean>(
    (state) => state.playlistSettings.isLooped,
  );
  const isMuted = useSelector<RootState, boolean>(
    (state) => state.volumeSettings.isMuted,
  );
  const isPlaying = useSelector<RootState, boolean>(
    (state) => state.playbackSettings.isPlaying,
  );
  const tracks = useSelector<RootState, types.ParsedFile[]>(
    (state) => state.tracklist.tracks,
  );
  const volume = useSelector<RootState, number>(
    (state) => state.volumeSettings.volume,
  );

  useEffect(
    () => {
      let title = 'VAWE';
      if (currentTrack && currentTrack.name) {
        title = `VAWE: ${formatTrackName(currentTrack.name)}`;
      }
      window.document.title = title;
    },
    [currentTrack],
  );

  useEffect(
    () => {
      extendedWindow.backend.loadDefaultPlaylistRequest();

      extendedWindow.backend.loadFileResponse(
        ({ buffer, id }: types.LoadFileResponsePayload): null | void => {
          if (buffer === null) {
            return null;
          }
          const objectURL = URL.createObjectURL(new Blob([buffer]));
          dispatch(changeCurrentTrackObjectURL(objectURL));
          dispatch(changeCurrentTrack(id));
        },
      );

      extendedWindow.backend.onAddFile(
        (_, value: types.ParsedFile) => dispatch(addTrack(value)),
      );

      // load default playlist
      extendedWindow.backend.loadDefaultPlaylistResponse(
        (_, payload) => console.log(payload),
      );

      extendedWindow.backend.onReceiveMetadata(({ id, metadata }) => {
        // TODO: handle error (if metadata is null)
        dispatch(addTrackMetadata({ id, metadata }));
      });
    },
    [],
  );

  const handleChangeTrack = useCallback(
    (changeTo: types.ChangeTrackTo): null | Promise<void> | void => {
      if (tracks.length === 0) {
        return null;
      }

      // TODO: check queue

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
      tracks,
      wavesurfer,
    ],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // backspace: delete track
      if (event.key.toLowerCase() === 'backspace' && selectedTrackId) {
        dispatch(removeTrack(selectedTrackId));
        if (selectedTrackId === currentTrack?.id) {
          dispatch(changeIsPlaying(false));
          wavesurfer?.stop();
          wavesurfer?.destroy();
          return handleChangeTrack('next');
        }
      }
      // q: add track to queue 
      if (event.key.toLowerCase() === 'q' && selectedTrackId) {
        dispatch(toggleQueueTrack(selectedTrackId));
      }
    },
    [
      currentTrack,
      selectedTrackId,
      wavesurfer,
    ],
  );

  useEffect(
    () => {
      extendedWindow.addEventListener('keydown', handleKeyDown);

      return () => {
        extendedWindow.removeEventListener('keydown', handleKeyDown);
      };
    },
    [selectedTrackId],
  );

  const wavesurferOnFinish = useCallback(
    (wavesurferInstance: types.WaveSurferInstance) => {
      dispatch(changeIsPlaying(false));
      const trackIds = tracks.map((track: types.ParsedFile): string => track.id);
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
      <div className="f j-center mt-1">
        { currentTrack && formatTrackName(currentTrack.name) || 'VAWE' }
      </div>
      <WavesurferPlayer
        objectURL={currentTrackObjectURL}
        onFinish={wavesurferOnFinish}
        onReady={wavesurferOnReady}
      />
      <div className="f j-space-between ai-center mh-1">
        <PlaybackControls
          handleChangeTrack={handleChangeTrack}
          wavesurfer={wavesurfer}
        />
        <VolumeControls wavesurfer={wavesurfer} />
      </div>
      <div className="f j-end mh-1">
        <PlaylistSettings />
      </div>
      <Playlist />
    </div>
  )
}

export default React.memo(Player);
