import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import formatDuration from '@/utilities/format-duration';
import formatTrackName from '@/utilities/format-track-name';
import type { RootState } from '@/store';
import * as types from 'types';

interface PlaylistProps {
  currentTrackId: string;
  handleFileDrop: (event: React.DragEvent) => void;
  handlePlaylistEntryClick: (id: string) => void;
  handlePlaylistEntryDoubleClick: (id: string) => void;
  handlePlaylistEntryContextMenu: (id: string) => void;
  selectedTrackId: string;
}

function Playlist(props: PlaylistProps): React.JSX.Element {
  const {
    currentTrackId = '',
    handleFileDrop,
    handlePlaylistEntryClick,
    handlePlaylistEntryDoubleClick,
    handlePlaylistEntryContextMenu,
    selectedTrackId = '',
  } = props;

  const queue = useSelector<RootState, string[]>((state) => state.tracklist.queue);
  const tracks = useSelector<RootState, types.ParsedFile[]>((state) => state.tracklist.tracks);

  console.log('playlist render');

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    toggleDragging();
    return handleFileDrop(event);
  }

  const toggleDragging = () => setIsDragging((value: boolean) => !value);

  return (
    <div
      className={`f d-col m-1 drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={toggleDragging}
      onDragOver={handleDragOver}
      onDragLeave={toggleDragging}
      onDrop={handleDrop}
    >
      { tracks.length > 0 && tracks.map(
        (item: types.ParsedFile, index: number): React.JSX.Element => (
          <button
            className={`f j-space-between ai-center ph-half ns playlist-entry-wrap
              ${currentTrackId === item.id
                ? 'playlist-entry-highlight'
                : ''
              } ${selectedTrackId === item.id
                ? 'playlist-entry-selected'
                : ''
              } ${queue.includes(item.id)
                ? 'playlist-entry-queued'
                : ''
              }`
            }
            key={item.path}
            onClick={() => handlePlaylistEntryClick(item.id)}
            onContextMenu={() => handlePlaylistEntryContextMenu(item.id)}
            onDoubleClick={() => handlePlaylistEntryDoubleClick(item.id)}
            title={`Queue position: ${queue.indexOf(item.id) + 1}`}
            type="button"
          >
            <div className="f">
              <div className="mr-1 track-index">
                { index + 1 }
              </div>
              <div className="track-name">
                { formatTrackName(item.name) }
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

export default React.memo(Playlist);
