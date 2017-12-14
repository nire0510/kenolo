const chai = require('chai');
const path = require('path');
const assert = chai.assert;
const expect = chai.expect;
global.__base = path.resolve(__dirname, '..') + '/';
const kenolo = require('../index.js');
const rules = require(path.join(__base, 'tests/rules.json'));

describe('check rules configuration file', function() {
  it('should be an object', function() {
    expect(rules).to.be.an('object');
  });

  it('should contain at least 1 rule', function() {
    expect(Object.keys(rules).length).to.be.above(0);
  });

  it('should contain FOR_APPROVAL group', function() {
    expect(rules.FOR_APPROVAL).not.to.be.undefined;
  });
});

describe('check FOR_APPROVAL rule', function() {
  it('should contain at least include', function() {
    expect(rules.FOR_APPROVAL.hasOwnProperty('include')).to.be.true;
  });

  it('should be true if user\'s email domain is hacker.com', function() {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, user: { email: 'email@hacker.com' } }});
    expect(decision.conditions).to.include('HIGH_RISK_EMAIL_DOMAINS');
  });

  it('should be true if user email is danger@hotmail.com', function() {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, user: { email: 'danger@hotmail.com' } } });
    expect(decision.conditions).to.include('HIGH_RISK_USER_EMAILS');
  });

  it('should be true if fraud score is greater than or equals to 0.8 and number of items is 3', function() {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, score: 0.81, items: 3 }});
    expect(decision.conditions).to.include('FRAUD_SCORE');
  });
});
