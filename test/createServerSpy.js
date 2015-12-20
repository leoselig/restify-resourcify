import sinon from 'sinon';

export default function() {
  return {
    head: sinon.spy(),
    get: sinon.spy(),
    post: sinon.spy(),
    put: sinon.spy(),
    del: sinon.spy()
  };
}
