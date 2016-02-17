import wrapHandler from '../../src/wrapHandler';
import {expect} from 'chai';
import sinon from 'sinon';

describe('wrapHandler', function() {

  beforeEach(function() {

  });

  describe('processing of returned response description', function() {

    function createTestHandler(handler) {
      const fakeRequest = createFakeRequest();
      const fakeResponse = createFakeResponse();
      const fakeNext = createFakeNext();
      const wrappedHandler = wrapHandler(handler);
      return {
        handler() {
          return wrappedHandler(fakeRequest, fakeResponse, fakeNext);
        },
        fakeRequest,
        fakeResponse,
        fakeNext
      };
    }

    describe('when empty', function() {

      it('calls response.send with null', async function() {
        const testHandler = createTestHandler(() => {
          return {};
        });
        await testHandler.handler();
        expect(testHandler.fakeResponse.send).to.have.been.calledOnce;
      });

    });

    describe('when data is non-empty object', function() {

      it('calls response.send with correct JSON', async function() {
        const responseBody = {
          fake: 'data'
        };
        const testHandler = createTestHandler(() => {
          return {
            data: responseBody
          };
        });
        await testHandler.handler();
        expect(testHandler.fakeResponse.send).to.have.been.calledOnce;
        expect(testHandler.fakeResponse.send).to.have.been.calledWith(
          sinon.match(responseBody));
      });

    });

  });

});

function createFakeRequest() {
  return {
    method: 'GET',
    url: '/fake_url'
  };
}

function createFakeResponse() {
  return {
    send: sinon.spy()
  };
}

function createFakeNext() {

}
