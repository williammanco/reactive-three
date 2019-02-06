import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
  createElement,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { nodeTypes, stringTypes } from './utils/propsTypes';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Renderer = forwardRef(({
  children,
  pixelRatio,
  target,
  use,
  call,
  options,
  ...props
}, ref) => {
  const pureProps = usePureProps(props, [
    'pixelRatio',
    'target',
  ]);

  const self = useRef({});
  const forceUpdate = useState()[1];

  const destroy = useCallback(
    () => {
      const { instance } = self.current;
      instance.dispose();
      instance.forceContextLoss();
      instance.domElement.remove();
      instance.context = null;
      instance.domElement = null;
    },
    [],
  );

  useEffect(
    () => {
      const Instance = call || THREE[use];
      self.current.instance = new Instance(
        Object.assign(
          {
            antialising: false,
            alpha: false,
            canvas: !target ? self.current.canvas : undefined,
          },
          options,
        ),
      );

      const { instance } = self.current;
      if (target) {
        global.document.querySelector(target).appendChild(instance.domElement);
      }

      instance.setPixelRatio(pixelRatio);

      if (ref) ref(self.current.instance);

      forceUpdate(true);

      return () => {
        destroy();
      };
    },
    [target],
  );
  const { instance } = self.current;

  useUpdateProps(instance, pureProps);

  return target ? render(children, instance) : createElement(
    Fragment,
    null,
    createElement('canvas', { ref: e => self.current.canvas = e }),
    render(children, instance),
  );
});


Renderer.propTypes = {
  pixelRatio: PropTypes.number,
  target: stringTypes,
  call: nodeTypes,
  use: PropTypes.string,
  options: PropTypes.object,
};

Renderer.defaultProps = {
  target: false,
  call: false,
  options: {},
  pixelRatio: global.devicePixelRatio,
  use: 'WebGLRenderer',
};

export default Renderer;
