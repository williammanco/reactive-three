import {
  useEffect,
  useContext,
  useRef,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import render from './core/render';
import Context, { actions } from './context';
import { nodeTypes } from './utils/propsTypes';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Scene = forwardRef(({
  children,
  parent,
  use,
  call,
  ...props
}, ref) => {
  const { dispatch } = useContext(Context);
  const self = useRef({});
  const pureProps = usePureProps(props, ['renderer']);
  const { instance } = self.current;

  useEffect(
    () => {
      const Instance = call || THREE[use];
      self.current.instance = new Instance();
      if (ref) ref(self.current.instance);
    },
    [],
  );

  useEffect(
    () => {
      if (!parent || !instance) return;
      dispatch(actions.addScene(instance, parent));
      return () => {
        dispatch(actions.removeScene(instance, parent));
      };
    },
    [parent, instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
});

Scene.propTypes = {
  children: nodeTypes,
  call: nodeTypes,
  use: PropTypes.string,
};


Scene.defaultProps = {
  call: false,
  use: 'Scene',
};

export default Scene;
