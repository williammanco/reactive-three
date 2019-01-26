const NAMESPACE = 'RT';

export const ACTIONS = {
  ADD_RAF: `${NAMESPACE}/ADD_RAF`,
  REMOVE_RAF: `${NAMESPACE}/REMOVE_RAF`,
  ADD_RESIZE: `${NAMESPACE}/ADD_RESIZE`,
  REMOVE_RESIZE: `${NAMESPACE}/REMOVE_RESIZE`,
  ADD_RENDER: `${NAMESPACE}/ADD_RENDER`,
  REMOVE_RENDER: `${NAMESPACE}/REMOVE_RENDER`,
  ADD_CAMERA: `${NAMESPACE}/ADD_CAMERA`,
  REMOVE_CAMERA: `${NAMESPACE}/REMOVE_CAMERA`,
  ADD_SCENE: `${NAMESPACE}/ADD_SCENE`,
  REMOVE_SCENE: `${NAMESPACE}/REMOVE_SCENE`,
};

const addRaf = value => ({ type: ACTIONS.ADD_RAF, payload: value });
const removeRaf = value => ({ type: ACTIONS.REMOVE_RAF, payload: value });
const addResize = value => ({ type: ACTIONS.ADD_RESIZE, payload: value });
const removeResize = value => ({ type: ACTIONS.REMOVE_RESIZE, payload: value });
const addRender = value => ({ type: ACTIONS.ADD_RENDER, payload: value });
const removeRender = value => ({ type: ACTIONS.REMOVE_RENDER, payload: value });
const addCamera = (value, key) => ({ type: ACTIONS.ADD_CAMERA, payload: value, key });
const removeCamera = (value, key) => ({ type: ACTIONS.REMOVE_CAMERA, payload: value, key });
const addScene = (value, key) => ({ type: ACTIONS.ADD_SCENE, payload: value, key });
const removeScene = (value, key) => ({ type: ACTIONS.REMOVE_SCENE, payload: value, key });

export default {
  addRaf,
  removeRaf,
  addResize,
  removeResize,
  addRender,
  removeRender,
  addCamera,
  removeCamera,
  addScene,
  removeScene,
};
