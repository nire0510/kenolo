const fuzzySoundex = require('talisman/phonetics/fuzzy-soundex');

module.exports = {
  // equals:
  eq: (a, b) => a === b,
  // weak equals:
  /* eslint eqeqeq: "off" */
  weq: (a, b) => a == b,
  // not equals:
  neq: (a, b) => a !== b,
  // greater:
  gt: (a, b) => a > b,
  // greater / equal:
  gte: (a, b) => a >= b,
  // lower:
  lt: (a, b) => a < b,
  // lower / equal:
  lte: (a, b) => a <= b,
  // in:
  in: (a, b) => b.includes(a),
  // not in:
  nin: (a, b) => !b.includes(a),
  // starts with
  sw: (a, b) => b.some(c => typeof a === 'string' && a.startsWith(c)),
  // ends with
  ew: (a, b) => b.some(c => typeof a === 'string' && a.endsWith(c)),
  // sounds like:
  sl: (a, b) => b.some(c => fuzzySoundex(a) === fuzzySoundex(c)),
  // regular expression:
  re: (a, b) => b.some(c => c instanceof RegExp && c.test(a)),
};
