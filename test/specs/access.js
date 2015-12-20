import {resource, endpoint} from '../../src/access';
import {expect} from 'chai';

describe('access', function() {

  let Class;

  beforeEach(function() {
    class NewClass {

    }

    Class = NewClass;
  });

  it('resource() returns the same instance on repeated calls', function() {
    expect(resource(Class)).to.equal(resource(Class));
  });

  it('endpoint() returns the same instance on repeated calls', function() {
    expect(endpoint(Class, 'test')).to.equal(endpoint(Class, 'test'));
  });

});
