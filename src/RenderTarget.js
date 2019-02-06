import {
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { nodeTypes } from './utils/propsTypes';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const RenderTarget = forwardRef(({
  children,
  parent,
  options,
  use,
  call,
  ...props
}, ref) => {
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = call || THREE[use];
      if (instance) instance.dispose();
      self.current.instance = new Instance(...options);
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
  options: PropTypes.array,
};


RenderTarget.defaultProps = {
  call: false,
  options: [],
  use: 'WebGLRenderTarget',
};

export default RenderTarget;
