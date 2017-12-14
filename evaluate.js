const _ = require('lodash');
const operators = require('./operators');

module.exports = function (condition, data) { 
  // check that there are at least 2 arguments:
  if (Object.keys(condition).length < 3) {
    throw new Error(`Insuficient number of parameters: ${condition}`);
  }

  // check that second argument is a valid operator:
  if (condition.hasOwnProperty('operator') === false || typeof operators[condition.operator] !== 'function') {
    throw new Error(`Missing or unsupported operator: ${keys.operator}`);
  }

  return operators[condition.operator](_.get(data, condition.property, null), condition.value);
}