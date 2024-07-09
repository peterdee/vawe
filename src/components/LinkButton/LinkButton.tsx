import React from 'react';

import './styles.css';

interface LinkButtonProps {
  globalClasses?: string;
  onClick: () => void;
  styles?: object;
  title?: string;
  type?: 'button' | 'submit';
}

function LinkButton(
  props: React.PropsWithChildren<LinkButtonProps>,
): React.JSX.Element {
  const {
    children,
    globalClasses = '',
    onClick,
    styles = {},
    title = '',
    type = 'button',
  } = props;

  return (
    <button
      className={`f j-center ai-center ${globalClasses} link-button`}
      onClick={onClick}
      style={{
        ...styles,
      }}
      title={title}
      type={type}
    >
      { children }
    </button>
  )
}

export default React.memo(LinkButton);
