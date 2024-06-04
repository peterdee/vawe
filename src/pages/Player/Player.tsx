import React, { useState } from 'react';

import type {
  ChangeTrackTo,
  ExtendedWindow,
  ParsedFile,
} from '../../models';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import './styles.css';

function Player(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [list, setList] = useState<ParsedFile[]>([]);

  const handleFileDrop = async (event: React.DragEvent) => {
    const filesArray: File[] = [];
    for (let item of event.dataTransfer.files) {
      filesArray.push(item);
    }
    try {
      const files = await (window as ExtendedWindow).backend.handleDrop(filesArray);
      console.log('files:', files);
    } catch (err) {
      console.log(err);
    }

    for (let file of event.dataTransfer.files) {
      // TODO: only supported formats
      // TODO: check for directories
      // TODO: parse directories recursively
      setList((items: ParsedFile[]): ParsedFile[] => [
        ...items,
        {
          id: file.name,
          lengthSeconds: 0,
          name: file.name,
          path: file.path,
          sizeBytes: file.size,
        }
      ]);
      console.log(file);
    }
  };

  const handleChangeTrack = (changeTo: ChangeTrackTo) => {
    console.log('Change to', changeTo);
  };

  const handlePlayPause = () => {
    setIsPlaying((state: boolean): boolean => !state);
  };

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
