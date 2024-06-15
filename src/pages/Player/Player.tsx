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

  useEffect(
    () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = (event: Event) => {
          // console.log('on time update', event);
        };
      }

      (window as types.ExtendedWindow).backend.loadFileResponse(
        ({ buffer, id }: types.LoadFileResponsePayload) => {
          if (audioRef.current && buffer !== null) {
            const objectUrl = URL.createObjectURL(new Blob([buffer]));
            audioRef.current.src = objectUrl;
            const [track] = list.filter((file: types.ParsedFile): boolean => file.id === id);
            console.log(track);
            setCurrentTrack((state: types.CurrentTrack): types.CurrentTrack => {
              if (state !== null && state.objectUrl) {
                URL.revokeObjectURL(state.objectUrl);
              }
              return {
                ...track,
                objectUrl,
              };
            });
            setIsPlaying(true);
            try {
              audioRef.current.play();
            } catch (error) {
              // TODO: error modal
              console.log(error);
            }
          }
        },
      );

      (window as types.ExtendedWindow).backend.onAddFile(
        (value) => setList((state: types.ParsedFile[]): types.ParsedFile[] => [
          ...state,
          value,
        ]),
      );

      (window as types.ExtendedWindow).backend.onReceiveMetadata(({ id, metadata }) => {
        console.log('received metadata', id, metadata);
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
    for (let item of event.dataTransfer.files) {
      paths.push(item.path);
    }
    return (window as types.ExtendedWindow).backend.handleDrop(paths);
  };

  // handle playback controls -> track change 
  const handleChangeTrack = useCallback(
    (changeTo: types.ChangeTrackTo): null | void => {
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

    },
    [
      currentTrack,
      isPlaying,
      list,
    ],
  );

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

  // handle playback controls -> play / pause 
  const handlePlayPause = useCallback(
    async () => {
      if (audioRef && audioRef.current) {
        try {
          if (isPlaying) {
            audioRef.current?.pause();
          } else {
            await audioRef.current?.play();
          }
          setIsPlaying(!isPlaying);
        } catch (error) {
          // TODO: handle error
          console.log(error);
        }
      }
    },
    [isPlaying],
  );

  const handlePlaylistEntryClick = (id: string) => {
    return (window as types.ExtendedWindow).backend.loadFileRequest({
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
        currentTrackId={currentTrack ? (() => { console.log(currentTrack); return currentTrack.id })() : ''}
        handleFileDrop={handleFileDrop}
        handlePlaylistEntryClick={handlePlaylistEntryClick}
        handlePlaylistEntryContextMenu={handlePlaylistEntryContextMenu}
        list={list}
      />
    </div>
  )
}

export default React.memo(Player);
