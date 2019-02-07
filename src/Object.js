import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Object3D = forwardRef(function Object3D({
  children,
  parent,
  geometry,
  material,
  loaded,
  loader,
  params,
  use,
  call,
  ...props
}, ref) {
  const self = useRef({});

  const pureProps = usePureProps(props, [
    'material',
    'geometry',
  ]);

  useEffect(
    () => {
      const Instance = call || THREE[use];
      if (loaded || loader) {
        if (loaded) {
          loaded.traverse((child) => {
            if (child.type === 'Mesh') {
              if (geometry) child.geometry = geometry;
              if (material) child.material = material;
            }
          });
          self.current.instance = loaded;
        }
      } else if (geometry && material) {
        self.current.instance = new Instance(geometry, material);
      } else {
        self.current.instance = new Instance(...params);
      }

      if (ref) ref(self.current.instance);
    }, [geometry, material, loaded],
  );


  useEffect(
    () => {
      const { instance } = self.current;

      if (!parent || !instance) return;

      parent.add(instance);
      return () => {
        parent.remove(instance);
      };
    },
    [parent, loaded],
  );

  useEffect(
    () => {
      const { instance } = self.current;
      if (!instance) return;
      instance.material = material;
      instance.geometry = geometry;
    },
    [material, geometry],
  );

  const { instance } = self.current;

  useUpdateProps(instance, pureProps);

  return render(children, instance);
});

Object3D.defaultProps = {
  loaded: false,
  call: false,
  params: [],
  use: 'Mesh',
};

export default Object3D;
