const operators = require('./operators');

module.exports = {
  /**
   * Validates rule object
   * @param {Object} r Rule object
   * @returns {Undefined} Undefined
   * @throws Exception
   */
  rule(r) {
    if (Object.prototype.hasOwnProperty.call(r, 'include') === false || typeof r.include !== 'object') {
      throw new Error('Rule is invalid. Missing mandatory property: include');
    }
  },

  /**
   * Validates condition object
   * @param {Object} c Condition object
   * @returns {Undefined} Undefined
   * @throws Exception
   */
  condition(c) {
    // check if there are at least 3 properties in a condition object:
    if (Object.keys(c).length < 3) {
      throw new Error(`Condition is invalid. Insuficient number of parameters: ${c}`);
    }

    // check if condition object contains a `property` property:
    ['property', 'operator', 'value'].forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(c, property) === false) {
        throw new Error(`Condition is invalid. Missing mandatory property: ${property}`);
      }
    });

    // check if condition object contains an operator property, which is also a valid operator:
    if (typeof operators[c.operator] !== 'function') {
      throw new Error(`Condition is invalid. Unsupported operator: ${c.operator}`);
    }

    // check if value is array for some operators:
    if (Array.isArray(c.value) === false && ['in', 'nin', 'sw', 'ew', 'sl', 're'].includes(c.operator)) {
      throw new Error(`Condition is invalid. Value should be an array for selected operator: ${c.operator}`);
    }

    // check if value is a string for some operators:
    if (typeof c.property !== 'string' && ['sw', 'ew'].includes(c.operator)) {
      throw new Error(`Condition is invalid. Property should be a string for selected operator: ${c.operator}`);
    }
  },
};
