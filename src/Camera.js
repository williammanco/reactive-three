import {
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { nodeTypes } from './utils/propsTypes';
import { usePureProps, useUpdateProps, useInstance } from './hooks';

const Camera = forwardRef(function Camera({
  children,
  ...props
}, ref) {
  const pureProps = usePureProps(props);
  const instance = useRef();

  instance.current = useInstance(props, ref);

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { camera: instance });
});

Camera.propTypes = {
  children: nodeTypes,
};

Camera.defaultProps = {
  params: [],
  call: false,
  use: 'PerspectiveCamera',
};


export default Camera;
