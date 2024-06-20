import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WaveSurferPlayer from '@wavesurfer/react';

import type { AppDispatch, RootState } from '@/store';
import formatTrackName from '@/utilities/format-track-name';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import PlaylistSettings from './components/PlaylistSettings';
import * as types from 'types';
import VolumeControls from './components/VolumeControls';
import './styles.css';
import { changeIsPlaying } from '@/store/features/playbackSettings';

const extendedWindow = window as types.ExtendedWindow;

function Player(): React.JSX.Element {
  const [currentTrack, setCurrentTrack] = useState<types.CurrentTrack | null>(null);
  const [list, setList] = useState<types.ParsedFile[]>([]);
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
          setList((listState: types.ParsedFile[]): types.ParsedFile[] => {
            const [track] = listState.filter((file: types.ParsedFile): boolean => file.id === id);
            setCurrentTrack(track);
            return listState;
          });
        },
      );

      extendedWindow.backend.onAddFile(
        (value: types.ParsedFile) => setList(
          (state: types.ParsedFile[]): types.ParsedFile[] => [
            ...state,
            value,
          ],
        ),
      );

      extendedWindow.backend.onReceiveMetadata(({ id, metadata }) => {
        // TODO: handle error (if metadata is null)
        setList((state: types.ParsedFile[]): types.ParsedFile[] => state.map(
          (element: types.ParsedFile): types.ParsedFile => {
            if (element.id !== id) {
              return element;
            }
            return {
              ...element,
              metadata,
            };
          },
        ));
      });
    },
    [],
  );

  const handleFileDrop = (event: React.DragEvent) => {
    const paths: string[] = [];
    for (const item of event.dataTransfer.files) {
      paths.push(item.path);
    }
    return (window as types.ExtendedWindow).backend.handleDrop(paths);
  };

  const handleChangeTrack = useCallback(
    (changeTo: types.ChangeTrackTo): null | Promise<void> | void => {
      if (list.length === 0) {
        return null;
      }
      if (!currentTrack) {
        const track = changeTo === 'previous'
          ? list[list.length - 1]
          : list[0];
        return (window as types.ExtendedWindow).backend.loadFileRequest({
          id: track.id,
          path: track.path,
        });
      }
      if (list.length === 1) {
        // TODO: fix
        // if (audioRef && audioRef.current) {
        //   const { current: audio } = audioRef;
        //   audio.src = currentTrack?.objectUrl || '';
        //   setIsPlaying(true);
        //   return audio.play();
        // }
      } else {
        let currentTrackIndex = 0;
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].id === currentTrack.id) {
            currentTrackIndex = i;
            break;
          }
        }
        let nextIndex = changeTo === 'next'
          ? currentTrackIndex + 1
          : currentTrackIndex - 1;
        if (nextIndex < 0) {
          nextIndex = list.length - 1;
        }
        if (nextIndex > list.length - 1 && isLooped) {
          nextIndex = 0;
        }
        return (window as types.ExtendedWindow).backend.loadFileRequest({
          id: list[nextIndex].id,
          path: list[nextIndex].path,
        });
      }
    },
    [
      currentTrack,
      isPlaying,
      list,
      wavesurfer,
    ],
  );

  const handlePlaylistEntryClick = (id: string) => setSelectedTrackId(id);

  const handlePlaylistEntryDoubleClick = (id: string) => {
    (window as types.ExtendedWindow).backend.loadFileRequest({
      id,
      path: list.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
    });
  };

  const handlePlaylistEntryContextMenu = (id: string) => {
    // check if metadata is already loaded for the track
    const [track] = list.filter((item: types.ParsedFile): boolean => item.id === id);
    if (track.metadata) {
      return console.log('metadata already loaded:', track.metadata);
    }
    return (window as types.ExtendedWindow).backend.requestMetadata({
      id,
      path: list.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
    });
  };

  const onWavesurferReady = (
    wavesurferInstance: types.WaveSurferInstance,
  ): void | Promise<void> =>  {
    if (wavesurferInstance) {
      console.log(isPlaying);
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
      <div className="m-1">
        <WaveSurferPlayer
          height={100}
          onReady={onWavesurferReady}
          onFinish={() => handleChangeTrack('next')}
          url={objectURL}
          waveColor="lightgreen"
        />
      </div>
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
        handleFileDrop={handleFileDrop}
        handlePlaylistEntryClick={handlePlaylistEntryClick}
        handlePlaylistEntryDoubleClick={handlePlaylistEntryDoubleClick}
        handlePlaylistEntryContextMenu={handlePlaylistEntryContextMenu}
        list={list}
        selectedTrackId={selectedTrackId}
      />
    </div>
  )
}

export default React.memo(Player);
