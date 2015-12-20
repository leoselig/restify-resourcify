import {resource, endpoint} from '../../../src/access';
import {HEAD, GET, POST, PUT, DELETE} from '../../../src/decorators/http';
import {expect} from 'chai';

describe('decorators/http', function() {

  const httpToDecorator = {
    HEAD,
    GET,
    POST,
    PUT,
    DELETE
  };

  Object.keys(httpToDecorator).forEach((httpMethod) => {

    const httpDecorator = httpToDecorator[httpMethod];

    describe(`@${httpMethod}`, function() {

      let Class;

      beforeEach(function() {
        class NewClass {

          @httpDecorator
          async test() {

          }

        }

        Class = NewClass;
      });

      it(`sets http method to ${httpMethod}`, function() {
        expect(endpoint(Class, `test`).http).to.equal(httpMethod);
      });

      it('sets name of method for handling requests', function() {
        expect(endpoint(Class, 'test').methodName).to.equal('test');
      });

    });

  });

});
