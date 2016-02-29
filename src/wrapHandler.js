import {info as logInfo, error as logError} from 'npmlog';

export default (handler) => {
  return async (request, response, next) => {
    logInfo('server', request.method + ' ' + request.url);
    try {
      const responseDescription = await handler(request) || {};
      objectToResponse(responseDescription, response);
      next();
    } catch (error) {
      logError('server', error);
      next(error);
    }
  };
};

function objectToResponse(responseDescription, response) {
  response.send(responseDescription.data ? responseDescription.data : '');
}
