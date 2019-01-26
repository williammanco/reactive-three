import { ACTIONS } from './actions';

const getIndexbyKey = (list, key) => (key && list.findIndex(e => e.key === key));
const getIndexbyFunc = (list, payload) => (payload && list.findIndex(f => f === payload));

const reduceList = (id, type, state, action) => {
  const newState = state[id].slice();
  const { payload } = action;
  const index = getIndexbyFunc(newState, payload);
  // eslint-disable-next-line default-case
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

const reduceSubList = (id, type, state, action) => {
  const newState = state.render.slice();
  const { payload, key } = action;
  // const index = getIndexbyFunc(newState, payload);
  const indexRender = getIndexbyKey(newState, key);

  if (indexRender === -1) return { ...state };

  // eslint-disable-next-line default-case
  switch (type) {
    case 'add':
      newState[indexRender][id].push(payload);
      break;
    case 'remove':
      // eslint-disable-next-line no-case-declarations
      const indexScene = getIndexbyFunc(newState[indexRender][id], payload);
      if (indexScene > -1) newState[indexRender][id].splice(indexScene, 1);
      break;
  }
  return { ...state, render: newState };
};

const reducers = {};

reducers[ACTIONS.ADD_RAF] = (state, action) => reduceList('rAF', 'add', state, action);
reducers[ACTIONS.REMOVE_RAF] = (state, action) => reduceList('rAF', 'remove', state, action);
reducers[ACTIONS.ADD_RESIZE] = (state, action) => reduceList('resize', 'add', state, action);
reducers[ACTIONS.REMOVE_RESIZE] = (state, action) => reduceList('resize', 'remove', state, action);
reducers[ACTIONS.ADD_RENDER] = (state, action) => reduceList('render', 'add', state, action);
reducers[ACTIONS.REMOVE_RENDER] = (state, action) => reduceList('render', 'remove', state, action);
reducers[ACTIONS.ADD_CAMERA] = (state, action) => reduceSubList('camera', 'add', state, action);
reducers[ACTIONS.REMOVE_CAMERA] = (state, action) => reduceSubList('camera', 'remove', state, action);
reducers[ACTIONS.ADD_SCENE] = (state, action) => reduceSubList('scene', 'add', state, action);
reducers[ACTIONS.REMOVE_SCENE] = (state, action) => reduceSubList('scene', 'remove', state, action);

export default (state, action) => {
  const reducer = reducers[action.type] || (() => state);
  return reducer(state, action);
};
