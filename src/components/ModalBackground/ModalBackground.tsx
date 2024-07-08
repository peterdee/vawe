import React from 'react';

import './styles.css';

interface ModalBackgroundProps {
  closeModal: () => void;
}

function ModalBackground(
  props: React.PropsWithChildren<ModalBackgroundProps>,
): React.JSX.Element {
  const {
    children,
    closeModal,
  } = props;

  return (
    <div
      className="background"
      onClick={closeModal}
    >
      { children }
    </div>
  );
}

export default React.memo(ModalBackground);
