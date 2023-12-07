const mockDb = require('mock-knex');

jest.mock(
  '/opt/nodejs/db/index.js',
  () => ({
    __esModule: true,
    default: () => {
      const knex = require('knex')({
        client: 'pg',
      });
      mockDb.mock(knex);
      return knex;
    },
  }),
  { virtual: true }
);

jest.mock(
  '/opt/nodejs/errors.js',
  () => ({
    __esModule: true,
    InternalServerError: class InternalServerError extends Error {
      constructor(message) {
        super(message);
        this.name = 'InternalServerError';
        this.statusCode = 500;
      }
    },
    DatabaseError: class DatabaseError extends Error {
      constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
      }
    },
  }),
  { virtual: true }
);

const errors = jest.requireMock('/opt/nodejs/errors.js');

jest.mock(
  '/opt/nodejs/apiResponseUtil.js',
  () => ({
    _esModule: true,
    createSuccessResponse: jest.fn((data) => ({
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Constrol-Allow-Origin': '*',
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
  }),
  { virtual: true }
);

describe('getAllUsers', () => {
  let getAllUsers;
  beforeEach(() => {
    jest.clearAllMocks();

    getAllUsers = require('./getAllUsers.js').default;

    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
      query.response([
        {
          user_id: 'cd66a3c9-92a8-40f8-8f00-f8fc355bba3b',
          is_active: true,
          first_name: 'Muhammad ',
          last_name: 'Navaid R',
          phone_number: '+11111111111',
          created_at: '2023-05-20T04:46:25.398Z',
          last_updated_at: '2023-11-23T12:42:06.015Z',
          ocr_tool_id: 'random_test_id',
          user_email: 'navaid@cloudfruit.com',
          user_role: 'admin',
          cognito_sub: 'e3c95d3a-01af-44b9-b55a-33cc17da990a',
          created_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
          last_updated_by: 'cd66a3c9-92a8-40f8-8f00-f8fc355bba3b',
          createdby: 'Shakir Ullah',
          updatedby: 'Muhammad  Navaid R',
        },
      ]);
    });
  });

  afterEach(() => {
    mockDb.getTracker().uninstall();
  });

  it('should return a list of all users', async () => {
    const result = await getAllUsers();

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body).toBeInstanceOf(Array);
  });

  it('should ensure the Json body has the correct column types', async () => {
    const result = await getAllUsers();

    expect(result.statusCode).toBe(200);

    const credirCards = JSON.parse(result.body);

    expect(credirCards).toBeInstanceOf(Array);
    expect(credirCards).toHaveLength(1);

    const credirCard = credirCards[0];
    expect(credirCard).toMatchObject({
      user_id: expect.any(String),
      is_active: expect.any(Boolean),
      first_name: expect.any(String),
      last_name: expect.any(String),
      phone_number: expect.any(String),
      created_at: expect.any(String),
      last_updated_at: expect.any(String),
      ocr_tool_id: expect.any(String),
      user_email: expect.any(String),
      user_role: expect.any(String),
      cognito_sub: expect.any(String),
      created_by: expect.any(String),
      last_updated_by: expect.any(String),
      created_by: expect.any(String),
      updatedby: expect.any(String),
    });
  });
});
