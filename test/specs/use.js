import createTestEnvironment from '../createTestEnvironment';
import path from '../../src/decorators/path';
import {PUT} from '../../src/decorators/http';
import use from '../../src/decorators/use';
import {expect} from 'chai';
import {spy, match} from 'sinon';

describe('@use', function() {

	let testEnvironment, endpoint, middleware;

  async function setupEndpoint() {
		middleware = spy((request, response, next) => {
			next();
		});

    @path('/foo')
    class TestResource {
      @PUT
      @use(middleware)
      async bar() {

      }
    }
    const resource = new TestResource();
    endpoint = spy(resource, 'bar');
    testEnvironment = await createTestEnvironment(resource);
  }

  afterEach(async function() {
    endpoint.restore();
    await testEnvironment.tearDown();
  });

	describe('when requesting endpoint with @use() decorator', () => {

		let response;

		beforeEach(async () => {
			await setupEndpoint();
			const {client} = testEnvironment;

			response = await client.put('/foo', {}, {});
		});

		it('original handler is called', function() {
			expect(endpoint).to.have.been.calledOnce;
		});

		it('passed middleware is called', function() {
			expect(middleware).to.have.been.calledOnce;
		});

		it('passed middleware is called with Connect-style parameters', function() {
			expect(middleware).to.have.been.calledWithExactly(match.object, match.object, match.func);
		});

		it('passed middleware is called with Connect-style parameters', function() {
			expect(middleware).to.have.been.calledBefore(endpoint);
		});

	});

});
