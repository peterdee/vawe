import React, {
  useEffect,
  useRef,
  useState,
} from 'react';


export default function useRefState<T>(initialValue: T): [
  React.MutableRefObject<T>,
  React.Dispatch<React.SetStateAction<T>>,
] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  useEffect(
    () => {
      stateRef.current = state;
    },
    [state],
  );
  return [stateRef, setState];
};
