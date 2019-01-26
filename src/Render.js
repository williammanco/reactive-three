import {
  useMemo,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import setUUID from 'uuid/v4';
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
  const key = useRef();
  const update = useRef();

  const pureProps = usePureProps(props, [
    'renderTarget',
    'forceClear',
  ]);

  const baseRender = useMemo(
    () => ({
      key: setUUID(),
      camera: [],
      scene: [],
    }),
    [],
  );

  const currentRender = useMemo(
    () => {
      const index = state.render.findIndex(e => e.key === key.current);
      if (index >= 0) return state.render[index];
      return false;
    }, [state.render],
  );

  const onRender = useCallback(
    () => {
      const { scene, camera } = update.current;
      const { renderer } = self.current;
      const {
        clear, clearDepth, clearColor, clearStencil,
      } = pureProps;
      const rtt = self.current.renderTarget;
      const fClear = self.current.forceClear;

      if (!renderer) return;
      if (clear) renderer.clear();
      if (clearDepth) renderer.clearDepth();
      if (clearColor) renderer.clearColor();
      if (clearStencil) renderer.clearStencil();
      if (camera.length === 1) {
        renderer.render(scene[0], camera[0], rtt, fClear);
      } else if (camera.length > 1) {
        for (let i = 0; i < camera.length; i += 1) {
          if (camera[i].visible) {
            renderer.render(scene[0], camera[i], rtt, fClear);
          }
        }
      }
    },
    [],
  );

  useEffect(
    () => {
      dispatch(actions.addRender(baseRender));
      dispatch(actions.addRaf(onRender));
      key.current = baseRender.key;
      return () => {
        dispatch(actions.removeRender(baseRender));
        dispatch(actions.removeRaf(onRender));
      };
    },
    [],
  );

  useEffect(
    () => {
      if (state.render.length > 0) {
        update.current = currentRender;
      }
    },
    [state.render],
  );

  useEffect(
    () => {
      self.current.renderTarget = renderTarget;
      self.current.forceClear = forceClear;
      if (!parent) return;
      self.current.renderer = parent;
    },
    [parent, renderTarget, forceClear],
  );


  return render(children, key.current);
};

Render.defaultProps = {
  renderTarget: false,
  forceClear: false,
};


export default Render;
