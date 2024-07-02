import React from 'react';

import { COLORS, UNIT } from '@/constants';

interface IconStopProps {
  height?: number;
  iconColorBase?: string;
  iconColorHover?: string;
  isHovering?: boolean;
  width?: number;
}

function IconStop(props: IconStopProps): React.JSX.Element {
  const {
    height = UNIT * 2,
    iconColorBase = COLORS.accent,
    iconColorHover = COLORS.accentHighlight,
    isHovering = false,
    width = UNIT * 2,
  } = props;

  return (
    <div
      className="f ns j-center ai-center"
      style={{
        height,
        width,
      }}
    >
      <svg
        fill="none"
        height={height}
        viewBox="0 0 24 24"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M4 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12z"
          fill={isHovering ? iconColorHover : iconColorBase}
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default React.memo(IconStop);
