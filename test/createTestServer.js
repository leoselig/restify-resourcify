import {defer} from 'q';
import {createServer} from 'restify';
import registerResources from '../src/register';
import {spyOnServer, stopSpyingOnServer} from './serverSpying';

export default async (resource) => {
  const server = await startServer(resource);
  return {
    server,
    async stop() {
      stopSpyingOnServer(server);
      const deferred = defer();
      server.close(() => {
        deferred.resolve();
      });
      return deferred.promise;
    }
  };
};

async function startServer(resource) {
  const server = createServer();

  spyOnServer(server);

  registerResources(server, [resource]);

  const deferred = defer();
  server.listen(8880, () => {
    deferred.resolve(server);
  });

  return deferred.promise;
}
