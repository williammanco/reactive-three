import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

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

      if (ref) ref(instance.current);
    },
    [],
  );

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
