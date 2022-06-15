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
  validate.condition({
    ...c,
    property,
  });
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
  if (Object.keys(s).some((key) => ['and', 'or'].includes(key))) {
    return Object.keys(s).every((key) => {
      switch (key) {
        case 'and':
          return s.and.every((c) => section(c, data, results));
        case 'or':
          return s.or.some((c) => section(c, data, results));
        default:
          if (condition(s, data) === true) {
            return results.push(s.name) > 0;
          }
          return false;
      }
    });
  }

  if (condition(s, data) === true) {
    return results.push(s.name) > 0;
  }
  return false;
}

module.exports = {
  section,
  condition,
};
