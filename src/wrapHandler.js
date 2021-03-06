import {info as logInfo, error as logError} from 'npmlog';

export default (handler) => {
  return async (request, response, next) => {
    logInfo('server', request.method + ' ' + request.url);
    try {
      const responseDescription = await handler(request, response, next) || {};
      objectToResponse(request, responseDescription, response);
      next();
    } catch (error) {
      logError('server', error);
      next(error);
    }
  };
};

function objectToResponse({method}, responseDescription, response) {
  let responseStatusCode = 200;
  if (responseDescription.statusCode) {
    responseStatusCode = responseDescription.statusCode;
  } else if (method === 'POST') {
    responseStatusCode = 201;
  }
  response.send(responseStatusCode, responseDescription.data ? responseDescription.data : '');
}
