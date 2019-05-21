import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import * as THREE from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps, useForwardRef } from './hooks';


const Controls = forwardRef(function Controls({
  getRef,
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
      if (instance.current) instance.current.dispose();
      if (!parent.current) return;
      const Instance = call || THREE[use];
      instance.current = new Instance(parent.current, ...params);
    },
    [],
  );

  useForwardRef(ref, instance);

  useUpdateProps(instance, pureProps);

  return render(children, parent.current);
});

Controls.defaultProps = {
  getRef: () => false,
  params: [],
  call: false,
  use: 'OrbitControls',
};

export default Controls;
