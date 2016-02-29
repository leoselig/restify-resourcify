import sinon from 'sinon';

export function spyOnServer(server) {
  sinon.spy(server, 'head');
  sinon.spy(server, 'get');
  sinon.spy(server, 'post');
  sinon.spy(server, 'put');
  sinon.spy(server, 'del');
}

export function stopSpyingOnServer(server) {
  server.head.restore();
  server.get.restore();
  server.post.restore();
  server.put.restore();
  server.del.restore();
}
