import {
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import render from './core/render';
import { usePureProps } from './hooks';
import Context, { actions } from './context';

const Render = ({
  children,
  parent,
  renderTarget,
  forceClear,
  ...props
}) => {
  const { state, dispatch } = useContext(Context);
  const self = useRef({
    renderTarget: false,
    forceClear: false,
  });
  const stateRef = useRef(state);

  stateRef.current = state;

  const pureProps = usePureProps(props, [
    'renderTarget',
    'forceClear',
  ]);

  const onResize = useCallback(
    () => {
      const { renderer, camera } = stateRef.current;

      if (!renderer.current) return;
      const { domElement } = renderer.current;
      let wrapper = global.document.body.getBoundingClientRect();

      if (domElement.parentElement) {
        wrapper = domElement.parentElement.getBoundingClientRect();
      }

      const { width, height } = wrapper;
      renderer.current.setSize(width, height);

      if (!camera.current) return;

      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    },
    [],
  );

  const onRender = useCallback(
    () => {
      const { container, camera, renderer } = stateRef.current;
      if (!container.current || !camera.current || !renderer.current) return;

      const {
        clear, clearDepth, clearColor, clearStencil,
      } = pureProps;
      const rtt = self.current.renderTarget;
      const fClear = self.current.forceClear;

      if (!renderer.current) return;
      if (clear) renderer.current.clear();
      if (clearDepth) renderer.current.clearDepth();
      if (clearColor) renderer.current.clearColor();
      if (clearStencil) renderer.current.clearStencil();

      renderer.current.render(container.current, camera.current, rtt, fClear);
    },
    [],
  );

  useEffect(
    () => {
      dispatch(actions.addRaf(onRender));
      dispatch(actions.addResize(onResize));
      onResize();

      return () => {
        dispatch(actions.removeRaf(onRender));
        dispatch(actions.removeResize(onResize));
      };
    },
    [],
  );

  useEffect(
    () => {
      self.current.renderTarget = renderTarget;
      self.current.forceClear = forceClear;
    },
    [parent, renderTarget, forceClear],
  );

  return render(children, true);
};

Render.defaultProps = {
  renderTarget: false,
  forceClear: false,
};


export default Render;
