import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { COLORS, UNIT } from '@/constants';
import downloadFile from '@/utilities/download-file';
import { getItem } from '@/utilities/local-storage';
import IconAudio from '@/components/IconAudio';
import IconDownload from '@/components/IconDownload';
import IconExclamation from '@/components/IconExclamation';
import LinkButton from '@/components/LinkButton';
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
        console.log(metadata)
        const fileName = metadata
          .path
          .split('/')
          .slice(0, metadata.path.split('.').length - 1)
          .join('.');
        const title = `VAWE: ${fileName}`;
        // if () {
        //   title = `VAWE: ${currentTrack.name}`;
        // }
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
          <div>
            { `Artist: ${metadata?.common.artist}` }
          </div>
          { metadata?.covers && metadata.covers.length > 0 && (
            <div className="f d-col ns ml-1">
              <span>
                Cover
              </span>
              <div
                className="mt-1"
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
