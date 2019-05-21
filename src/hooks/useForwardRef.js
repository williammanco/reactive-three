import { useEffect } from 'react';

export default (ref, customRef) => {
  useEffect(() => {
    if (typeof ref === 'object' && ref !== null) ref.current = customRef.current; // eslint-disable-line
    if (typeof (ref) === 'function') ref(customRef.current);
  }, []);
};
