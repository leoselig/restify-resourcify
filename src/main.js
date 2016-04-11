import registerResources from './register';
import {HEAD, GET, POST, PUT, DELETE} from './decorators/http';
import path from './decorators/path';
import schema from './decorators/schema';
import use from './decorators/use';

export {
  HEAD, GET, POST, PUT, DELETE,
  path, schema, use,
  registerResources
};
