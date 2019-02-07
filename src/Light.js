import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Light = forwardRef(function Light({
  children,
  parent,
  params,
  use,
  call,
  ...props
}, ref) {
  const self = useRef({});
  const { instance } = self.current;

  const pureProps = usePureProps(props);

  useEffect(
    () => {
      if (self.current.instance) return;

      const Instance = call || THREE[use];
      self.current.instance = new Instance(...params);
      if (ref) ref(self.current.instance);
    },
    [],
  );

  useEffect(
    () => {
      if (!parent || !instance) return;
      parent.add(instance);
      return () => {
        parent.remove(instance);
      };
    },
    [parent, instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
});

Light.defaultProps = {
  params: [],
  call: false,
  use: 'PointLight',
};

export default Light;
