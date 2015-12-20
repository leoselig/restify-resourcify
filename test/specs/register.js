import path from '../../src/decorators/path';
import registerResources from '../../src/register';
import {GET} from '../../src/decorators/http';
import createServerSpy from '../createServerSpy';
import {expect} from 'chai';
import sinon from 'sinon';

describe('register', function() {

  describe('initialization', function() {

    it('calls get() for endpoint handleGET with path test/', function() {
      @path('test')
      class TestResource {
        @GET
        async handleGET() {

        }
      }
      const serverSpy = createServerSpy();
      registerResources(serverSpy, [new TestResource()]);

      expect(serverSpy.get).to.have.been.calledWithMatch('test', sinon.match.func);
    });

    it('calls get() for endpoint handleGETCustom with path test/custom', function() {
      @path('test')
      class TestResource {
        @GET
        @path('custom')
        async handleGETCustom() {

        }
      }
      const serverSpy = createServerSpy();
      registerResources(serverSpy, [new TestResource()]);

      expect(serverSpy.get).to.have.been.calledWithMatch('test/custom', sinon.match.func);
    });

  });

});
