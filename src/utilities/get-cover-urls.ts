import type { IAudioMetadata } from 'music-metadata';

import type * as types from 'types';

export default function getCoverURLs(metadata: IAudioMetadata | null): types.CoverData[] {
  const covers: types.CoverData[] = [];
  if (
    metadata
    && metadata.common
    && metadata.common.picture
    && metadata.common.picture.length > 0
  ) {
    metadata.common.picture.forEach((value) => {
      if (value.data) {
        covers.push({
          format: value.format,
          objectURL: URL.createObjectURL(new Blob([value.data])),
        });
      }
    });
  }
  return covers;
}
