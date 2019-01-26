import {
  useEffect,
  useRef,
} from 'react';
import {
  MeshNormalMaterial,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Material = ({
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
    geometry,
    material: instance,
  });
};

Material.defaultProps = {
  getRef: () => false,
  options: [],
  use: MeshNormalMaterial,
};

export default Material;
