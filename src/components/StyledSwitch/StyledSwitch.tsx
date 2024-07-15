import React from 'react';

import './styles.css';

interface StyledSwitchProps {
  checked: boolean;
  globalClasses?: string;
  labelText: string;
  onChange: () => void;
}

function StyledSwitch(
  props: StyledSwitchProps,
): React.JSX.Element {
  const {
    checked,
    globalClasses = '',
    labelText,
    onChange,
  } = props;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    return onChange();
  }

  return (
    <label
      className={`f ai-center ns ${globalClasses}`}
    >
      <span
        onClick={handleClick}
        className="mr-1 label"
      >
        { labelText }
      </span>
      <input
        checked={checked}
        className="checkbox"
        readOnly
        type="checkbox"
      />
      <div
        className="slider" 
        onClick={handleClick}
      />
    </label>
  );
}

export default React.memo(StyledSwitch);
