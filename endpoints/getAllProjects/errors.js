// Base Custom Error
class CustomError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.headers = getHeaders();
    }
  }
  
  // Not Found Error
  class NotFoundError extends CustomError {
    constructor(message = 'Not Found') {
      super(message, 404);
    }
  }
  
  // BadRequest Error
  class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
      super(message, 400);
    }
  }
  
  // Database Error
  class DatabaseError extends CustomError {
    constructor(message = 'Database Error') {
      super(message, 500);
    }
  }
  
  const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': '*',
  };
  
  const getHeaders = () => DEFAULT_HEADERS;
  
  export {
    NotFoundError,
    BadRequestError,
    DatabaseError,
    CustomError,
    getHeaders,
  };
  