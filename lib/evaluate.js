const get = require('getv');
const operators = require('./operators');
const validate = require('./validate');

/**
 * Evaluates condition object
 * @param {*} c Condition object
 * @param {*} data Input data object
 * @returns {Boolean} Condition evaluation result
 */
function condition(c, data) {
  const property = get(data, c.property, null);

  // Validate condition object:
  validate.condition(Object.assign({}, c, { property }));
  // Evaluate condition:
  return operators[c.operator](property, c.value);
}

/**
 * Evaluates conditions section (include/exclude) object
 * @param {Object} s Section object
 * @param {Object} data Input data object
 * @param {String[]} results Truthy condition names
 * @returns {Boolean} Section evaluation result
 */
function section(s, data, results) {
  if (Object.prototype.hasOwnProperty.call(s, 'and')) {
    return s.and.every(c => section(c, data, results));
  }
  else if (Object.prototype.hasOwnProperty.call(s, 'or')) {
    return s.or.some(c => section(c, data, results));
  }
  else if (condition(s, data) === true) {
    return results.push(s.name) > 0;
  }

  return false;
}

module.exports = {
  section,
  condition,
};
