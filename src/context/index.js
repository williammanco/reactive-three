import {
  createContext,
  createElement,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import actions from './actions';
import reducer from './reducers';

export const initialValue = {
  renderer: false,
  object: false,
  camera: false,
  material: false,
  geometry: false,
  rAF: [],
  resize: [],
};

const Context = createContext(initialValue);

const Reactive = forwardRef((props, ref) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialValue);
  const innerRef = useRef({});

  const onFrameLoop = useCallback((timestamp) => {
    const { rAF } = innerRef.current;
    for (let i = 0; i < rAF.length; i += 1) {
      rAF[i](timestamp);
    }
    innerRef.current.id = global.requestAnimationFrame(onFrameLoop);
  }, []);

  const resetFrameLoop = useCallback(() => {
    const { id } = innerRef.current;
    global.cancelAnimationFrame(id);
  }, []);

  const onResize = useCallback(() => {
    const { resize } = innerRef.current;
    const { innerWidth, innerHeight } = global;
    for (let i = 0; i < resize.length; i += 1) {
      resize[i](innerWidth, innerHeight);
    }
  });

  useEffect(() => {
    innerRef.current.rAF = state.rAF;
    innerRef.current.resize = state.resize;
  }, [state]);

  useEffect(() => {
    onFrameLoop();
    global.addEventListener('resize', onResize);
    return () => {
      global.removeEventListener('resize', onResize);
      resetFrameLoop();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    onResize,
    resetFrameLoop,
    onFrameLoop,
  }));

  const value = { state, dispatch };
  return createElement(Context.Provider, { value }, children);
});


const { Consumer } = Context;

export default Context;

export {
  Reactive,
  Consumer,
  actions,
};
