import invariant from 'invariant';
import {resource, endpoint} from '../access';

export default function path(path) {
  invariant(typeof path === 'string', 'path argument must be a string');
  return (...args) => {
    if (args.length === 1) {
      return rootPath(path, ...args);
    } else {
      return endpointPath(path, ...args);
    }
  };
}

function rootPath(path, Resource) {
  const resourceDescription = resource(Resource);
  invariant(typeof resourceDescription.basePath !== 'string', 'Cannot redefine path on resource');
  resourceDescription.basePath = path;
  return Resource;
}

function endpointPath(path, resourcePrototype, name) {
  const endpointDescription = endpoint(resourcePrototype.constructor, name);
  invariant(typeof endpointDescription.methodPath !== 'string', 'Cannot redefine path on endpoint');
  endpointDescription.methodPath = path;
}
