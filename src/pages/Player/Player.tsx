import React, { useState } from 'react';

import type { ChangeTrackTo, FileEntry } from '../../models';
import PlaybackControls from './components/PlaybackControls';
import Playlist from './components/Playlist';
import './styles.css';

function Player(): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [list, setList] = useState<FileEntry[]>([]);

  const handleFileDrop = (event: React.DragEvent) => {
    for (let file of event.dataTransfer.files) {
      // TODO: only supported formats
      // TODO: check for directories
      // TODO: parse directories recursively
      setList((items: FileEntry[]): FileEntry[] => [
        ...items,
        {
          addedAt: Date.now(),
          name: file.name,
          path: file.path,
          sizeBytes: file.size,
          type: file.type,
        },
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
