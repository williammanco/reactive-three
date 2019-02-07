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
  options,
  use,
  call,
  ...props
}, ref) {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      if (instance) instance.dispose();
      if (!parent) return;
      const Instance = call || THREE[use];
      self.current.instance = new Instance(parent, ...options);
      self.current.instance.update();
      if (ref) ref(self.current.instance);
    },
    [parent],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent);
});

Controls.defaultProps = {
  getRef: () => false,
  options: [],
  call: false,
  use: 'OrbitControls',
};

export default Controls;
