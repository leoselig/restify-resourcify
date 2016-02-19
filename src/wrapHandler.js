import {info as logInfo, error as logError} from 'npmlog';

export default (handler) => {
  return async (request, response, next) => {
    logInfo('server', request.method + ' ' + request.url);
    try {
      const responseInfo = await handler(request);
      objectToResponse(responseInfo, response);
    } catch (error) {
      logError('server', error);
      response.send(error);
    } finally {
      next();
    }
  };
};

function objectToResponse(responseInfo, response) {
  response.send(responseInfo.data ? responseInfo.data : null);
}
