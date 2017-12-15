const evaluate = require('./lib/evaluate');
const validate = require('./lib/validate');

/**
 * @typedef {Object} Decision
 * @property {Boolean} apply Indicates whether a rule applies to input data object
 * @property {String[]} conditions Array of truthy condition names
 */

/**
 * Evaluates set of conditions to see if a rule should apply
 * @param {Object} rule Object which contains a set of conditions
 * @param {Object} data Data object to check against the rule
 * @returns {Decision} Rule check results
 */
module.exports = (rule, data) => {
  const conditions = [];

  // validate rule object:
  validate.rule(rule);

  // check exclusions section:
  if (rule.exclude && Boolean(evaluate.section(rule.exclude, data, conditions)) === true) {
    return {
      apply: false,
      conditions,
    };
  }

  // check inclusions section:
  if (rule.include && Boolean(evaluate.section(rule.include, data, conditions))) {
    return {
      apply: true,
      conditions,
    };
  }

  // reject:
  return {
    apply: false,
    conditions,
  };
};
