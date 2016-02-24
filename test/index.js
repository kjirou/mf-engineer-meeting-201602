const assert = require('assert');

const indexModule = require('../index');


describe('mf-engineer-meeting-201602', () => {

  it('should be', () => {
    assert(typeof indexModule, 'object');
    assert.strictEqual(indexModule.foo, 1);
    assert.strictEqual(indexModule.bar, 2);
  });
});
