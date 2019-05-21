import {
  useEffect, useCallback, useContext, useRef,
} from 'react';
import log from '../utils/log';
import { updateProps } from './useUpdateProps';
import usePureProps from './usePureProps';
import Context from '../context';

const THREE = require('three');

export default (props, ref, loaded) => {
  const isMount = useRef();
  const instance = useRef();
  const loadedRef = useRef();
  const prevContext = useContext(Context);
  const pureProps = usePureProps(props);

  const {
    call, use, params, debug,
  } = props;

  const setInstance = useCallback(() => {
    if (isMount.current) return;
    const Instance = call || THREE[use];

    instance.current = loadedRef.current || new Instance(...params);
    updateProps(instance, pureProps);
    const { name, type } = instance.current;
    // if (fn) fn();
    if (debug) {
      log('willmount', name || type, {
        context: prevContext.state,
        instance: instance.current,
        props: pureProps,
        params,
      });
    }
    isMount.current = true;
  }, []);


  useEffect(() => {
    if (typeof loaded === 'boolean' && loaded) return;
    if (loaded) loadedRef.current = loaded;

    if (!isMount.current) setInstance();
    if (typeof ref === 'object' && ref !== null) ref.current = instance.current; // eslint-disable-line
    if (typeof (ref) === 'function') ref(instance.current);

    const { name, type } = instance.current;
    if (debug) {
      log('didmount', name || type, {
        context: prevContext.state,
        instance: instance.current,
        props: pureProps,
        params,
      });
    }
    return () => {
      if (instance.current) {
        if (debug) log('unmount', name || type);
        if (instance.current.dispose) instance.current.dispose();
      }
      isMount.current = false;
    };
  }, [use, call, loaded]);

  setInstance();

  return instance.current;
};
