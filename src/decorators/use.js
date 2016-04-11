import {endpoint} from '../access';

export default function use(middleware) {
  return (resourcePrototype, name) => {
    const endpointDescription = endpoint(resourcePrototype.constructor, name);
    endpointDescription.filters.push(createUseFilter(middleware));
  };
}

function createUseFilter(middleware) {
  return (request, response, next) => {
    return middleware(request, response, next);
  };
}
