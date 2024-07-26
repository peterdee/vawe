import React from 'react';

import { COLORS, UNIT } from '@/constants';
import type * as types from 'types';

function IconDisk(props: types.BaseIconProps): React.JSX.Element {
  const {
    height = UNIT * 2,
    iconColorBase = COLORS.accent,
    iconColorHover = COLORS.accentHighlight,
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
        viewBox="0 0 501.333 501.333"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
      >
        <path
          d="M250.667,0C112,0,0,112,0,250.667s112,250.667,250.667,250.667s250.667-112,250.667-250.667
	            S389.333,0,250.667,0z M250.667,285.867c-19.2,0-35.2-16-35.2-35.2s16-35.2,35.2-35.2s35.2,16,35.2,35.2
	            S269.867,285.867,250.667,285.867z"
          fill={iconColorBase}
        />
        <path
          d="M250.667,146.133c-57.6,0-104.533,46.933-104.533,104.533S193.067,355.2,250.667,355.2
	          S355.2,308.267,355.2,250.667S308.267,146.133,250.667,146.133z M250.667,285.867c-19.2,0-35.2-16-35.2-35.2s16-35.2,35.2-35.2
	          s35.2,16,35.2,35.2S269.867,285.867,250.667,285.867z"
          fill={iconColorHover}
        />
      </svg>
    </div>
  );
}

export default React.memo(IconDisk);
