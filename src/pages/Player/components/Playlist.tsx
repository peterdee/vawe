import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeSelectedTrackId } from '@/store/features/tracklist';
import formatDuration from '@/utilities/format-duration';
import formatTrackName from '@/utilities/format-track-name';
import { AppDispatch, type RootState } from '@/store';
import * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function Playlist(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.ParsedFile | null>(
    (state) => state.tracklist.currentTrack,
  );
  const queue = useSelector<RootState, string[]>(
    (state) => state.tracklist.queue,
  );
  const selectedTrackId = useSelector<RootState, string>(
    (state) => state.tracklist.selectedTrackId,
  );
  const tracks = useSelector<RootState, types.ParsedFile[]>(
    (state) => state.tracklist.tracks,
  );

  console.log('playlist render');

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent) => {
    toggleDragging();
    const paths: string[] = [];
    for (const item of event.dataTransfer.files) {
      paths.push(item.path);
    }
    return extendedWindow.backend.handleDrop(paths);
  };

  const handleContextMenu = (id: string) => {
    const [track] = tracks.filter((item: types.ParsedFile): boolean => item.id === id);
    if (track.metadata) {
      return console.log('metadata already loaded:', track.metadata);
    }
    return extendedWindow.backend.requestMetadata({
      id,
      path: track.path,
    });
  };

  const handleDoubleClick = (id: string) => extendedWindow.backend.loadFileRequest({
    id,
    path: tracks.filter((file: types.ParsedFile): boolean => file.id === id)[0].path,
  });

  const toggleDragging = () => setIsDragging((value: boolean): boolean => !value);

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
              ${currentTrack && currentTrack.id === item.id
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
            onClick={() => dispatch(changeSelectedTrackId(item.id))}
            onContextMenu={() => handleContextMenu(item.id)}
            onDoubleClick={() => handleDoubleClick(item.id)}
            title={queue.indexOf(item.id) >= 0
              ? `Queue position: ${queue.indexOf(item.id) + 1}`
              : ''
            }
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
