import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import { COLORS, UNIT } from '@/constants';
import IconDisk from '@/components/IconDisk';
import type * as types from 'types';
import '../styles.css';
import { changeShowCoverModal } from '@/store/features/playlistSettings';

function TrackInfo(): React.JSX.Element {
  const [coverLink, setCoverLink] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();

  const currentTrack = useSelector<RootState, types.Track | null>(
    (state) => state.tracklist.currentTrack,
  );
  const currentTrackMetadata = useSelector<RootState, types.TrackMetadata | null>(
    (state) => state.tracklist.currentTrackMetadata,
  );

  const album = useMemo(
    (): string => currentTrackMetadata
      && currentTrackMetadata.metadata
      && currentTrackMetadata.metadata.common.album || '',
    [currentTrackMetadata],
  );

  const genre = useMemo(
    () => {
      if (currentTrackMetadata && currentTrackMetadata.metadata) {
        const string = Array.isArray(currentTrackMetadata.metadata.common.genre)
          && currentTrackMetadata.metadata.common.genre.length > 0
          ? currentTrackMetadata.metadata.common.genre.join(', ')
          : '';
        return string;
      }
      return '';
    },
    [currentTrackMetadata],
  );

  const metadataString = useMemo(
    () => {
      if (currentTrackMetadata && currentTrackMetadata.metadata) {
        let bitrate = currentTrackMetadata.metadata.format.bitrate;
        if (bitrate) {
          bitrate = Math.round(bitrate / 1000);
        }
        let string = `${bitrate}kbps / ${
          currentTrackMetadata.metadata.format.sampleRate
        }khz / `;
        string += currentTrackMetadata.metadata.format.numberOfChannels === 2
          ? 'stereo'
          : 'mono';
        return string;
      }
      return '';
    },
    [currentTrackMetadata],
  );

  useEffect(
    () => {
      if (currentTrackMetadata
        && currentTrackMetadata.metadata
        && currentTrackMetadata.metadata.covers
        && currentTrackMetadata.metadata.covers.length > 0) {
        setCoverLink(currentTrackMetadata.metadata.covers[0].objectURL || '');
      } else {
        setCoverLink('');
      }

      return () => {
        if (coverLink) {
          URL.revokeObjectURL(coverLink);
        }
      };
    },
    [currentTrackMetadata],
  );

  // TODO: cover picture size should be controlled via settings
  const size = UNIT * 15;

  return (
    <div className="f ai-center w-100vh mh-1 pt-1">
      <div
        className="f j-center"
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        { coverLink && (
          <div
            onDoubleClick={() => dispatch(changeShowCoverModal(true))}
            style={{
              backgroundImage: `url(${coverLink})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              cursor: 'pointer',
              height: `${size}px`,
              width: `${size}px`,
            }}
          />
        ) }
        { !coverLink && (
          <IconDisk
            height={size}
            iconColorBase={COLORS.accent}
            width={size}
          />
        ) }
      </div>
      <div className="f d-col ml-1">
        <div>
          { currentTrack && currentTrack.name || 'VAWE' }
        </div>
        <div>
          { currentTrack && currentTrack.name && `Stats: ${metadataString}` }
        </div>
        { album && (
          <div>
            { `Album: ${album}` }
          </div>  
        ) }
        { genre && (
          <div>
            { `Genre: ${genre}` }
          </div>  
        ) }
      </div>
    </div>
  );
}

export default React.memo(TrackInfo);
