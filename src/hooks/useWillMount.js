import { useCallback, useRef } from 'react';

export default (fn) => {
  const isMount = useRef();

  const mount = useCallback(() => {
    if (!isMount.current) fn();
    isMount.current = true;
  }, []);

  mount();
};
