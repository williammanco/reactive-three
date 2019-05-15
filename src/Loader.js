import {
  useRef,
  useState,
  forwardRef,
  useContext,
} from 'react';
import render from './core/render';
import { usePureProps, useUpdateProps, useWillMount } from './hooks';
import Context from './context';

const THREE = require('three');

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
  const self = useRef({});
  const [loaded, setLoaded] = useState(false);
  let { instance } = self.current;

  const pureProps = usePureProps(props, [
    'url',
    'onLoad',
    'onProgress',
    'onError',
  ]);

  useWillMount(() => {
    if (instance) return;
    const Instance = call || THREE[use];
    instance = new Instance(...params);
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
    if (ref) ref(instance);
  });

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
