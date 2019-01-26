import {
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { WebGLRenderer } from 'three';
import render from './core/render';
import Context, { actions } from './context';
import { usePureProps, useUpdateProps } from './hooks';

const Renderer = ({
  children,
  pixelRatio,
  target,
  getRef,
  use,
  options,
  ...props
}) => {
  const pureProps = usePureProps(props, [
    'pixelRatio',
    'target',
  ]);

  const { dispatch } = useContext(Context);
  const self = useRef({});

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

  const onResize = useCallback(
    (width, height) => {
      const { instance } = self.current;
      instance.setSize(width, height);
    },
    [],
  );

  useEffect(
    () => {
      const Instance = use;

      self.current.instance = new Instance(
        Object.assign(
          {
            antialising: false,
            alpha: false,
            canvas: undefined,
          },
          options,
        ),
      );
      const { instance } = self.current;

      getRef(instance);

      dispatch(actions.addResize(onResize));
      instance.setPixelRatio(pixelRatio);

      // eslint-disable-next-line no-undef
      document.querySelector(target).appendChild(instance.domElement);

      return () => {
        destroy();
      };
    },
    [],
  );
  const { instance } = self.current;

  useUpdateProps(instance, pureProps);

  return render(children, instance);
};

Renderer.defaultProps = {
  target: 'body',
  pixelRatio: global.devicePixelRatio,
  options: {},
  getRef: () => false,
  use: WebGLRenderer,
};

export default Renderer;
