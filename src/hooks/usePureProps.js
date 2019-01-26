import { useMemo } from 'react';
import omit from '../utils/omit';

export default (props, excludeProps = []) => useMemo(
  () => omit(
    props,
    [
      ...excludeProps,
      'children',
      'parent',
      'getRef',
      'options',
      'loaded',
      'use',
    ],
  ), [props, excludeProps],
);
