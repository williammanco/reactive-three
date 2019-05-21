import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import * as THREE from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';


const Light = forwardRef(function Light({
  children,
  parent,
  params,
  use,
  call,
  ...props
}, ref) {
  const instance = useRef();

  const pureProps = usePureProps(props);

  useEffect(
    () => {
      if (instance.current) return;

      const Instance = call || THREE[use];
      instance.current = new Instance(...params);
      if (ref) ref(instance.current);
    },
    [],
  );

  useEffect(
    () => {
      if (!parent.current || !instance.current) return;
      parent.current.add(instance.current);
      return () => {
        parent.current.remove(instance.current);
      };
    },
    [],
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
