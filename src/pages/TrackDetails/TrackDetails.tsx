import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { COLORS, UNIT } from '@/constants';
import downloadFile from '@/utilities/download-file';
import { getItem } from '@/utilities/local-storage';
import IconAudio from '@/components/IconAudio';
import IconDownload from '@/components/IconDownload';
import IconExclamation from '@/components/IconExclamation';
import LinkButton from '@/components/LinkButton';
import StyledTextArea from '@/components/StyledTextArea/StyledTextArea';
import type * as types from 'types';
import './styles.css';

type ExtendedCustomAudioMetadata = types.CustomAudioMetadata & {
  path: string;
};

function TrackDetails(): React.JSX.Element {
  const [metadata, setMetadata] = useState<ExtendedCustomAudioMetadata | null>(null);
  const [metadataLoadingError, setMetadataLoadingError] = useState<boolean>(false);

  useEffect(
    () => {
      const storedMetadata = getItem<ExtendedCustomAudioMetadata | null>('trackMetadata');
      if (!storedMetadata) {
        setMetadataLoadingError(true);
      } else {
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
            title += `: ${metadata.common.artists.join(', ')} - ${title}`;
          } else if (metadata.common.artist) {
            title += `: ${metadata.common.artist} - ${title}`;
          }
        } else {
          title += `: ${fileName.split('.').reverse().slice(1).reverse().join('.')}`;
        }
        window.document.title = title;
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

  return (
    <div className="f d-col p-1">
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
      { metadataLoadingError && (
        <div className="f ai-center j-center ns data-loading-error">
          <IconExclamation iconColorBase={COLORS.error} />
          <span className="ml-half error-message">
            Could not load metadata for a track!
          </span>
        </div>
      ) }
      { !metadataLoadingError && (
        <div className="f j-space-between mt-1">
          <div className="f d-col">
            <span className="ns detail-title">
              File path
            </span>
            <StyledTextArea
              globalClasses="mt-half"
              customStyles={{
                height: UNIT * 5,
                width: UNIT * 20,
              }}
              value={metadata?.path || ''}
            />
            <span className="mt-1 ns detail-title">
              Artist
            </span>
            <span className="mt-half">
              { artist }
            </span>
            <span className="mt-1 ns detail-title">
              Title
            </span>
            <span className="mt-half">
              { metadata?.common.title || '-' }
            </span>
            <span className="mt-1 ns detail-title">
              Album
            </span>
            <span className="mt-half">
              { metadata?.common.album || '-' }
            </span>
            <span className="mt-1 ns detail-title">
              Genre
            </span>
            <span className="mt-half">
              {
                (Array.isArray(metadata?.common.genre)
                  && metadata?.common.genre.join(', ')) || '-'
              }
            </span>
            <span className="mt-1 ns detail-title">
              Year
            </span>
            <span className="mt-half">
              { metadata?.common.year || '-' }
            </span>
          </div>
          { metadata?.covers && metadata.covers.length > 0 && (
            <div className="f d-col ns ml-1">
              <span className="detail-title">
                Cover
              </span>
              <div
                className="mt-half"
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
