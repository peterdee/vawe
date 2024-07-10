import React from 'react';

import { COLORS, UNIT } from '@/constants';
import type * as types from 'types';

function IconLoop(props: types.BaseIconProps): React.JSX.Element {
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
        fill={isHovering ? iconColorHover : iconColorBase}
        height={height}
        viewBox="0 0 20 20"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 7v7c0 1.103-.896 2-2 2H2c-1.104 0-2-.897-2-2V7a2 2 0 0 1 2-2h7V3l4 3.5L9 10V8H3v5h14V8h-3V5h4a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  );
}

export default React.memo(IconLoop);
