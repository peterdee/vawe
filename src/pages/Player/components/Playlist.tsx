import React, { useState } from 'react';

import formatDuration from '@/utilities/format-duration';
import type { ParsedFile } from '../../../../types';

interface PlaylistProps {
  handleFileDrop: (event: React.DragEvent) => void;
  handlePlaylistEntryClick: (id: string) => void;
  handlePlaylistEntryContextMenu: (id: string) => void;
  list: React.MutableRefObject<ParsedFile[]>;
}

function Playlist(props: PlaylistProps): React.JSX.Element {
  const {
    handleFileDrop,
    handlePlaylistEntryClick,
    handlePlaylistEntryContextMenu,
    list,
  } = props;

  console.log('list', list.current);

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
      { list.current.length > 0 && list.current.map(
        (item: ParsedFile, index: number): React.JSX.Element => (
          <button
            className="f j-space-between ai-center ph-half ns playlist-entry-wrap"
            key={item.path}
            onClick={() => handlePlaylistEntryClick(item.id)}
            onContextMenu={() => handlePlaylistEntryContextMenu(item.id)}
            type="button"
          >
            <div className="f">
              <div className="mr-1 track-index">
                { index + 1 }
              </div>
              <div className="track-name">
                { item.name }
              </div>
            </div>
            <div className="track-duration t-right">
              { formatDuration(item.durationSeconds) }
            </div>
          </button>
        ),
      ) }
    </div>
  );
}

export default Playlist;
