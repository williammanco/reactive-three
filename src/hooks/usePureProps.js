import { useMemo } from 'react';
import omit from '../utils/omit';

export default (props, excludeProps = []) => useMemo(
  () => omit(
    props,
    [
      ...excludeProps,
      'children',
      'parent',
      'options',
      'loaded',
      'use',
      'call',
    ],
  ), [props, excludeProps],
);
