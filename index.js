const evaluate = require('./evaluate');

/**
 * Parses and evaluates condition recursively
 * @param {Object} condition Condition object to check
 * @param {Object} data Input data object to use in conditions
 */
function decide(condition, data, results) {
  if (condition.hasOwnProperty('and')) {
    return condition.and.every(c => decide(c, data, results));
  }
  else if (condition.hasOwnProperty('or')) {
    return condition.or.some(c => decide(c, data, results));
  }
  else if (evaluate(condition, data) === true) {
    return results.push(condition.name) > 0;
  }

  return false;
}

/**
 * @typedef {Object} Decision
 * @property {Boolean} decision Indicates whether a rule applies to input data object
 * @property {String[]} conditions Array of truthy condition names
 */

/**
 * Checks a rule 
 * @param {Object} rule Object which contains set of conditions
 * @param {Object} data Object to check against the rule
 * @returns {Decision} Rule check results
 */
module.exports = function (rule, data) {
  const conditions = [];

  // check exclusions:
  if (rule.exclude && decide(rule.exclude, data, conditions)) {
    return {
      decision: false,
      conditions
    }
  }

  // check inclusions:
  if (rule.include && decide(rule.include, data, conditions)) {
    return {
      decision: true,
      conditions
    }
  }

  // reject:
  return {
    decision: false,
    conditions
  }
};
