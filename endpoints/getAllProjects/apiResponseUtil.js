import { getHeaders, CustomError } from './errors';

const buildApiResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: getHeaders(),
  };
};

const createErrorResponse = (errorObject) => {
  if (!(errorObject instanceof CustomError)) {
    // Handle potential non-CustomError instances gracefully
    errorObject = {
      message: 'Internal Server Error',
      statusCode: 500,
    };
  }

  return buildApiResponse(errorObject.statusCode || 500, {
    error: errorObject.message || 'Internal Server Error',
  });
};

const createSuccessResponse = (bodyObject) => {
  return buildApiResponse(200, bodyObject);
};

export { createErrorResponse, createSuccessResponse };
