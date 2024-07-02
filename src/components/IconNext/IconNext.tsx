import React from 'react';

import { COLORS, UNIT } from '@/constants';

interface IconNextProps {
  height?: number;
  iconColorBase?: string;
  iconColorHover?: string;
  isHovering?: boolean;
}

function IconNext(props: IconNextProps): React.JSX.Element {
  const {
    height = UNIT * 2,
    iconColorBase = COLORS.accent,
    iconColorHover = COLORS.accentHighlight,
    isHovering = false,
  } = props;

  return (
    <div
      className="f ns j-center ai-center"
      style={{
        height,
        width: 'auto',
      }}
    >
      <svg 
        height={height}
        version="1.1"
        viewBox="0 -2 12 12"
        xmlns="http://www.w3.org/2000/svg"
        width="auto"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="1"
        >
          <g
            fill={isHovering ? iconColorHover : iconColorBase}
            transform="translate(-144.000000, -3805.000000)"
          >
            <g transform="translate(56.000000, 160.000000)">
              <path d="M99.684,3649.69353 L95.207,3652.82453 C94.571,3653.25353 94,3652.84553 94,3652.13153 L94,3650.14053 L89.78,3652.82453 C89.145,3653.25353 88,3652.84553 88,3652.13153 L88,3645.86853 C88,3645.15453 89.145,3644.74653 89.78,3645.17453 L94,3647.85953 L94,3645.86853 C94,3645.15453 94.571,3644.74653 95.207,3645.17453 L99.516,3648.30653 C100.03,3648.65353 100.198,3649.34653 99.684,3649.69353" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export default React.memo(IconNext);
