import { cloneElement } from 'react';

export default (children, instance, props = {}, onlyFunc) => {
  let arr = [];
  if (Array.isArray(children)) {
    arr = children;
  } else {
    arr.push(children);
  }
  return arr
    .map((child, key) => {
      if (typeof child === 'function') {
        return child(instance, { ...props, key });
      }
      if (typeof child === 'object' && !onlyFunc) {
        return cloneElement(child, {
          ...props,
          parent: instance,
          key,
        });
      }
      return false;
    });
};
