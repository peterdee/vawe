import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  ChangeTrackTo,
  ExtendedWindow,
  ParsedFile,
} from '../../../types';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import './styles.css';

function Player(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [list, setList] = useState<ParsedFile[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(
    () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = (event: Event) => {
          console.log('on time update', event);
        };
      }

      (window as ExtendedWindow).backend.loadFileResponse(({ blob }) => {
        if (audioRef.current && blob !== null) {
          audioRef.current.src = URL.createObjectURL(blob);
          return audioRef.current.play();
        }
      });
      (window as ExtendedWindow).backend.onAddFile((value) => {
        setList((state: ParsedFile[]): ParsedFile[] => {
          return [
            ...state.filter((item: ParsedFile): boolean => item.id !== value.id),
            value,
          ];
        });
      });
      (window as ExtendedWindow).backend.onReceiveMetadata(({ id, metadata }) => {
        console.log('received metadata', id, metadata);
        // TODO: handle error (if metadata is null)
        setList((state: ParsedFile[]): ParsedFile[] => {
          return state.reduce(
            (array: ParsedFile[], value: ParsedFile): ParsedFile[] => {
              const copy = { ...value };
              if (copy.id === id) {
                copy.metadata = metadata;
              }
              array.push(copy);
              return array;
            },
            [],
          );
        });
      });
    },
    [],
  );

  const handleFileDrop = (event: React.DragEvent) => {
    const filesArray: string[] = [];
    for (let item of event.dataTransfer.files) {
      filesArray.push(item.path);
    }
    try {
      (window as ExtendedWindow).backend.handleDrop(filesArray);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeTrack = (changeTo: ChangeTrackTo) => {
    console.log('Change to', changeTo);
  };

  const handlePlayPause = useCallback(
    async () => {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        await audioRef.current?.play();
      }
    },
    [isPlaying],
  );

  const handlePlaylistEntryClick = (id: string) => {
    console.log('clicked id', id);
    return (window as ExtendedWindow).backend.loadFileRequest({
      id,
      path: list.filter((file: ParsedFile): boolean => file.id === id)[0].path,
    });
  };

  const handlePlaylistEntryContextMenu = useCallback(
    (id: string) => {
      // check if metadata is already loaded for the track
      const [track] = list.filter((item: ParsedFile): boolean => item.id === id);
      if (track.metadata) {
        return console.log('metadata already loaded:', track.metadata);
      }
      return (window as ExtendedWindow).backend.requestMetadata({
        id,
        path: list.filter((file: ParsedFile): boolean => file.id === id)[0].path,
      });
    },
    [list],
  );

  const handleStopPlayback = () => {
    setIsPlaying(false);
    console.log('Stop playback');
  };

  return (
    <div className="f d-col j-start h-100vh">
      <div>
        Track name
      </div>
      <div>
        Track progress
      </div>
      <audio
        controls={false}
        ref={audioRef}
      />
      <PlaybackControls
        handleChangeTrack={handleChangeTrack}
        handlePlayPause={handlePlayPause}
        handleStopPlayback={handleStopPlayback}
        isPlaying={isPlaying}
      />
      <Playlist
        handleFileDrop={handleFileDrop}
        handlePlaylistEntryClick={handlePlaylistEntryClick}
        handlePlaylistEntryContextMenu={handlePlaylistEntryContextMenu}
        list={list}
      />
      <input
        onChange={console.log}
        type="file"
      />
    </div>
  )
}

export default React.memo(Player);
