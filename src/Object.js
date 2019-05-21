import {
  useEffect,
  useRef,
  useContext,
  forwardRef,
  useCallback,
} from 'react';
import render from './core/render';
import Context from './context';
import {
  usePureProps, useUpdateProps, useInstance,
} from './hooks';

const Object3D = forwardRef(function Object3D({
  children,
  parent,
  loaded,
  loader,
  materialToChildren,
  ...props
}, ref) {
  const instance = useRef();

  const { state } = useContext(Context);
  const pureProps = usePureProps(props);
  const context = useRef(state);

  const geometry = props.geometry || props.params[0] || context.current.geometry;
  const material = props.material || props.params[1] || context.current.material;

  instance.current = useInstance({
    ...props,
    params: [
      geometry,
      material,
      ...props.params.slice(2),
    ],
  }, ref, loaded || loader);

  const applyMaterialToChildren = useCallback((item) => {
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        child.material = material;
        applyMaterialToChildren(child, material);
      });
    }
  }, []);

  useEffect(
    () => {
      if (loader && !loaded) return;

      const { container } = context.current;
      if (loaded.isObject3D) {
        if (geometry) loaded.geometry = geometry;
        if (material) loaded.material = material;
        if (materialToChildren) applyMaterialToChildren(loaded);
        instance.current = loaded;
      }

      container.current.add(instance.current);
      return () => {
        container.current.remove(instance.current);
      };
    },
    [loaded],
  );

  useUpdateProps(instance, pureProps);

  return render(children, instance, false, { container: instance.current });
});

Object3D.defaultProps = {
  loaded: false,
  call: false,
  params: [],
  use: 'Mesh',
};

export default Object3D;
