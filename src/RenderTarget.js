import {
  useEffect,
  useRef,
} from 'react';
import {
  WebGLRenderTarget,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const RenderTarget = ({
  getRef,
  children,
  parent,
  options,
  use,
  ...props
}) => {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = use;
      if (instance) instance.dispose();
      self.current.instance = new Instance(...options);
      getRef(self.current.instance);
    },
    [use],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    renderTarget: instance,
  });
};

RenderTarget.defaultProps = {
  getRef: () => false,
  options: [],
  use: WebGLRenderTarget,
};

export default RenderTarget;
