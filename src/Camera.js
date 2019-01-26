import {
  useEffect,
  useContext,
  useRef,
} from 'react';
import { PerspectiveCamera } from 'three';
import Context, { actions } from './context';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Camera = ({
  children,
  getRef,
  parent,
  options,
  use,
  ...props
}) => {
  const { dispatch } = useContext(Context);
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = use;
      self.current.instance = new Instance(...options);
      getRef(self.current.instance);
    },
    [],
  );

  useEffect(
    () => {
      if (!parent || !instance) return;
      if (parent) {
        dispatch(actions.addCamera(instance, parent));
        // eslint-disable-next-line consistent-return
        return () => {
          dispatch(actions.removeCamera(instance, parent));
        };
      }
    },
    [parent, instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
};

Camera.defaultProps = {
  options: [],
  getRef: () => false,
  use: PerspectiveCamera,
};

export default Camera;
