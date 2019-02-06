import {
  useEffect,
  useContext,
  useRef,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { nodeTypes } from './utils/propsTypes';
import Context, { actions } from './context';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const THREE = require('three');

const Camera = forwardRef(({
  children,
  parent,
  options,
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
      self.current.instance = new Instance(...options);
      if (ref) ref(self.current.instance);
    },
    [],
  );

  useEffect(
    () => {
      if (!parent || !instance) return;
      dispatch(actions.addCamera(instance, parent));
      return () => {
        dispatch(actions.removeCamera(instance, parent));
      };
    },
    [parent, instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
});

Camera.propTypes = {
  children: nodeTypes,
  call: nodeTypes,
  use: PropTypes.string,
  options: PropTypes.array,
};

Camera.defaultProps = {
  options: [],
  call: false,
  use: 'PerspectiveCamera',
};


export default Camera;
