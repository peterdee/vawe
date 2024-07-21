import type * as types from 'types';

function getNextTrackId(
  tracks: types.Track[],
  currentTrackId: string,
  direction: types.ChangeTrackTo,
): string {
  if (direction === 'current') {
    return currentTrackId;
  }
  let currentTrackIndex = 0;
  for (let i = 0; i < tracks.length; i += 1) {
    if (currentTrackId === tracks[i].id) {
      currentTrackIndex = i;
      break;
    }
  }
  
}
