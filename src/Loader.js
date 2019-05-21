import {
  useRef,
  useState,
  forwardRef,
  useContext,
} from 'react';
import * as THREE from 'three';
import render from './core/render';
import {
  usePureProps, useUpdateProps, useWillMount, useForwardRef,
} from './hooks';
import Context from './context';

const Loader = forwardRef(function Loader({
  children,
  parent,
  params,
  use,
  url,
  onLoad,
  onProgress,
  onError,
  call,
  ...props
}, ref) {
  const [loaded, setLoaded] = useState(false);
  const instance = useRef();

  const pureProps = usePureProps(props, [
    'url',
    'onLoad',
    'onProgress',
    'onError',
  ]);

  useWillMount(() => {
    if (instance.current) return;
    const Instance = call || THREE[use];
    instance.current = new Instance(...params);
    instance.current.load(
      url,
      (object) => {
        setLoaded(object);
        onLoad(object);
      },
      onProgress,
      onError,
    );
  });

  useForwardRef(ref, instance);

  useUpdateProps(instance, pureProps);

  const prevContext = useContext(Context);

  return loaded && render(children, parent, {
    loaded,
    loader: true,
    ...pureProps,
  }, false, true, prevContext);
});

Loader.defaultProps = {
  params: [],
  onLoad: () => false,
  onProgress: () => false,
  onError: () => false,
  call: false,
  use: 'TextureLoader',
};

export default Loader;
