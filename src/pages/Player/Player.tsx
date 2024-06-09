import React, { useCallback, useEffect, useState } from 'react';

import type {
  ChangeTrackTo,
  ExtendedWindow,
  Metadata,
  ParsedFile,
} from '../../../types';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import './styles.css';

function Player(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [list, setList] = useState<ParsedFile[]>([]);

  useEffect(
    () => {
      (window as ExtendedWindow).backend.onAddFile((value) => {
        setList((state: ParsedFile[]): ParsedFile[] => {
          return [
            ...state.filter((item: ParsedFile): boolean => item.id != value.id),
            value,
          ];
        });
      });
      (window as ExtendedWindow).backend.onReceiveMetadata((metadata: Metadata | null) => {
        console.log('received metadata', metadata);
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

  const handlePlayPause = () => {
    setIsPlaying((state: boolean): boolean => !state);
  };

  const handlePlaylistEntryClick = (id: string) => {
    console.log('clicked id', id);
  };

  const handlePlaylistEntryContextMenu = useCallback(
    (id: string) => {
      console.log('context menu id', id);
      (window as ExtendedWindow).backend.requestMetadata(
        list.filter((file: ParsedFile): boolean => file.id === id)[0].path,
      );
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
