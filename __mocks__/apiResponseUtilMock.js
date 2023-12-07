module.exports = {
  createSuccessResponse: jest.fn((data) => ({
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })),
  createErrorResponse: jest.fn((error) => ({
    statusCode: error.statusCode || 500,
    body: JSON.stringify({ error: error.message }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })),
};
