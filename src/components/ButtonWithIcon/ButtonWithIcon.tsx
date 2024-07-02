import React from 'react';

import './styles.css';

interface ButtonWithIconProps {
  globalStyles?: string;
  onClick: () => void;
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

  return (
    <button
      className={`f j-center ai-center ${globalStyles} icon-button`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      type="button"
    >
      { childrenWithAdditionalProps }
    </button>
  )
}

export default React.memo(ButtonWithIcon);
