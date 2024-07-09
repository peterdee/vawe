import React from 'react';

import './styles.css';

interface ButtonWithIconProps {
  globalStyles?: string;
  onClick: () => void;
  stopPropagation?: boolean;
  styles?: object;
  title?: string;
}

interface ChildProps {
  isHovering: boolean;
}

function ButtonWithIcon(
  props: React.PropsWithChildren<ButtonWithIconProps>,
): React.JSX.Element {
  const {
    children,
    globalStyles = '',
    onClick,
    stopPropagation = false,
    styles = {},
    title = '',
  } = props;

  const [hover, setHover] = React.useState<boolean>(false);

  const childrenWithAdditionalProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement<ChildProps>(
        child as React.ReactElement<ChildProps>,
        {
          isHovering: hover,
        },
      );
    }
    return child;
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    return onClick();
  }

  return (
    <button
      className={`f j-center ai-center ${globalStyles} icon-button`}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles,
      }}
      title={title}
      type="button"
    >
      { childrenWithAdditionalProps }
    </button>
  )
}

export default React.memo(ButtonWithIcon);
