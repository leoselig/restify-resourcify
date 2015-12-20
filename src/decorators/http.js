import {endpoint} from '../access';

export const HEAD = createHTTPDecorator('HEAD');
export const GET = createHTTPDecorator('GET');
export const POST = createHTTPDecorator('POST');
export const PUT = createHTTPDecorator('PUT');
export const DELETE = createHTTPDecorator('DELETE');

function createHTTPDecorator(httpMethod) {
  return (resourcePrototype, name, descriptor) => {
    const endpointDescription = endpoint(resourcePrototype.constructor, name);
    endpointDescription.methodName = name;
    endpointDescription.http = httpMethod;
    return descriptor;
  };
}
