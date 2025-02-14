import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import {
  changeDetailsMetadata,
  changeSelectedTrackId,
  changeTrackNotAccessible,
  clearTracklist,
  shuffleTracklist,
} from '@/store/features/tracklist';
import { changeShowErrorModal } from '@/store/features/modals';
import { COLORS, UNIT } from '@/constants';
import formatDuration from '@/utilities/format-duration';
import getCoverURLs from '@/utilities/get-cover-urls';
import IconPlay from '@/components/IconPlay';
import type * as types from 'types';

const extendedWindow = window as types.ExtendedWindow;

function Playlist(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const queue = useSelector<RootState, string[]>(
    (state) => state.tracklist.queue,
  );
  const selectedTrackId = useSelector<RootState, string>(
    (state) => state.tracklist.selectedTrackId,
  );
  const tracks = useSelector<RootState, types.Track[]>(
    (state) => state.tracklist.tracks,
  );

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
    return extendedWindow.backend.addFilesRequest(paths);
  };

  const handleContextMenu = (id: string) => {
    extendedWindow.backend.loadMetadataRequest({
      id,
      path: tracks.filter((file: types.Track): boolean => file.id === id)[0].path,
    });
  };

  const handleDoubleClick = (id: string) => extendedWindow.backend.loadFileRequest({
    id,
    path: tracks.filter((file: types.Track): boolean => file.id === id)[0].path,
  });

  const toggleDragging = () => setIsDragging((value: boolean): boolean => !value);

  useEffect(
    () => {
      extendedWindow.backend.loadMetadataResponse((_, { error, id, metadata }) => {
        if (error || !metadata) {
          dispatch(changeTrackNotAccessible(id));
          return dispatch(changeShowErrorModal({
            message: 'Could not load track metadata!',
            showModal: true,
          }));
        }

        dispatch(changeDetailsMetadata({
          id,
          metadata: {
            common: {
              ...metadata.common,
              picture: undefined,
            },
            covers: getCoverURLs(metadata),
            format: metadata.format,
          }
        }));
        extendedWindow.backend.openTrackDetails();
      });

      extendedWindow.backend.menuClearPlaylistRequest(
        () => dispatch(clearTracklist()),
      );

      extendedWindow.backend.menuShufflePlaylistRequest(
        () => dispatch(shuffleTracklist()),
      );
    },
    [],
  );

  return (
    <div
      className={`f d-col m-1 drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={toggleDragging}
      onDragOver={handleDragOver}
      onDragLeave={toggleDragging}
      onDrop={handleDrop}
    >
      { tracks.length > 0 && tracks.map(
        (item: types.Track, index: number): React.JSX.Element => (
          <button
            className={`f j-space-between ai-center ph-half ns playlist-entry-wrap
              ${currentTrack && currentTrack.id === item.id
                ? 'playlist-entry-is-playing'
                : ''
              } ${selectedTrackId === item.id
                ? 'playlist-entry-selected'
                : ''
              } ${queue.includes(item.id)
                ? 'playlist-entry-queued'
                : ''
              } ${!item.isAccessible
                ? 'playlist-entry-not-accessible'
                : ''
              }`
            }
            key={item.id}
            onClick={() => dispatch(changeSelectedTrackId(item.id))}
            onContextMenu={() => handleContextMenu(item.id)}
            onDoubleClick={() => handleDoubleClick(item.id)}
            title={queue.indexOf(item.id) >= 0
              ? `Queue position: ${queue.indexOf(item.id) + 1}`
              : ''
            }
            type="button"
          >
            <div className="f ai-center">
              <div className="f j-center mr-1 track-index">
                { currentTrack && currentTrack.id === item.id && (
                  <IconPlay
                    height={UNIT}
                    iconColorBase={COLORS.accent}
                    width={UNIT}
                  />
                ) }
                {
                  (!currentTrack || (currentTrack && currentTrack.id !== item.id
                    && queue.includes(item.id)))
                    && queue.indexOf(item.id) + 1
                }
                {
                  (!currentTrack || (currentTrack && currentTrack.id !== item.id
                    && !queue.includes(item.id)))
                    && index + 1
                }
              </div>
              <div className="track-name t-left">
                { item.name }
              </div>
            </div>
            <div className="track-duration ml-1 t-right">
              { formatDuration(item.durationSeconds) }
            </div>
          </button>
        ),
      ) }
    </div>
  );
}

export default React.memo(Playlist);
