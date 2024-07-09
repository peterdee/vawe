import React from 'react';

import './styles.css';

function ModalBackground(props: React.PropsWithChildren): React.JSX.Element {
  const { children } = props;

  return (
    <div className="background">
      { children }
    </div>
  );
}

export default React.memo(ModalBackground);
