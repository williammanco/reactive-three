/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const nodeTypes = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.node,
]);

export const stringTypes = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.node,
]);
