export default (object, keys) => {
  const omittedKeys = Array.isArray(keys) ? keys : [keys];

  return Object.entries(object)
    .filter(([key]) => !omittedKeys.includes(key))
    .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
};
