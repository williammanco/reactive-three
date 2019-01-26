import {
  useEffect,
  useContext,
  useRef,
} from 'react';
import { Scene as SceneThree } from 'three';
import render from './core/render';
import Context, { actions } from './context';
import { usePureProps, useUpdateProps } from './hooks';

const Scene = ({
  children,
  parent,
  use,
  getRef,
  ...props
}) => {
  const { dispatch } = useContext(Context);
  const self = useRef({});
  const pureProps = usePureProps(props);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = use;
      self.current.instance = new Instance();
      getRef(self.current.instance);
    },
    [],
  );


  useEffect(
    () => {
      if (parent) {
        dispatch(actions.addScene(instance, parent));
        return () => {
          dispatch(actions.removeScene(instance, parent));
        };
      }
    },
    [parent],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
};

Scene.defaultProps = {
  getRef: () => false,
  use: SceneThree,
};

export default Scene;
