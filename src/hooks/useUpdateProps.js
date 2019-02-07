import { useEffect } from 'react';

export default (instance, props) => useEffect(
  () => {
    if (!instance || !props) return;
    Object.keys(props).forEach((key) => {
      if (props[key] === undefined || instance[key] === undefined) return;
      if (typeof props[key] === 'boolean') {
        instance[key] = props[key];
      } else if (instance[key] === null || typeof instance[key] !== 'object') {
        instance[key] = props[key];
      } else {
        Object.assign(instance[key], props[key]);
      }
    });
  },
  [props],
);
