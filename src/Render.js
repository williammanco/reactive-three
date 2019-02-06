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
      const index = state.render.findIndex(e => e.key === baseRender.key);
      if (index >= 0) return state.render[index];
      return false;
    }, [state.render],
  );

  const onResize = useCallback(
    () => {
      if (!self.current.renderer) return;
      const { renderer } = self.current;
      const { domElement } = renderer;
      let wrapper = global.document.body.getBoundingClientRect();

      if (domElement.parentElement) {
        wrapper = domElement.parentElement.getBoundingClientRect();
      }

      const { width, height } = wrapper;
      renderer.setSize(width, height);

      if (!update.current) return;
      const { camera } = update.current;

      for (let i = 0; i < camera.length; i += 1) {
        camera[i].aspect = width / height;
        camera[i].updateProjectionMatrix();
      }
    },
    [],
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
      dispatch(actions.addResize(onResize));

      return () => {
        dispatch(actions.removeRender(baseRender));
        dispatch(actions.removeRaf(onRender));
        dispatch(actions.removeResize(onResize));
      };
    },
    [],
  );

  useEffect(
    () => {
      if (state.render.length > 0) {
        update.current = currentRender;
        onResize();
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

  return render(children, baseRender.key, {
    renderer: parent,
  });
};

Render.defaultProps = {
  renderTarget: false,
  forceClear: false,
};


export default Render;
