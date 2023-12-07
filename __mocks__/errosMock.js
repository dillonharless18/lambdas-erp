module.exports = {
  NotFoundError: class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
    }
  },
  DatabaseError: class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DatabaseError';
      this.statusCode = 500;
    }
  },
  InternalServerError: class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalServerError';
      this.statusCode = 500;
    }
  }
};
