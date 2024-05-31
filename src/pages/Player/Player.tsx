import React, { useState } from 'react';

import type { FileEntry } from '../../models';
import Playlist from './components/Playlist';
import './styles.css';

function Player(): React.JSX.Element {
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
    }
  };

  return (
    <div className="f d-col j-start h-100vh">
      Player controls ...
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
