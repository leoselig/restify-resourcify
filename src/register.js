import npmlog from 'npmlog';
import path from 'path';
import wrapHandler from './wrapHandler';
import {resource as accessResource} from './access';

const httpToRestify = {
  HEAD: 'head',
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'del'
};

export default (server, resources) => {
  resources.forEach((resource) => {
    const {endpoints, basePath} = accessResource(resource.constructor);
    endpoints.forEach((endpoint) => {
      const {http, methodName, methodPath, filters} = endpoint;
      const completePath = path.join(basePath, methodPath || '').replace(/\\/g, '/');
      const register = ::server[httpToRestify[http]];
      const endpointMethod = ::resource[methodName];
      register(completePath, wrapHandler(filters, endpointMethod));
      npmlog.info('server', `Registered handler for: ${http} ${completePath}`);
    });
  });
};
