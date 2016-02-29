import createTestServer from './createTestServer';
import createTestClient from './createTestClient';

export default async (resource) => {
  const {server, stop} = await createTestServer(resource);

  return {
    server,
    client: createTestClient(),
    async tearDown() {
      await stop();
    }
  };
};
