import React from 'react';

export default function useClickOutside<T>(
  refs: React.RefObject<HTMLElement>[],
  callback: () => T,
) {
  const handleClick = (event: MouseEvent) => {
    console.log('click', event, refs);
    for (let i = 0; i < refs.length; i += 1) {
      const typedElement = refs[i].current;
      if (typedElement && !typedElement.contains(event.target as HTMLElement)) {
        console.log('here', typedElement)
        callback();
        break;
      }
    }
  };

  React.useEffect(
    () => {
      console.log('register handler');
      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    },
  );
}
