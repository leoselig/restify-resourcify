import createTestEnvironment from '../createTestEnvironment';
import path from '../../src/decorators/path';
import {GET, POST} from '../../src/decorators/http';
import {expect} from 'chai';
import sinon from 'sinon';

describe('response generation', function() {

  let testEnvironment, endpoint;

  afterEach(async function() {
    endpoint.restore();
    await testEnvironment.tearDown();
  });

  describe('status code', function() {

    it('is 200 by default', async function() {
      await setupEndpoint(() => {});
      const {client} = testEnvironment;
      const response = await client.get('/foo');
      expect(response.statusCode).to.equal(200);
    });

    it('is 201 for POST by default', async function() {
      await setupEndpoint(() => {}, POST);
      const {client} = testEnvironment;
      const response = await client.post('/foo');
      expect(response.statusCode).to.equal(201);
    });

    it('sets status code to optional field statusCode in response description, if provided', async function() {
      await setupEndpoint(() => {
        return {
          statusCode: 422
        };
      });
      const {client} = testEnvironment;
      const response = await client.get('/foo');
      expect(response.statusCode).to.equal(422);
    });

    it('statusCode field in response description overrides POST-default', async function() {
      await setupEndpoint(() => {
        return {
          statusCode: 422
        };
      }, POST);
      const {client} = testEnvironment;
      const response = await client.post('/foo');
      expect(response.statusCode).to.equal(422);
    });

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

  async function setupEndpoint(endpointMethod, decorator = GET) {
    @path('/foo')
    class TestResource {
      @decorator
      async bar() {
        return endpointMethod.call(this, ...arguments);
      }
    }
    const resource = new TestResource();
    endpoint = sinon.spy(resource, 'bar');
    testEnvironment = await createTestEnvironment(resource);
  }

});
