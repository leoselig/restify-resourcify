import restify from 'restify';
import createTestEnvironment from '../createTestEnvironment';
import path from '../../src/decorators/path';
import {HEAD, GET, POST, PUT, DELETE} from '../../src/decorators/http';
import {expect} from 'chai';
import sinon from 'sinon';

describe('routing', function() {

  let testEnvironment;

  describe('based on paths', function() {

    let endpoint;

    describe('with path on resource only', function() {

      beforeEach(async function() {
        @path('/foo')
        class TestResource {
          @GET
          async bar() {
            return {};
          }
        }
        const resource = new TestResource();
        endpoint = sinon.spy(resource, 'bar');
        testEnvironment = await createTestEnvironment(resource);
      });

      afterEach(async function() {
        endpoint.restore();
        await testEnvironment.tearDown();
      });

      it('registers endpoint method with resource\'s @path', async function() {
        const {server} = testEnvironment;
        expect(server.get).to.have.been.calledOnce;
        expect(server.get).to.have.been.calledWith('/foo', sinon.match.typeOf('function'));
        expect(server.head).to.not.have.been.called;
        expect(server.post).to.not.have.been.called;
        expect(server.put).to.not.have.been.called;
        expect(server.del).to.not.have.been.called;
      });

      it('calls endpoint method when requesting resource\'s @path', async function() {
        const {client} = testEnvironment;
        await client.get('/foo');
        expect(endpoint).to.have.been.calledOnce;
        expect(endpoint).to.have.been.calledWith(sinon.match.typeOf('object'));
      });

    });

    describe('with path both on resource and endpoint', function() {

      beforeEach(async function() {
        @path('/foo')
        class TestResource {
          @path('/bar')
          @GET
          async bar() {
            return {};
          }
        }
        const resource = new TestResource();
        endpoint = sinon.spy(resource, 'bar');
        testEnvironment = await createTestEnvironment(resource);
      });

      afterEach(async function() {
        endpoint.restore();
        await testEnvironment.tearDown();
      });

      it('registers endpoint with the combined @path', async function() {
        const {server} = testEnvironment;
        expect(server.get).to.have.been.calledOnce;
        expect(server.get).to.have.been.calledWith('/foo/bar', sinon.match.typeOf('function'));
        expect(server.head).to.not.have.been.called;
        expect(server.post).to.not.have.been.called;
        expect(server.put).to.not.have.been.called;
        expect(server.del).to.not.have.been.called;
      });

      it('calls endpoint method at the combined @path', async function() {
        const {client} = testEnvironment;
        await client.get('/foo/bar');
        expect(endpoint).to.have.been.calledOnce;
        expect(endpoint).to.have.been.calledWith(sinon.match.typeOf('object'));
      });

    });

  });

  describe('based on HTTP method', function() {

    let resource;

    beforeEach(async function() {
      @path('/foo')
      class TestResource {

        @HEAD
        async doHead() { return {}; }

        @GET
        async doGet() { return {}; }

        @POST
        async doPost() { return {}; }

        @PUT
        async doPut() { return {}; }

        @DELETE
        async doDelete() { return {}; }

      }
      resource = new TestResource();
      sinon.spy(resource, 'doHead');
      sinon.spy(resource, 'doGet');
      sinon.spy(resource, 'doPost');
      sinon.spy(resource, 'doPut');
      sinon.spy(resource, 'doDelete');
      testEnvironment = await createTestEnvironment(resource);
    });

    afterEach(async function() {
      resource.doHead.restore();
      resource.doGet.restore();
      resource.doPost.restore();
      resource.doPut.restore();
      resource.doDelete.restore();
      await testEnvironment.tearDown();
    });

    it('registers endpoints with appropriate restify method (GET -> get(), POST -> post(), ...)', async function() {
      const {server} = testEnvironment;
      ['head', 'get', 'post', 'put', 'del'].forEach((method) => {
        expect(server[method]).to.have.been.calledOnce;
        expect(server[method]).to.have.been.calledWith('/foo', sinon.match.typeOf('function'));
      });
    });

    it('when requesting HEAD /foo, only doHead() is called', async function() {
      const {client} = testEnvironment;
      await client.head('/foo');
      expect(resource.doHead).to.have.been.calledOnce;
      expect(resource.doHead).to.have.been.calledWith(sinon.match.typeOf('object'));
      ['doGet', 'doPost', 'doPut', 'doDelete'].forEach((method) => {
        expect(resource[method]).to.not.have.been.called;
      });
    });

    it('when requesting GET /foo, only doGet() is called', async function() {
      const {client} = testEnvironment;
      await client.get('/foo');
      expect(resource.doGet).to.have.been.calledOnce;
      expect(resource.doGet).to.have.been.calledWith(sinon.match.typeOf('object'));
      ['doHead', 'doPost', 'doPut', 'doDelete'].forEach((method) => {
        expect(resource[method]).to.not.have.been.called;
      });
    });

    it('when requesting POST /foo, only doPost() is called', async function() {
      const {client} = testEnvironment;
      await client.post('/foo');
      expect(resource.doPost).to.have.been.calledOnce;
      expect(resource.doPost).to.have.been.calledWith(sinon.match.typeOf('object'));
      ['doHead', 'doGet', 'doPut', 'doDelete'].forEach((method) => {
        expect(resource[method]).to.not.have.been.called;
      });
    });

    it('when requesting PUT /foo, only doPut() is called', async function() {
      const {client} = testEnvironment;
      await client.put('/foo');
      expect(resource.doPut).to.have.been.calledOnce;
      expect(resource.doPut).to.have.been.calledWith(sinon.match.typeOf('object'));
      ['doHead', 'doGet', 'doPost', 'doDelete'].forEach((method) => {
        expect(resource[method]).to.not.have.been.called;
      });
    });

    it('when requesting DELETE /foo, only doDelete() is called', async function() {
      const {client} = testEnvironment;
      await client.del('/foo');
      expect(resource.doDelete).to.have.been.calledOnce;
      expect(resource.doDelete).to.have.been.calledWith(sinon.match.typeOf('object'));
      ['doHead', 'doGet', 'doPost', 'doPut'].forEach((method) => {
        expect(resource[method]).to.not.have.been.called;
      });
    });

  });

});
