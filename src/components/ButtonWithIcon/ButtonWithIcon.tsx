import React from 'react';

import './styles.css';

interface ButtonWithIconProps {
  globalStyles?: string;
  onClick: () => void;
  title?: string;
}

function ButtonWithIcon(
  props: React.PropsWithChildren<ButtonWithIconProps>,
): React.JSX.Element {
  const {
    children,
    globalStyles = '',
    onClick,
    title = '',
  } = props;

  return (
    <button
      className={`f j-center ai-center ${globalStyles} icon-button`}
      onClick={onClick}
      title={title}
      type="button"
    >
      { children }
    </button>
  )
}

export default React.memo(ButtonWithIcon);
