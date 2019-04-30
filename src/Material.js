import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps, useInstance } from './hooks';

const Material = forwardRef(function Material({
  children,
  map,
  loaded,
  ...props
}, ref) {
  const pureProps = usePureProps(props);
  const instance = useRef();
  instance.current = useInstance(props, ref);

  useEffect(
    () => {
      if (map || typeof loaded === 'object') {
        instance.current.map = map || loaded;
        instance.current.needsUpdate = true;
      }
    },
    [map],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { material: instance.current });
});

Material.defaultProps = {
  params: [],
  call: false,
  use: 'MeshNormalMaterial',
};

export default Material;
