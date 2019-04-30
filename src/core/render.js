import {
  cloneElement, createElement, useContext,
} from 'react';
import Context from '../context';

export default (
  children,
  instance,
  props = {},
  context = {},
  active = true,
  extPrevContext,
) => {
  let arr = [];
  let prevContext = extPrevContext;

  if (Array.isArray(children)) {
    arr = children;
  } else {
    arr.push(children);
  }

  if (!prevContext) {
    prevContext = useContext(Context);
  }

  return active && arr
    .map((child, key) => {
      if (child) {
        return createElement(Context.Provider, {
          value: {
            ...prevContext,
            state: {
              ...prevContext.state,
              ...context,
            },
          },
          key,
        }, typeof child === 'function' ? child({ ...props }, instance) : cloneElement(child, {
          ...props,
          parent: instance,
          key,
        }));
      }
      return false;
    });
};
