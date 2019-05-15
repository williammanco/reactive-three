import { useMemo } from 'react';
import omit from '../utils/omit';

export default (props, excludeProps = []) => useMemo(
  () => omit(
    props,
    [
      ...excludeProps,
      'children',
      'parent',
      'params',
      'loaded',
      'use',
      'call',
      'debug',
    ],
  ), [props, excludeProps],
);
