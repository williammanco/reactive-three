/* eslint-disable default-case */
import { ACTIONS } from './actions';

const getIndexByFunc = (list, payload) => (payload && list.findIndex(f => f === payload));

const reduceList = (id, type, state, action) => {
  const newState = state[id].slice();
  const { payload } = action;
  const index = getIndexByFunc(newState, payload);

  switch (type) {
    case 'add':
      newState.push(payload);
      break;
    case 'remove':
      if (index > -1) newState.splice(index, 1);
      break;
  }
  return { ...state, [id]: newState };
};


const reducers = {};

reducers[ACTIONS.ADD_RAF] = (state, action) => reduceList('rAF', 'add', state, action);
reducers[ACTIONS.REMOVE_RAF] = (state, action) => reduceList('rAF', 'remove', state, action);
reducers[ACTIONS.ADD_RESIZE] = (state, action) => reduceList('resize', 'add', state, action);
reducers[ACTIONS.REMOVE_RESIZE] = (state, action) => reduceList('resize', 'remove', state, action);

export default (state, action) => {
  const reducer = reducers[action.type] || (() => state);
  return reducer(state, action);
};
