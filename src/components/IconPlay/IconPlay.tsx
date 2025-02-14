import React from 'react';

import { COLORS, UNIT } from '@/constants';
import type * as types from 'types';

function IconPlay(props: types.BaseIconProps): React.JSX.Element {
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
        viewBox="-0.5 0 7 7"
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
            transform="translate(-347.000000, -3766.000000)"
          >
            <g transform="translate(56.000000, 160.000000)">
              <path d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322" />
            </g>
          </g>
        </g>
      </svg> 
    </div>
  );
}

export default React.memo(IconPlay);
