const resources = new WeakMap();

export function resource(Resource) {
  if (!resources.has(Resource)) {
    resources.set(Resource, {
      basePath: null,
      endpoints: []
    });
  }
  return resources.get(Resource);
}

export function endpoint(Resource, name) {
  const {endpoints} = resource(Resource);
  const endpoint = endpoints.find((endpoint) => {
    return endpoint.methodName === name;
  });
  if (endpoint) {
    return endpoint;
  }
  const newEndpoint = {
    methodName: name,
    http: null,
    methodPath: null,
    filters: []
  };
  endpoints.push(newEndpoint);
  return newEndpoint;
}
