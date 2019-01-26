import {
  useEffect,
  useRef,
} from 'react';
import {
  BoxBufferGeometry,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Geometry = ({
  getRef,
  children,
  parent,
  geometry,
  material,
  options,
  use,
  ...props
}) => {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = use;
      if (instance) instance.dispose();
      self.current.instance = new Instance(...options);
      getRef(self.current.instance);
    },
    [use],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    material,
    geometry: instance,
  });
};

Geometry.defaultProps = {
  getRef: () => false,
  options: [1, 1, 1],
  use: BoxBufferGeometry,
};

export default Geometry;
