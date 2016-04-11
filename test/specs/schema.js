import createTestEnvironment from '../createTestEnvironment';
import path from '../../src/decorators/path';
import {PUT} from '../../src/decorators/http';
import schema from '../../src/decorators/schema';
import {expect} from 'chai';
import sinon from 'sinon';

const testSchema = {
	"title": "Test Schema",
	"type": "object",
	"properties": {
		"name": {
			"type": "string"
		}
	},
	"required": ["name"]
};

describe('schema', function() {

	let testEnvironment, endpoint;

  async function setupEndpoint() {
    @path('/foo')
    class TestResource {
      @PUT
      @schema(testSchema)
      async bar() {

      }
    }
    const resource = new TestResource();
    endpoint = sinon.spy(resource, 'bar');
    testEnvironment = await createTestEnvironment(resource);
  }

  afterEach(async function() {
    endpoint.restore();
    await testEnvironment.tearDown();
  });

  describe('when request body is valid', function() {

    it('produces 200 OK', async function() {
      await setupEndpoint();
      const {client} = testEnvironment;

      const response = await client.put('/foo', {}, {
				name: 'Max Mustermann'
			});

      expect(response.statusCode).to.equal(200);
    });

  });

  describe('when request body matches schema', function() {

		it('response is 400 Bad Request', async function() {
      await setupEndpoint();
      const {client} = testEnvironment;

      const response = await client.put('/foo', {}, {});

      expect(response.statusCode).to.equal(400);
    });

		it('response body contains errors', async function() {
			await setupEndpoint();
			const {client} = testEnvironment;

			const response = await client.put('/foo', {}, {});

			expect(response.statusCode).to.equal(400);
		});

  });

});
