import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Geometry = forwardRef(function Geometry({
  children,
  parent,
  geometry,
  material,
  params,
  use,
  call,
  ...props
}, ref) {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = call || THREE[use];
      if (instance) instance.dispose();
      self.current.instance = new Instance(...params);
      if (ref) ref(self.current.instance);
    },
    [use],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    material,
    geometry: instance,
  });
});

Geometry.defaultProps = {
  params: [1, 1, 1],
  call: false,
  use: 'BoxBufferGeometry',
};

export default Geometry;
