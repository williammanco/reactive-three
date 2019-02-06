import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Material = forwardRef(({
  children,
  parent,
  geometry,
  material,
  options,
  use,
  call,
  ...props
}, ref) => {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = call || THREE[use];
      if (instance) instance.dispose();
      self.current.instance = new Instance(...options);
      if (ref) ref(self.current.instance);
      return () => {
        if (instance) instance.dispose();
      };
    },
    [use],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    geometry,
    material: instance,
  });
});

Material.defaultProps = {
  options: [],
  call: false,
  use: 'MeshNormalMaterial',
};

export default Material;
