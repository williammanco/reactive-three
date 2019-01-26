import { cloneElement } from 'react';

export default (children, instance, props = {}, onlyFunc) => {
  let arr = [];
  // eslint-disable-next-line no-unused-expressions
  Array.isArray(children) ? arr = children : arr.push(children);
  return arr
    .map((child) => {
      if (typeof child === 'function') {
        return child(instance, { ...props });
      }
      if (typeof child === 'object' && !onlyFunc) {
        return cloneElement(child, {
          ...props,
          parent: instance,
        });
      }
      return false;
    });
};
