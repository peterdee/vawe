import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addTrack, addTrackMetadata, removeTrack, toggleQueueTrack } from '@/store/features/tracklist';
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
  const [currentTrack, setCurrentTrack] = useState<types.CurrentTrack | null>(null);
  const [objectURL, setObjectURL] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [wavesurfer, setWavesurfer] = useState<types.WaveSurferInstance>(null);

  const dispatch = useDispatch<AppDispatch>();

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
      extendedWindow.backend.loadFileResponse(
        ({ buffer, id }: types.LoadFileResponsePayload): null | void => {
          if (buffer === null) {
            return null;
          }
          const newObjectURL = URL.createObjectURL(new Blob([buffer]));
          setObjectURL((objectURLState: string): string => {
            if (objectURLState) {
              URL.revokeObjectURL(objectURLState);
            }
            return newObjectURL;
          });
          const [track] = tracks.filter(
            (file: types.ParsedFile): boolean => file.id === id,
          );
          console.log('set track', track, tracks);
          setCurrentTrack(track);
        },
      );

      extendedWindow.backend.onAddFile((value: types.ParsedFile) => {
        dispatch(addTrack(value));
      });

      extendedWindow.backend.onReceiveMetadata(({ id, metadata }) => {
        // TODO: handle error (if metadata is null)
        dispatch(addTrackMetadata({ id, metadata }));
      });

      // TODO: unsubscribe from events on re-render in preload

      return () => {
        // ...
      };
    },
    [tracks],
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
        let nextIndex = changeTo === 'next'
          ? currentTrackIndex + 1
          : currentTrackIndex - 1;
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

  const handlePlaylistEntryClick = (id: string) => setSelectedTrackId(id);

  const handlePlaylistEntryDoubleClick = (id: string) => {
    (window as types.ExtendedWindow).backend.loadFileRequest({
      id,
      path: tracks.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
    });
  };

  const handlePlaylistEntryContextMenu = (id: string) => {
    const [track] = tracks.filter((item: types.ParsedFile): boolean => item.id === id);
    if (track.metadata) {
      return console.log('metadata already loaded:', track.metadata);
    }
    return (window as types.ExtendedWindow).backend.requestMetadata({
      id,
      path: track.path,
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'backspace' && selectedTrackId) {
        console.log('del', currentTrack, selectedTrackId);
        dispatch(removeTrack(selectedTrackId));
        if (selectedTrackId === currentTrack?.id) {
          console.log('hit');
          dispatch(changeIsPlaying(false));
          URL.revokeObjectURL(objectURL);
          wavesurfer?.destroy();
          return handleChangeTrack('next');
        }
      }
      if (event.key.toLowerCase() === 'q' && selectedTrackId) {
        dispatch(toggleQueueTrack(selectedTrackId));
      }
    },
    [
      currentTrack,
      objectURL,
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
        objectURL={objectURL}
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
      <Playlist
        currentTrackId={currentTrack ? currentTrack.id : ''}
        handlePlaylistEntryClick={handlePlaylistEntryClick}
        handlePlaylistEntryDoubleClick={handlePlaylistEntryDoubleClick}
        handlePlaylistEntryContextMenu={handlePlaylistEntryContextMenu}
        selectedTrackId={selectedTrackId}
      />
    </div>
  )
}

export default React.memo(Player);
