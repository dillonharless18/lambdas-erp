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
  () => require('../../__mocks__/errosMock.js'),
  { virtual: true }
);

jest.mock(
  '/opt/nodejs/apiResponseUtil.js',
  () => require('../../__mocks__/apiResponseUtilMock.js'),
  { virtual: true }
);

describe('getAllVehicleTypes', () => {
  let getAllVehicleTypes;

  beforeEach(() => {
    jest.clearAllMocks();

    getAllVehicleTypes = require('./getAllVehicleType.js').default;

    const tracker = mockDb.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
      query.response([
        {
          vehicle_type_id: 1,
          vehicle_type_name: 'Personal Vehicle',
          is_active: true,
          created_by: 'cd66a3c9-92a8-40f8-8f00-f8fc355bba3b',
          last_updated_by: '2a8c380e-21c6-4f28-9291-46ff0869474c',
          created_at: '2023-05-16T15:09:50.698Z',
          last_updated_at: '2023-05-16T15:09:50.698Z',
          createdby: 'Muhammad  Navaid R',
          updatedby: 'Talha Altaf',
        },
      ]);
    });
  });

  afterEach(() => {
    mockDb.getTracker().uninstall();
  });

  it('should return a list of all vehicle types', async () => {
    const result = await getAllVehicleTypes();

    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body).toBeInstanceOf(Array);

    const vehicleType = body[0];
    expect(vehicleType).toMatchObject({
      vehicle_type_id: expect.any(Number),
      vehicle_type_name: expect.any(String),
      is_active: expect.any(Boolean),
      created_by: expect.any(String),
      last_updated_by: expect.any(String),
      created_at: expect.any(String),
      last_updated_at: expect.any(String),
      createdby: expect.any(String),
      updatedby: expect.any(String),
    });
  });
});
