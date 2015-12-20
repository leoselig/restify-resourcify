import npmlog from 'npmlog';
import pathUtils from 'path';
import {resource} from './access';
import {wrapHandler} from './wrapHandler';

export default class Resource {

  constructor(server) {
    const {endpoints, basePath} = resource(this.constructor);
    endpoints.forEach((endpoint) => {
      const {http, methodName, methodPath} = endpoint;
      const completePath = pathUtils.join(basePath, methodPath || '').replace(/\\/g, '/');
      const register = ::server[http.toLowerCase()];
      const endpointMethod = ::this[methodName];
      register(completePath, wrapHandler(endpointMethod));
      npmlog.info('server', `Registered handler for: ${http} ${completePath}`);
    });
  }

}
