import React from 'react';

import { COLORS, UNIT } from '@/constants';
import type * as types from 'types';

function IconExclamation(props: types.BaseIconProps): React.JSX.Element {
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
        fill="none"
        height={height}
        viewBox="0 0 24 24"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          stroke={isHovering ? iconColorHover : iconColorBase}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M12 8V13"
          stroke={isHovering ? iconColorHover : iconColorBase}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M11.9945 16H12.0035"
          stroke={isHovering ? iconColorHover : iconColorBase}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default React.memo(IconExclamation);
