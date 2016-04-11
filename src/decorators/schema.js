import {validate} from 'jsonschema';
import {BadRequestError} from 'restify';
import {endpoint} from '../access';

export default function schema(schemaJSON) {
  return (resourcePrototype, name) => {
    const endpointDescription = endpoint(resourcePrototype.constructor, name);
    endpointDescription.filters.push(createSchemaFilter(schemaJSON));
  };
}

function createSchemaFilter(schema) {
  return (request) => {
    const {valid, errors} = validate(request.body, schema);
    if (!valid) {
      throw new BadRequestError({body: errors});
    }
  };
}
