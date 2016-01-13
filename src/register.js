import npmlog from 'npmlog';
import path from 'path';
import wrapHandler from './wrapHandler';
import {resource as accessResource} from './access';

export default (server, resources) => {
  resources.forEach((resource) => {
    const {endpoints, basePath} = accessResource(resource.constructor);
    endpoints.forEach((endpoint) => {
      const {http, methodName, methodPath} = endpoint;
      const completePath = path.join(basePath, methodPath || '').replace(/\\/g, '/');
      const register = ::server[http.toLowerCase()];
      const endpointMethod = ::resource[methodName];
      register(completePath, wrapHandler(endpointMethod));
      npmlog.info('server', `Registered handler for: ${http} ${completePath}`);
    });
  });
};
