const styleLog = color => `
  background-color: ${color};
  font-size: 8px;
  font-weight: bold;
  color: #fff;
  padding: 2px 3px;
  `;
const styleGroup = color => `color: ${color};`;

const colors = {
  willmount: 'blue',
  didmount: 'green',
  unmount: 'red',
};

export default (type, label, message) => {
  const { log, groupCollapsed, groupEnd } = global.console;
  log(`%c${type.toUpperCase()}`, styleLog(colors[type]), label);
  if (message) {
    groupCollapsed('%c^___________________________', styleGroup(colors[type]));
    log(message);
    groupEnd();
  }
};
