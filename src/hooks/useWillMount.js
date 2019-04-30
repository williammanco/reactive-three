import { useCallback, useRef } from 'react';

export default (fn) => {
  const isMount = useRef();

  return useCallback(() => {
    if (!isMount.current) {
      isMount.current = true;
      fn();
    }
  }, [])();
};
