import React from 'react';

import './styles.css';

interface StyledSwitchProps {
  checked: boolean;
  globalClasses?: string;
  labelText: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
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
    <label className={`f ai-center ns ${globalClasses}`}>
      <span className="mr-1 label">
        { labelText }
      </span>
      <input
        checked={checked}
        className="checkbox"
        onChange={onChange}
        type="checkbox"
      />
      <div className="slider" />
    </label>
  );
}

export default React.memo(StyledSwitch);
