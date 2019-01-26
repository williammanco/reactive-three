import {
  useEffect,
  useRef,
} from 'react';
import {
  PointLight,
} from 'three';
import render from './core/render';
import { usePureProps, useUpdateProps } from './hooks';

const Light = ({
  getRef,
  children,
  parent,
  options,
  use,
  ...props
}) => {
  const self = useRef({});
  const { instance } = self.current;

  const pureProps = usePureProps(props);

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
      if (!parent || !instance) return;
      parent.add(instance);
      return () => {
        parent.remove(instance);
      };
    },
    [parent, instance],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance);
};

Light.defaultProps = {
  getRef: () => false,
  options: [],
  use: PointLight,
};

export default Light;
