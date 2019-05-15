import {
  useCallback,
  useEffect,
  useRef,
  Fragment,
  createElement,
  forwardRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { nodeTypes, stringTypes } from './utils/propsTypes';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';
import Context from './context';

const THREE = require('three');

const Renderer = forwardRef(function Renderer({
  children,
  pixelRatio,
  target,
  use,
  call,
  params,
  ...props
}, ref) {
  const pureProps = usePureProps(props, [
    'pixelRatio',
    'target',
  ]);

  const canvas = useRef();
  const instance = useRef();

  const destroy = useCallback(
    () => {
      instance.current.dispose();
      instance.current.forceContextLoss();
      instance.current.domElement.remove();
      instance.current.context = null;
      instance.current.domElement = null;
    },
    [],
  );

  // TODO: temp fix for resize after first render
  const { state } = useContext(Context);
  if (state.resize.length > 0) {
    state.resize.forEach((resize) => { resize(); });
  }

  useEffect(
    () => {
      const Instance = call || THREE[use];
      instance.current = new Instance(
        Object.assign(
          {
            canvas: !target ? canvas.current : undefined,
          },
          params[0],
        ),
      );

      if (target) {
        global.document.querySelector(target).appendChild(instance.current.domElement);
      }

      instance.current.setPixelRatio(pixelRatio);

      if (ref) ref(instance);

      global.console.log(state.resize);

      return () => {
        destroy();
      };
    },
    [target],
  );

  useUpdateProps(instance, pureProps);

  return target ? render(children, instance) : createElement(
    Fragment,
    null,
    createElement('canvas', { ref: canvas }),
    render(children, instance, false, { renderer: instance }, !!instance),
  );
});


Renderer.propTypes = {
  pixelRatio: PropTypes.number,
  target: stringTypes,
  call: nodeTypes,
  use: PropTypes.string,
  params: PropTypes.array,
};

Renderer.defaultProps = {
  target: false,
  call: false,
  params: [{}],
  pixelRatio: global.devicePixelRatio,
  use: 'WebGLRenderer',
};

export default Renderer;
