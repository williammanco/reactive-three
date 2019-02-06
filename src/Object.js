import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Object3D = forwardRef(({
  children,
  parent,
  geometry,
  material,
  external,
  use,
  call,
  ...props
}, ref) => {
  const self = useRef({});
  const { instance } = self.current;

  const pureProps = usePureProps(props, [
    'external',
    'material',
    'geometry',
  ]);

  useEffect(
    () => {
      if (self.current.instance) return;

      const Instance = call || THREE[use];
      if (external) {
        self.current.instance = external;
        if (geometry) external.geometry = geometry;
        if (material) external.material = material;
      } else if (geometry && material) {
        self.current.instance = new Instance(geometry, material);
      }

      if (ref) ref(self.current.instance);
    }, [geometry, material, external],
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

  useEffect(
    () => {
      if (!instance) return;
      instance.material = material;
      instance.geometry = geometry;
    },
    [material, geometry],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
});

Object3D.defaultProps = {
  external: false,
  call: false,
  use: 'Mesh',
};

export default Object3D;
