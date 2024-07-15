import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { changeShowErrorModal } from '@/store/features/modals';
import { COLORS } from '../../../constants';
import IconClose from '@/components/IconClose';
import ModalBackground from '@/components/ModalBackground';
import useClickOutside from '@/hooks/use-click-outsude';
import '../styles.css';

function CoverModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const errorMessage = useSelector<RootState, string>(
    (state) => state.modals.errorModalMessage,
  );

  const ref = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    dispatch(changeShowErrorModal({
      message: '',
      showModal: false,
    }));
  };
  
  useClickOutside<void>(ref, handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f d-col j-space-between p-1 error-modal-wrap"
        ref={ref}
      >
        <div className="f ai-center j-space-between">
          <h2 className="error-modal-title ns">
            Error
          </h2>
          <ButtonWithIcon
            globalStyles="ml-1"
            onClick={handleCloseModal}
          >
            <IconClose
              iconColorBase={COLORS.error}
              iconColorHover={COLORS.errorLight}
              title="Close"
            />
          </ButtonWithIcon>
        </div>
        <div className="mt-1 error-modal-text ns">
          { errorMessage }
        </div>
      </div>
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
