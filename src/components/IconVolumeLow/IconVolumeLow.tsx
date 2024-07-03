import React from 'react';

import { COLORS, UNIT } from '@/constants';

interface IconVolumeLowProps {
  height?: number;
  iconColorBase?: string;
  iconColorHover?: string;
  isHovering?: boolean;
  width?: number;
}

function IconVolumeLow(props: IconVolumeLowProps): React.JSX.Element {
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
          d="M17.52 3.78168C16.4 3.16168 14.97 3.32168 13.51 4.23168L10.59 6.06168C10.39 6.18168 10.16 6.25168 9.93 6.25168H9H8.5C6.08 6.25168 4.75 7.58168 4.75 10.0017V14.0017C4.75 16.4217 6.08 17.7517 8.5 17.7517H9H9.93C10.16 17.7517 10.39 17.8217 10.59 17.9417L13.51 19.7717C14.39 20.3217 15.25 20.5917 16.05 20.5917C16.57 20.5917 17.07 20.4717 17.52 20.2217C18.63 19.6017 19.25 18.3117 19.25 16.5917V7.41168C19.25 5.69168 18.63 4.40168 17.52 3.78168Z"
          fill={isHovering ? iconColorHover : iconColorBase}
        />
      </svg>
    </div>
  );
}

export default React.memo(IconVolumeLow);
