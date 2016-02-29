import createTestEnvironment from '../createTestEnvironment';
import path from '../../src/decorators/path';
import {GET} from '../../src/decorators/http';
import {expect} from 'chai';
import sinon from 'sinon';

describe('response generation', function() {

  let testEnvironment, endpoint;

  afterEach(async function() {
    endpoint.restore();
    await testEnvironment.tearDown();
  });

  describe('response body', function() {

    describe('when data is undefined', function() {

      it('body is empty string', async function() {
        await setupEndpoint(() => {});
        const {client} = testEnvironment;
        const response = await client.get('/foo');
        expect(response.body).to.equal('');
      });

    });

    describe('when data is object', function() {

      it('body is corresponding JSON string', async function() {
        await setupEndpoint(() => {
          return {
            data: {
              answer: 42
            }
          };
        });
        const {client} = testEnvironment;
        const response = await client.get('/foo');
        expect(response.body).to.deep.equal({answer: 42});
      });

    });

  });

  describe('uncaught errors inside of endpoint', function() {

    describe('generic error (not restify.RestError)', function() {

      it('responds with status code 500', async function() {
        await setupEndpoint(() => {
          throw new Error('really bad stuff happened');
        });
        const {client} = testEnvironment;
        const response = await client.get('/foo');
        expect(response.statusCode).to.equal(500);
      });

      it('responds with error object {message}', async function() {
        await setupEndpoint(() => {
          throw new Error('really bad stuff happened');
        });
        const {client} = testEnvironment;
        const response = await client.get('/foo');
        expect(response.body).to.deep.equal({
          message: 'really bad stuff happened'
        });
      });

    });


  });

  async function setupEndpoint(endpointMethod) {
    @path('/foo')
    class TestResource {
      @GET
      async bar() {
        return endpointMethod.call(this, ...arguments);
      }
    }
    const resource = new TestResource();
    endpoint = sinon.spy(resource, 'bar');
    testEnvironment = await createTestEnvironment(resource);
  }

});
