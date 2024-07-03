import React from 'react';

import { COLORS, UNIT } from '@/constants';

interface IconVolumeMediumProps {
  height?: number;
  iconColorBase?: string;
  iconColorHover?: string;
  isHovering?: boolean;
  width?: number;
}

function IconVolumeMedium(props: IconVolumeMediumProps): React.JSX.Element {
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
          d="M19.3284 16.7503C19.1684 16.7503 19.0184 16.7003 18.8784 16.6003C18.5484 16.3503 18.4784 15.8803 18.7284 15.5503C20.2984 13.4603 20.2984 10.5403 18.7284 8.45027C18.4784 8.12027 18.5484 7.65027 18.8784 7.40027C19.2084 7.15027 19.6784 7.22027 19.9284 7.55027C21.8984 10.1703 21.8984 13.8303 19.9284 16.4503C19.7884 16.6503 19.5584 16.7503 19.3284 16.7503Z"
          fill={isHovering ? iconColorHover : iconColorBase}
        />
        <path
          d="M15.3481 3.78168C14.2281 3.16168 12.7981 3.32168 11.3381 4.23168L8.41813 6.06168C8.21813 6.18168 7.98813 6.25168 7.75813 6.25168H6.82812H6.32812C3.90812 6.25168 2.57812 7.58168 2.57812 10.0017V14.0017C2.57812 16.4217 3.90812 17.7517 6.32812 17.7517H6.82812H7.75813C7.98813 17.7517 8.21813 17.8217 8.41813 17.9417L11.3381 19.7717C12.2181 20.3217 13.0781 20.5917 13.8781 20.5917C14.3981 20.5917 14.8981 20.4717 15.3481 20.2217C16.4581 19.6017 17.0781 18.3117 17.0781 16.5917V7.41168C17.0781 5.69168 16.4581 4.40168 15.3481 3.78168Z"
          fill={isHovering ? iconColorHover : iconColorBase}
        />
      </svg>
    </div>
  );
}

export default React.memo(IconVolumeMedium);
