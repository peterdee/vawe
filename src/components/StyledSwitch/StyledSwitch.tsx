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

  return (
    <label
      className={`f ai-center ns ${globalClasses}`}
      onClick={onChange}
    >
      <span className="mr-1 label">
        { labelText }
      </span>
      <input
        checked={checked}
        className="checkbox"
        readOnly
        type="checkbox"
      />
      <div className="slider" />
    </label>
  );
}

export default React.memo(StyledSwitch);
