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

describe('getAllProjects', () => {
  let getAllProjects;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    getAllProjects = require('./getAllProjects').default;

    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
      query.response([
        {
          project_id: 1,
          project_name: 'Job 1',
          is_active: true,
          created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
          last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
          created_at: '2023-05-17T03:27:13.141Z',
          last_updated_at: '2023-08-16T17:56:42.522Z',
          project_code: 'P1',
          material_budget: '24.00',
          labor_budget: '12.00',
          createdby: 'Default Default',
          updatedby: 'Shakir Ullah',
        },
      ]);
    });
  });

  afterEach(() => {
    mockDb.getTracker().uninstall();
  });

  it('should return a list of projects', async () => {
    const event = {
      queryStringParameters: {
        isAll: 'true',
      },
    };

    const result = await getAllProjects(event.queryStringParameters.isAll);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(result.body);
    expect(body).toBeInstanceOf(Array);
  });

  it('should throw NotFoundError when no projects are found', async () => {
    const event = {
      queryStringParameters: {
        isAll: 'false',
      },
    };

    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([]);
      }
    });

    await expect(
      getAllProjects(event.queryStringParameters.isAll)
    ).rejects.toThrow(errors.NotFoundError);

    tracker.uninstall();
  });

  it('should return a list of projects with expected properties', async () => {
    const event = {
      queryStringParameters: {
        isAll: 'true',
      },
    };

    const result = await getAllProjects(event.queryStringParameters.isAll);

    expect(result.statusCode).toBe(200);

    expect(result.headers).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    const projects = JSON.parse(result.body);

    expect(projects).toBeInstanceOf(Array);

    expect(projects).toHaveLength(1);

    const project = projects[0];
    expect(project).toMatchObject({
      project_id: expect.any(Number),
      project_name: expect.any(String),
      is_active: expect.any(Boolean),
      created_by: expect.any(String),
      last_updated_by: expect.any(String),
      created_at: expect.any(String),
      last_updated_at: expect.any(String),
      project_code: expect.any(String),
      material_budget: expect.any(String),
      labor_budget: expect.any(String),
      createdby: expect.any(String),
      updatedby: expect.any(String),
    });
  });
});
