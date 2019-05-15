import {
  useRef,
  forwardRef,
} from 'react';
import render from './core/render';
import { nodeTypes } from './utils/propsTypes';
import { usePureProps, useUpdateProps, useInstance } from './hooks';

const Scene = forwardRef(function Scene({
  children,
  ...props
}, ref) {
  const instance = useRef();

  const pureProps = usePureProps(props);

  instance.current = useInstance(props, ref);

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { container: instance });
});

Scene.propTypes = {
  children: nodeTypes,
};

Scene.defaultProps = {
  call: false,
  use: 'Scene',
  params: [],
};

export default Scene;
