import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { COLORS, UNIT } from '../../../constants';
import { changeShowCoverModal } from '@/store/features/playlistSettings';
import IconClose from '@/components/IconClose';
import ModalBackground from '@/components/ModalBackground';
import useClickOutside from '@/hooks/use-click-outsude';

const iconSize = UNIT * 2.5;

function CoverModal(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const ref = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    dispatch(changeShowCoverModal(false));
  };
  
  useClickOutside<void>(ref, handleCloseModal);

  return (
    <ModalBackground>
      <div
        className="f d-col j-space-between p-1"
        ref={ref}
      >
        <div className="f ai-center j-space-between">
          <h2 className="title-error">
            Error
          </h2>
          <ButtonWithIcon
            globalStyles="ml-1"
            onClick={handleCloseModal}
          >
            <IconClose
              height={iconSize}
              iconColorBase={COLORS.error}
              iconColorHover={COLORS.errorLight}
              title="Close"
              width={iconSize}
            />
          </ButtonWithIcon>
        </div>
        <div className="mt-1">
          Error text
        </div>
      </div>
    </ModalBackground>
  );
}

export default React.memo(CoverModal);
