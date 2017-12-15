/* eslint-disable */
const chai = require('chai');
const path = require('path');
const kenolo = require('../index');
const operators = require('../lib/operators');

const expect = chai.expect;
global.__base = path.resolve(__dirname, '..') + '/';
const rules = require(path.join(__base, 'tests/rules.json'));

describe('check rules configuration file', function () {
  it('should be an object', function () {
    expect(rules).to.be.an('object');
  });

  it('should contain at least 1 rule', function () {
    expect(Object.keys(rules).length).to.be.above(0);
  });

  it('should contain FOR_APPROVAL group', function () {
    expect(rules.FOR_APPROVAL).not.to.be.undefined;
  });
});

describe('check FOR_APPROVAL rule', function () {
  it('should contain at least include', function () {
    expect(rules.FOR_APPROVAL.hasOwnProperty('include')).to.be.true;
  });

  it('should be true if user\'s email domain is hacker.com', function () {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, user: { email: 'email@hacker.com' } }});
    expect(decision.conditions).to.include('HIGH_RISK_EMAIL_DOMAINS');
  });

  it('should be true if user email is danger@hotmail.com', function () {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, user: { email: 'danger@hotmail.com' } } });
    expect(decision.conditions).to.include('HIGH_RISK_USER_EMAILS');
  });

  it('should be true if fraud score is greater than or equals to 0.8 and number of items is 3', function () {
    const decision = kenolo(rules.FOR_APPROVAL, { order: { status: 2, score: 0.81, items: 3 }});
    expect(decision.conditions).to.include('FRAUD_SCORE');
  });
});

describe('Operators', function () {
  describe('eq', function () {
    it('should return true if both params are equal', function () {
      expect(operators.eq(2, 2)).to.be.true;
    });

    it('should return false if both params are equal in value but not in type', function () {
      expect(operators.eq(2, '2')).to.be.false;
    });

    it('should return false if both params are not equal', function () {
      expect(operators.eq(2, 5)).to.be.false;
    });
  });

  describe('weq', function () {
    it('should return true if both params are equal', function () {
      expect(operators.weq(2, 2)).to.be.true;
    });

    it('should return true if both params are equal in value but not in type', function () {
      expect(operators.weq(2, '2')).to.be.true;
    });

    it('should return false if both params are not equal', function () {
      expect(operators.weq(2, 5)).to.be.false;
    });
  });

  describe('neq', function () {
    it('should return false if both params are equal', function () {
      expect(operators.neq(2, 2)).to.be.false;
    });

    it('should return true if both params are equal in value but not in type', function () {
      expect(operators.neq(2, '2')).to.be.true;
    });

    it('should return true if both params are not equal', function () {
      expect(operators.neq(2, 5)).to.be.true;
    });
  });

  describe('gt', function () {
    it('should return false if a is lower than b', function () {
      expect(operators.gt(2, 5)).to.be.false;
    });

    it('should return false if a is greater than b', function () {
      expect(operators.gt(5, 2)).to.be.true;
    });
  });

  describe('gte', function () {
    it('should return false if a is lower than b', function () {
      expect(operators.gte(2, 5)).to.be.false;
    });

    it('should return false if a is greater than b', function () {
      expect(operators.gte(5, 2)).to.be.true;
    });

    it('should return true if a is greater than or equal to b', function () {
      expect(operators.gte(5, 5)).to.be.true;
    });
  });

  describe('lt', function () {
    it('should return true if a is lower than b', function () {
      expect(operators.lt(2, 5)).to.be.true;
    });

    it('should return false if a is greater than b', function () {
      expect(operators.lt(5, 2)).to.be.false;
    });
  });

  describe('lte', function () {
    it('should return true if a is lower than b', function () {
      expect(operators.lte(2, 5)).to.be.true;
    });

    it('should return false if a is greater than b', function () {
      expect(operators.lte(5, 2)).to.be.false;
    });

    it('should return false if a is greater than or equal to b', function () {
      expect(operators.lte(5, 5)).to.be.true;
    });
  });

  describe('in', function () {
    it('should return true if value a exists in array b', function () {
      expect(operators.in(2, [1, 2, 3, 4])).to.be.true;
    });

    it('should return false if value a doesnt exists in array b', function () {
      expect(operators.in(2, [1, 3, 4])).to.be.false;
    });
  });

  describe('nin', function () {
    it('should return false if value a exists in array b', function () {
      expect(operators.nin(2, [1, 2, 3, 4])).to.be.false;
    });

    it('should return true if value a doesnt exists in array b', function () {
      expect(operators.nin(2, [1, 3, 4])).to.be.true;
    });
  });

  describe('ew', function () {
    it('should return true if value a ends with b', function () {
      expect(operators.ew('test@bla.com', ['@bla.com'])).to.be.true;
    });

    it('should return false if value a doesnt end with b', function () {
      expect(operators.ew('test@bla.com', ['@foo.com'])).to.be.false;
    });
  });

  describe('sw', function () {
    it('should return true if value a starts with b', function () {
      expect(operators.sw('test@bla.com', ['test', 'bar'])).to.be.true;
    });

    it('should return false if value a doesnt start with b', function () {
      expect(operators.sw('test@bla.com', ['@foo.com'])).to.be.false;
    });
  });

  describe('sl', function () {
    it('should return true if value a sounds like b', function () {
      expect(operators.sl('john', ['jon'])).to.be.true;
    });

    it('should return false if value a doesnt sound like b', function () {
      expect(operators.sl('foo', ['bar'])).to.be.false;
    });
  });

  describe('re', function () {
    it('should return true if value a matches b regex', function () {
      expect(operators.re('john', [/o+/])).to.be.true;
    });

    it('should return false if value a doesnt match b regex', function () {
      expect(operators.re('bar', [/o+/])).to.be.false;
    });
  });
});