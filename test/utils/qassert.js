const _ = require('lodash');
const chai = require('chai');

const { assert } = chai;

module.exports = class QAssert {
  static isMetrixAddress(address) {
    assert.isDefined(address);
    assert.equal(_.size(address), 34);
    assert.isTrue(address.startsWith('m') || address.startsWith('M'));
  }
};
