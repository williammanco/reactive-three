import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Material = forwardRef(function Material({
  children,
  parent,
  geometry,
  material,
  loaded,
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
      return () => {
        if (instance) instance.dispose();
      };
    },
    [use],
  );

  useEffect(
    () => {
      if (typeof loaded === 'object') {
        self.current.instance.map = loaded;
        self.current.instance.needsUpdate = true;
      }
    },
    [loaded],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    geometry,
    material: instance,
  });
});

Material.defaultProps = {
  params: [],
  call: false,
  use: 'MeshNormalMaterial',
};

export default Material;
