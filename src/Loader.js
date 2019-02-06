import {
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps, useWillMount } from './hooks';

const THREE = require('three');

const Loader = forwardRef(({
  children,
  parent,
  options,
  use,
  url,
  onLoad,
  onProgress,
  onError,
  call,
  ...props
}, ref) => {
  const self = useRef({});
  const [loaded, setLoaded] = useState();

  const pureProps = usePureProps(props, [
    'url',
    'onLoad',
    'onProgress',
    'onError',
  ]);

  useWillMount(() => {
    if (self.current.instance) return;

    const Instance = call || THREE[use];
    self.current.instance = new Instance(...options);
    if (ref) ref(self.current.instance);
  });

  useEffect(
    () => {
      const { instance } = self.current;
      instance.load(
        url,
        (object) => {
          self.current.loaded = object;
          setLoaded(object);
          onLoad(object);
        },
        onProgress,
        onError,
      );
    },
    [],
  );

  const { instance } = self.current;

  useUpdateProps(instance, pureProps);

  return render(children, loaded, false, true);
});

Loader.defaultProps = {
  options: [],
  onLoad: () => false,
  onProgress: () => false,
  onError: () => false,
  call: false,
  use: 'TextureLoader',
};

export default Loader;
