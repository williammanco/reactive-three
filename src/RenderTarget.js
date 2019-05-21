import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { nodeTypes } from './utils/propsTypes';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';


const RenderTarget = forwardRef(function RenderTarget({
  children,
  parent,
  params,
  use,
  call,
  ...props
}, ref) {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = call || THREE[use];
      if (instance) instance.dispose();
      self.current.instance = new Instance(...params);
      if (ref) ref(self.current.instance);
      return () => {
        if (instance) instance.dispose();
      };
    },
    [use],
  );

  useUpdateProps(instance, pureProps);

  return render(children, parent, {
    renderTarget: instance,
  });
});

RenderTarget.propTypes = {
  call: nodeTypes,
  use: PropTypes.string,
  params: PropTypes.array,
};


RenderTarget.defaultProps = {
  call: false,
  params: [],
  use: 'WebGLRenderTarget',
};

export default RenderTarget;
