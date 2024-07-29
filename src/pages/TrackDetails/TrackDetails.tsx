import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { COLORS, UNIT } from '@/constants';
import downloadFile from '@/utilities/download-file';
import formatDuration from '@/utilities/format-duration';
import { getItem, removeItem } from '@/utilities/local-storage';
import IconAudio from '@/components/IconAudio';
import IconDownload from '@/components/IconDownload';
import IconExclamation from '@/components/IconExclamation';
import LinkButton from '@/components/LinkButton';
import StyledTextArea from '@/components/StyledTextArea/StyledTextArea';
import type * as types from 'types';
import './styles.css';

type ExtendedCustomAudioMetadata = types.CustomAudioMetadata & {
  id: string;
  path: string;
};

const extendedWindow = window as types.ExtendedWindow;

function TrackDetails(): React.JSX.Element {
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<ExtendedCustomAudioMetadata | null>(null);
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  useEffect(
    () => {
      const storedMetadata = getItem<ExtendedCustomAudioMetadata | null>('trackMetadata');
      if (!storedMetadata) {
        setMetadataLoadingError(true);
      } else {
        removeItem('trackMetadata');
        setMetadata(storedMetadata);
      }

      return () => {
        if (metadata && metadata.covers && metadata.covers.length > 0) {
          metadata.covers.forEach(
            (cover: types.CoverData) => URL.revokeObjectURL(cover.objectURL || ''),
          );
        }
      };
    },
    [],
  );

  useEffect(
    () => {
      if (metadata) {
        const pathPartials = metadata.path.split('/').reverse();
        const fileName = pathPartials[0];
        let title = 'VAWE';
        if (metadata.common.title) {
          if (metadata.common.artists && metadata.common.artists.length > 0) {
            title += `: ${metadata.common.artists.join(', ')} - ${metadata.common.title}`;
          } else if (metadata.common.artist) {
            title += `: ${metadata.common.artist} - ${metadata.common.title}`;
          }
        } else {
          title += `: ${fileName.split('.').reverse().slice(1).reverse().join('.')}`;
        }
        window.document.title = title;
      }
    },
    [metadata],
  );

  const handleRemoveTrack = useCallback(
    () => {
      if (metadata && !isRemoved) {
        setIsRemoved(true);
        extendedWindow.backend.removeTrackFromPlaylistRequest(metadata.id);
      }
    },
    [metadata],
  );

  const hanldeSaveCover = useCallback(
    () => {
      if (!(metadata && metadata.covers && metadata.covers.length > 0)) {
        return null;
      }

      return downloadFile(
        metadata.covers[0].objectURL || '',
        (metadata.covers[0].objectURL || '').split('/').reverse()[0].split('-')[0],
        metadata.covers[0].format === 'image/png'
          ? 'png'
          : 'jpg',
      );
    },
    [metadata],
  );

  const artist = useMemo(
    () => {
      if (metadata && metadata.common.artist) {
        let valueString = metadata.common.artist;
        if (metadata.common.artists && metadata.common.artists.length > 1) {
          valueString = metadata.common.artists.join(', ');
        }
        return valueString;
      } else {
        return '-';
      }
    },
    [metadata],
  );

  const bitrate = useMemo(
    () => {
      if (metadata && metadata.format.bitrate) {
        return `${Math.round(metadata.format.bitrate / 1000)}kbps`;
      } else {
        return '-';
      }
    },
    [metadata],
  );

  const sampleRate = useMemo(
    () => {
      if (metadata && metadata.format.sampleRate) {
        return `${metadata.format.sampleRate / 1000}khz`;
      } else {
        return '-';
      }
    },
    [metadata],
  );

  return (
    <div className="f d-col p-1">
      <div className="f ai-center j-space-between">
        <div className="f ai-center">
          <IconAudio
            height={UNIT * 2}
            width={UNIT * 2}
          />
          <h2
            className="ml-half ns"
            style={{ color: COLORS.accent }}
          >
            Track details
          </h2>
        </div>
        { !metadataLoadingError && !isRemoved && (
          <LinkButton
            onClick={handleRemoveTrack}
            styles={{
              border: `${UNIT / 16}px solid ${COLORS.error}`,
              borderRadius: `${UNIT / 4}px`,
              color: COLORS.error,
              padding: `${UNIT / 4}px`,
            }}
          >
            Remove track from playlist
          </LinkButton>
        ) }
      </div>
      { metadataLoadingError && (
        <div className="f ai-center j-center ns data-loading-error">
          <IconExclamation iconColorBase={COLORS.error} />
          <span className="ml-half error-message">
            Could not load metadata for a track!
          </span>
        </div>
      ) }
      { !metadataLoadingError && (
        <div className="f mt-1">
          <div className="f d-col col-left">
            <span className="ns detail-title">
              File path
            </span>
            <StyledTextArea
              globalClasses="mt-quarter"
              customStyles={{
                height: UNIT * 6,
                width: UNIT * 15,
              }}
              value={metadata?.path || ''}
            />
            <span className="mt-1 ns detail-title">
              Artist
            </span>
            <span className="mt-quarter">
              { artist }
            </span>
            <span className="mt-1 ns detail-title">
              Title
            </span>
            <span className="mt-quarter">
              { metadata?.common.title || '-' }
            </span>
            <span className="mt-1 ns detail-title">
              Album
            </span>
            <span className="mt-quarter">
              { metadata?.common.album || '-' }
            </span>
            <span className="mt-1 ns detail-title">
              Genre
            </span>
            <span className="mt-quarter">
              {
                (Array.isArray(metadata?.common.genre)
                  && metadata?.common.genre.join(', ')) || '-'
              }
            </span>
            <span className="mt-1 ns detail-title">
              Year
            </span>
            <span className="mt-quarter">
              { metadata?.common.year || '-' }
            </span>
            { metadata?.common.bpm && (
              <>
                <span className="mt-1 ns detail-title">
                  BPM
                </span>
                <span className="mt-quarter">
                  { metadata?.common.bpm }
                </span>
              </>
            ) }
          </div>
          <div className="f d-col mh-1 col-middle">
            <span className="ns detail-title">
              Track length
            </span>
            <span className="mt-quarter">
              { formatDuration(metadata?.format.duration || 0) }
            </span>
            <span className="mt-1 ns detail-title">
              Bitrate
            </span>
            <span className="mt-quarter">
              { bitrate }
            </span>
            <span className="mt-1 ns detail-title">
              Sample rate
            </span>
            <span className="mt-quarter">
              { sampleRate }
            </span>
            <span className="mt-1 ns detail-title">
              Channels
            </span>
            <span className="mt-quarter">
              { metadata?.format.numberOfChannels || '-' }
            </span>
            { metadata?.format.lossless && (
              <>
                <span className="mt-1 ns detail-title">
                  Bits per sample
                </span>
                <span className="mt-quarter">
                  { metadata?.format.bitsPerSample }
                </span>
              </>
            ) }
          </div>
          { metadata?.covers && metadata.covers.length > 0 && (
            <div className="f d-col ns ml-1">
              <span className="detail-title">
                Cover
              </span>
              <div
                className="mt-quarter"
                style={{
                  backgroundImage: `url(${metadata?.covers[0].objectURL})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  height: `${UNIT * 15}px`,
                  width: `${UNIT * 15}px`,
                }}
              />
              <div className="f ai-center mt-1">
                <LinkButton
                  globalClasses="f ai-center"
                  onClick={hanldeSaveCover}
                >
                  <span className="mr-half">
                    Save cover on disk
                  </span>
                  <IconDownload
                    height={UNIT * 1.5}
                    width={UNIT * 1.5}
                  />
                </LinkButton>
              </div>
            </div>
          ) }
        </div>
      ) }
    </div>
  );
}

export default React.memo(TrackDetails);
