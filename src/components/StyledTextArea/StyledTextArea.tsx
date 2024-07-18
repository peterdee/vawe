import React from 'react';

import './styles.css';

interface StyledTextAreaProps {
  customStyles?: object;
  disabled?: boolean;
  editable?: boolean;
  globalClasses?: string;
  onChange?: (value: string) => void;
  value: string;
}

function StyledTextArea(props: StyledTextAreaProps): React.JSX.Element {
  const {
    customStyles = {},
    disabled = false,
    editable = true,
    globalClasses = '',
    onChange = null,
    value,
  } = props;

  const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (editable && onChange) {
      onChange(event.currentTarget.value);
    }
  }

  return (
    <textarea
      className={`textarea ${globalClasses}`}
      disabled={disabled}
      onChange={handleChange}
      style={{
        ...customStyles,
      }}
      value={value}
    />
  );
}

export default React.memo(StyledTextArea);
