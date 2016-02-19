import wrapHandler from '../../src/wrapHandler';
import {expect} from 'chai';
import sinon from 'sinon';

describe('wrapHandler', function() {

  describe('error handling', function() {

    it('calls response.send() with the exact error that has been thrown', async function() {
      const error = new Error('You knew this would happen...');
      const testHandler = createTestHandler(() => {
        throw error;
      });

      await testHandler.handler();

      const sendSpy = testHandler.fakeResponse.send;
      expect(sendSpy).to.have.been.calledOnce;
      expect(sendSpy).to.have.been.calledWith(error);
    });

  });

  describe('processing of returned response description', function() {

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
  return () => {};
}

function createTestHandler(handler) {
  const fakeRequest = createFakeRequest();
  const fakeResponse = createFakeResponse();
  const fakeNext = createFakeNext();
  const wrappedHandler = wrapHandler(handler);
  return {
    async handler() {
      return await wrappedHandler(fakeRequest, fakeResponse, fakeNext);
    },
    fakeRequest,
    fakeResponse,
    fakeNext
  };
}
