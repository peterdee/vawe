import React, { useState } from 'react';

import { FileEntry } from '@/models';

interface PlaylistProps {
  handleFileDrop: (event: React.DragEvent) => void;
  list: FileEntry[];
}

function Playlist(props: PlaylistProps): React.JSX.Element {
  const {
    handleFileDrop,
    list,
  } = props;

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const toggleDragging = () => setIsDragging((value: boolean) => !value);

  const handleDrop = (event: React.DragEvent) => {
    toggleDragging();
    return handleFileDrop(event);
  }

  return (
    <div
      className={`f d-col m-1 drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={toggleDragging}
      onDragOver={handleDragOver}
      onDragLeave={toggleDragging}
      onDrop={handleDrop}
    >
      { list.length > 0 && list.map((item: FileEntry, index: number) => (
        <div
          className="f j-space-between ai-center ph-half playlist-entry-wrap"
          key={`${item.addedAt}${item.path}`}
        >
          <div className="f">
            <div className="mr-1">
              { index }
            </div>
            <div>
              { item.name }
            </div>
          </div>
          <div>
            Duration
          </div>
        </div>
      )) }
    </div>
  );
}

export default React.memo(Playlist);
