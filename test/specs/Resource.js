import Resource from '../../src/Resource';
import path from '../../src/decorators/path';
import {GET} from '../../src/decorators/http';
import createServerSpy from '../createServerSpy';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Resource', function() {

  describe.only('initialization', function() {

    it('calls get() for endpoint handleGET with path test/', function() {
      @path('test')
      class TestResource extends Resource {
        @GET
        async handleGET() {

        }
      }
      const serverSpy = createServerSpy();
      new TestResource(serverSpy);

      expect(serverSpy.get).to.have.been.calledWithMatch('test', sinon.match.func);
    });

    it('calls get() for endpoint handleGETCustom with path test/custom', function() {
      @path('test')
      class TestResource extends Resource {
        @GET
        @path('custom')
        async handleGETCustom() {

        }
      }
      const serverSpy = createServerSpy();
      new TestResource(serverSpy);

      expect(serverSpy.get).to.have.been.calledWithMatch('test/custom', sinon.match.func);
    });

  });

});
