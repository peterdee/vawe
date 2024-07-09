import React from 'react';

export default function useClickOutside<T>(
  ref: React.RefObject<HTMLElement>,
  callback: () => T,
) {
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    const typedElement = ref.current;
    if (typedElement && !typedElement.contains(event.target as HTMLElement)) {
      callback();
    }
  };

  React.useEffect(
    () => {
      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    },
  );
}
