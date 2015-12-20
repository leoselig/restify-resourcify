import {resource, endpoint} from '../../../src/access';
import path from '../../../src/decorators/path';
import {expect} from 'chai';

describe('@path', function() {

  describe('on resources', function() {

    let Class;

    beforeEach(function() {
      @path('/test')
      class NewClass {

      }

      Class = NewClass;
    });

    it('sets path to passed argument', function() {
      expect(resource(Class).basePath).to.equal('/test');
    });

    it('throws error when argument to path is not a string', function() {
      function declareInvalid() {
        @path({})
        class NewClass {

        }
        return NewClass;
      }
      expect(declareInvalid).to.throw(Error);
    });

    it('throws error when trying to redefine path', function() {
      function declareTwice() {
        @path('/test')
        @path('/anothertest')
        class NewClass {

        }
        return NewClass;
      }
      expect(declareTwice).to.throw(Error);
    });

  });

  describe('on endpoints', function() {

    let Class;

    beforeEach(function() {
      
      @path('/test')
      class NewClass {

        @path('/foo')
        async foo() {

        }

      }

      Class = NewClass;
    });

    it('sets path to passed argument', function() {
      expect(endpoint(Class, 'foo').methodPath).to.equal('/foo');
    });

    it('throws error when argument to path is not a string', function() {
      function declareInvalid() {
        @path('/test')
        class NewClass {

          @path({})
          async foo() {

          }

        }
        return NewClass;
      }
      expect(declareInvalid).to.throw(Error);
    });

    it('throws error when trying to redefine path', function() {
      function declareTwice() {
        @path('/test')
        class NewClass {

          @path('/foo')
          @path('/bar')
          async foo() {

          }

        }
        return NewClass;
      }
      expect(declareTwice).to.throw(Error);
    });

    it('actually adds endpoint to resource description', function() {
      var description = endpoint(Class, 'foo');
      expect(resource(Class).endpoints).to.contain(description);
    });

  });

});
