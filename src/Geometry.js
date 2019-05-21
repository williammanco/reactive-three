import {
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps, useInstance } from './hooks';

const Geometry = forwardRef(function Geometry({
  children,
  ...props
}, ref) {
  const instance = useRef();
  const pureProps = usePureProps(props);

  instance.current = useInstance(props, ref);

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { geometry: instance.current });
});

Geometry.defaultProps = {
  params: [1, 1, 1],
  call: false,
  use: 'BoxBufferGeometry',
};

export default Geometry;
