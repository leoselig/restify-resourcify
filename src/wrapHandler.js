import {info as logInfo, error as logError} from 'npmlog';

export default (handler) => {
  return (request, response, next) => {
    logInfo('server', request.method + ' ' + request.url);
    handler(request)
    .then((responseInfo) => {
      objectToResponse(responseInfo, response);
      next();
    })
    .catch((error) => {
      logError('server', error);
    });
    return handler.call(this, request);
  };
};

function objectToResponse(responseInfo, response) {
  response.send(responseInfo.data);
}
