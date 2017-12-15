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
      throw new Error('Rule should contain at least the include property');
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
      throw new Error(`Insuficient number of parameters: ${c}`);
    }

    // check if condition object contains an operator property, which is also a valid operator:
    if (Object.prototype.hasOwnProperty.call(c, 'operator') === false || typeof operators[c.operator] !== 'function') {
      throw new Error(`Missing or unsupported operator: ${c.operator}`);
    }
  },
};
