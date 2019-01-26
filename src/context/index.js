import {
  createContext,
  createElement,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import actions from './actions';
import reducer from './reducers';

export const initialValue = {
  renderer: false,
  rAF: [],
  resize: [],
  render: [],
};

const Context = createContext(initialValue);

const Provider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialValue);
  const ref = useRef({});

  const onFrameLoop = useCallback((timestamp) => {
    const { rAF } = ref.current;
    for (let i = 0; i < rAF.length; i += 1) {
      rAF[i](timestamp);
    }
    ref.current.id = global.requestAnimationFrame(onFrameLoop);
  }, []);

  const resetFrameLoop = useCallback(() => {
    const { id } = ref.current;
    global.cancelAnimationFrame(id);
  }, []);

  const onResize = useCallback(() => {
    const { resize } = ref.current;
    const { innerWidth, innerHeight } = global;
    for (let i = 0; i < resize.length; i += 1) {
      resize[i](innerWidth, innerHeight);
    }
  });

  useEffect(() => {
    ref.current.rAF = state.rAF;
    ref.current.resize = state.resize;
  }, [state]);

  useEffect(() => {
    onFrameLoop();
    global.addEventListener('resize', onResize);
    return () => {
      global.removeEventListener('resize', onResize);
      resetFrameLoop();
    };
  }, []);

  const value = { state, dispatch };
  return createElement(Context.Provider, { value }, children);
};


const { Consumer } = Context;

export default Context;

export {
  Provider,
  Consumer,
  actions,
};
