// Import mock-knex
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
  }),
  { virtual: true }
);

const errors = jest.requireMock('/opt/nodejs/errors.js');

jest.mock(
  '/opt/nodejs/apiResponseUtil.js',
  () => ({
    __esModule: true,
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
  }),
  { virtual: true }
);

describe('getAllCreditCards', () => {
  let getAllCreditCards;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Import the getAllCreditCards function after the mocks are set up
    getAllCreditCards = require('./getAllCreaditCards.js').default;

    // Tracker to mock the responses
    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
      query.response([
        {
          credit_card_id: 16,
          is_active: true,
          created_by: 'cd66a3c9-92a8-40f8-8f00-f8fc355bba3b',
          last_updated_by: 'cd66a3c9-92a8-40f8-8f00-f8fc355bba3b',
          created_at: '2023-10-30T12:43:12.996Z',
          last_updated_at: '2023-10-30T12:48:12.846Z',
          credit_card_last_four_digits: '0099',
          credit_card_name: 'Testing2',
          createdby: 'Muhammad  Navaid R',
          updatedby: 'Muhammad  Navaid R',
        },
      ]);
    });
  });

  afterEach(() => {
    // Uninstall the tracker after each test
    mockDb.getTracker().uninstall();
  });

  it('should return a list of credit cards', async () => {
    const result = await getAllCreditCards();

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(result.body);
    expect(body).toBeInstanceOf(Array);
    // Additional assertions can be added here
  });

  it('should ensure the JSON body has the correct column types', async () => {
    const result = await getAllCreditCards();

    expect(result.statusCode).toBe(200);

    const creditCards = JSON.parse(result.body);

    expect(creditCards).toBeInstanceOf(Array);
    expect(creditCards).toHaveLength(1);

    const creditCard = creditCards[0];
    expect(creditCard).toMatchObject({
      credit_card_id: expect.any(Number),
      is_active: expect.any(Boolean),
      created_by: expect.any(String),
      last_updated_by: expect.any(String),
      created_at: expect.any(String),
      last_updated_at: expect.any(String),
      credit_card_last_four_digits: expect.any(String),
      credit_card_name: expect.any(String),
      createdby: expect.any(String),
      updatedby: expect.any(String),
    });
  });

  // Add more tests as needed...
});
