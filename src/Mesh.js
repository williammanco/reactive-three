import {
  useEffect,
  useRef,
} from 'react';
import {
  Mesh as MeshThree,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Mesh = ({
  getRef,
  children,
  parent,
  geometry,
  material,
  external,
  use,
  ...props
}) => {
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

      const Instance = use;
      if (external) {
        self.current.instance = external;
        if (geometry) external.geometry = geometry;
        if (material) external.material = material;
      } else if (geometry && material) {
        self.current.instance = new Instance(geometry, material);
      }

      getRef(self.current.instance);
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
};

Mesh.defaultProps = {
  getRef: () => false,
  external: false,
  use: MeshThree,
};

export default Mesh;
