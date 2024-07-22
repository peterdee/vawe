import type * as types from 'types';

function getNextIndex(
  index = 0,
  tracks: types.Track[],
  direction: types.ChangeTrackTo,
  iteration = 0,
): { id: string; path: string; } | null {
  if (iteration > tracks.length - 1) {
    return null;
  }
  let nextTrackIndex = index;
  if (direction === 'next') {
    nextTrackIndex += 1;
    if (nextTrackIndex > tracks.length - 1) {
      nextTrackIndex = 0;
    }
  } else {
    nextTrackIndex -= 1;
    if (nextTrackIndex < 0) {
      nextTrackIndex = tracks.length - 1;
    }
  }
  if (!tracks[nextTrackIndex].isAccessible) {
    return getNextIndex(
      nextTrackIndex,
      tracks,
      direction,
      iteration + 1,
    );
  }
  return {
    id: tracks[nextTrackIndex].id,
    path: tracks[nextTrackIndex].path,
  };
}

export default function getNextTrack(
  currentTrack: types.CurrentTrack,
  tracks: types.Track[],
  direction: types.ChangeTrackTo,
): { id: string; path: string; } | null {
  if (tracks.length === 0) {
    return null;
  }
  if (!currentTrack) {
    return getNextIndex(0, tracks, direction);
  }
  if (direction === 'current') {
    if (currentTrack.isAccessible) {
      return {
        id: currentTrack.id,
        path: currentTrack.path,
      };
    }
    return null;
  }

  let currentTrackIndex = 0;
  for (let i = 0; i < tracks.length; i += 1) {
    if (currentTrack.id === tracks[i].id) {
      currentTrackIndex = i;
      break;
    }
  }
  return getNextIndex(
    currentTrackIndex,
    tracks,
    direction,
  );
}
