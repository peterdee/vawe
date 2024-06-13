import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import * as types from '../../../types';
import VolumeControls from './components/VolumeControls';
import './styles.css';

function Player(): React.JSX.Element {
  const [currentTrack, setCurrentTrack] = useState<types.CurrentTrack | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [list, setList] = useState<types.ParsedFile[]>([]);
  const [volume, setVolume] = useState<number>(0.5);

  const audioRef = useRef<HTMLAudioElement>(null);

  const ipcLoadFileResponse = useCallback(
    ({ buffer, id }: types.LoadFileResponsePayload) => {
      if (audioRef.current && buffer !== null) {
        // if (currentTrack && currentTrack.objectUrl) {
        //   URL.revokeObjectURL(currentTrack.objectUrl);
        // }
        const objectUrl = URL.createObjectURL(new Blob([buffer]));
        audioRef.current.src = objectUrl;
        const [track] = list.filter((file: types.ParsedFile): boolean => file.id === id);
        console.log(track);
        setCurrentTrack({
          ...track,
          objectUrl,
        });
        setIsPlaying(true);
        try {
          audioRef.current.play();
        } catch (err) {
          console.log(err);
        }
      }
    },
    [list],
  );

  useEffect(
    () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = (event: Event) => {
          console.log('on time update', event);
        };
      }

      (window as types.ExtendedWindow).backend.loadFileResponse(ipcLoadFileResponse);

      (window as types.ExtendedWindow).backend.onAddFile((value) => {
        setList((state: types.ParsedFile[]): types.ParsedFile[] => {
          return [
            ...state.filter((item: types.ParsedFile): boolean => item.id !== value.id),
            value,
          ];
        });
      });
      (window as types.ExtendedWindow).backend.onReceiveMetadata(({ id, metadata }) => {
        console.log('received metadata', id, metadata);
        // TODO: handle error (if metadata is null)
        setList((state: types.ParsedFile[]): types.ParsedFile[] => {
          return state.reduce(
            (array: types.ParsedFile[], value: types.ParsedFile): types.ParsedFile[] => {
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
    const paths: string[] = [];
    for (let item of event.dataTransfer.files) {
      paths.push(item.path);
    }
    return (window as types.ExtendedWindow).backend.handleDrop(paths);
  };

  const handleChangeTrack = (changeTo: types.ChangeTrackTo) => {
    console.log('Change to', changeTo);
  };

  const handleChangeVolume = useCallback(
    (value: number) => {
      if (audioRef && audioRef.current) {
        const { current: element } = audioRef;
        if (isMuted) {
          setIsMuted(false);
        }
        setVolume(value);
        element.volume = value;
      }
    },
    [isMuted],
  );

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
    return (window as types.ExtendedWindow).backend.loadFileRequest({
      id,
      path: list.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
    });
  };

  const handlePlaylistEntryContextMenu = useCallback(
    (id: string) => {
      // check if metadata is already loaded for the track
      const [track] = list.filter((item: types.ParsedFile): boolean => item.id === id);
      if (track.metadata) {
        return console.log('metadata already loaded:', track.metadata);
      }
      return (window as types.ExtendedWindow).backend.requestMetadata({
        id,
        path: list.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
      });
    },
    [list],
  );

  const handleStopPlayback = () => {
    setIsPlaying(false);
    console.log('Stop playback');
  };

  const toggleMute = useCallback(
    () => {
      if (audioRef && audioRef.current) {
        audioRef.current.volume = isMuted ? volume : 0;
        setIsMuted(!isMuted);
      }
    },
    [
      isMuted,
      volume,
    ],
  );

  return (
    <div className="f d-col j-start h-100vh">
      <div>
        { currentTrack && currentTrack.name || 'VAWE' }
      </div>
      <div>
        Track progress
      </div>
      <audio
        controls={false}
        ref={audioRef}
      />
      <div className="f j-space-between ai-center">
        <PlaybackControls
          handleChangeTrack={handleChangeTrack}
          handlePlayPause={handlePlayPause}
          handleStopPlayback={handleStopPlayback}
          isPlaying={isPlaying}
        />
        <VolumeControls
          handleVolumeChange={handleChangeVolume}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
        />
      </div>
      <Playlist
        handleFileDrop={handleFileDrop}
        handlePlaylistEntryClick={handlePlaylistEntryClick}
        handlePlaylistEntryContextMenu={handlePlaylistEntryContextMenu}
        list={list}
      />
    </div>
  )
}

export default React.memo(Player);
