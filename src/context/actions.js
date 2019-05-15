const NAMESPACE = 'RT';

export const ACTIONS = {
  ADD_RAF: `${NAMESPACE}/ADD_RAF`,
  REMOVE_RAF: `${NAMESPACE}/REMOVE_RAF`,
  ADD_RESIZE: `${NAMESPACE}/ADD_RESIZE`,
  REMOVE_RESIZE: `${NAMESPACE}/REMOVE_RESIZE`,
  FORCE_RESIZE: `${NAMESPACE}/FORCE_RESIZE`,
};

const addRaf = value => ({ type: ACTIONS.ADD_RAF, payload: value });
const removeRaf = value => ({ type: ACTIONS.REMOVE_RAF, payload: value });
const addResize = value => ({ type: ACTIONS.ADD_RESIZE, payload: value });
const removeResize = value => ({ type: ACTIONS.REMOVE_RESIZE, payload: value });

export default {
  addRaf,
  removeRaf,
  addResize,
  removeResize,
};
