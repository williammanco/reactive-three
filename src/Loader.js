import {
  useEffect,
  useRef,
} from 'react';
import {
  TextureLoader,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Loader = ({
  getRef,
  children,
  parent,
  options,
  use,
  url,
  onLoad,
  onProgress,
  onError,
  ...props
}) => {
  const self = useRef({});
  const { instance } = self.current;

  const pureProps = usePureProps(props, [
    'url',
    'onLoad',
    'onProgress',
    'onError',
  ]);

  useEffect(
    () => {
      if (self.current.instance) return;

      const Instance = use;
      self.current.instance = new Instance(...options);
      getRef(self.current.instance);
    },
    [],
  );

  useEffect(
    () => {
      if (!instance || !url) return;

      instance.load(
        url,
        (object) => {
          self.current.loaded = object;
          onLoad(object);
        },
        onProgress,
        onError,
      );
    },
    [instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, self.current.loaded, false, true);
};

Loader.defaultProps = {
  getRef: () => false,
  options: [],
  onLoad: () => false,
  onProgress: () => false,
  onError: () => false,
  use: TextureLoader,
};

export default Loader;
