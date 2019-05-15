import { useEffect } from 'react';

export const updateProps = (instance, props) => {
  if (!instance || !instance.current || !props) return;
  Object.keys(props).forEach((key) => {
    if (props[key] === undefined || instance.current[key] === undefined) return;
    if (typeof props[key] === 'boolean') {
      instance.current[key] = props[key];
    } else if (instance.current[key] === null || typeof instance.current[key] !== 'object') {
      instance.current[key] = props[key];
    } else {
      Object.assign(instance.current[key], props[key]);
    }
  });
};

export default (instance, props) => useEffect(
  () => updateProps(instance, props),
  [props],
);
