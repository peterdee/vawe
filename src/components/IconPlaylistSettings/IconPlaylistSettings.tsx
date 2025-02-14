import React from 'react';

import { COLORS, UNIT } from '@/constants';
import type * as types from 'types';

function IconPlaylistSettings(props: types.BaseIconProps): React.JSX.Element {
  const {
    height = UNIT * 2,
    iconColorBase = COLORS.accent,
    iconColorHover = COLORS.accentHighlight,
    isHovering = false,
    title = '',
    width = UNIT * 2,
  } = props;

  return (
    <div
      className="f ns j-center ai-center"
      style={{
        height,
        width,
      }}
      title={title}
    >
      <svg
        height={height}
        version="1.1"
        viewBox="0 -3.5 21 21"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="1"
        >
          <g
            fill={isHovering ? iconColorHover : iconColorBase}
            transform="translate(-99.000000, -760.000000)"
          >
            <g transform="translate(56.000000, 160.000000)">
              <path d="M53.5,603 C53.5,602.647 53.5756,602 53.6932,602 L43,602 L43,604 L53.6932,604 C53.5756,604 53.5,603.353 53.5,603 L53.5,603 Z M61.7068,602 C61.27315,601 60.1192,600 58.75,600 C57.01015,600 55.6,601.343 55.6,603 C55.6,604.657 57.01015,606 58.75,606 C60.1192,606 61.27315,605 61.7068,604 L64,604 L64,602 L61.7068,602 Z M53.5,611 C53.5,611.353 53.4244,611.686 53.3068,612 L64,612 L64,610 L53.3068,610 C53.4244,610 53.5,610.647 53.5,611 L53.5,611 Z M51.4,611 C51.4,612.657 49.98985,614 48.25,614 C46.8808,614 45.72685,613 45.2932,612 L43,612 L43,610 L45.2932,610 C45.72685,609 46.8808,608 48.25,608 C49.98985,608 51.4,609.343 51.4,611 L51.4,611 Z" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default React.memo(IconPlaylistSettings);
