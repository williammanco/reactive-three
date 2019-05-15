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
  const self = useRef({});
  const pureProps = usePureProps(props);

  self.current.instance = useInstance(props, ref);

  const { instance } = self.current;

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { geometry: instance });
});

Geometry.defaultProps = {
  params: [1, 1, 1],
  call: false,
  use: 'BoxBufferGeometry',
};

export default Geometry;
