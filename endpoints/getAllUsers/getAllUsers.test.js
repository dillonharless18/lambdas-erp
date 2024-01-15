// Mock the modules using the external mock files
const mockDb = require("mock-knex");

jest.mock(
    "/opt/nodejs/db/index.js",
    () => ({
        __esModule: true,
        default: () => {
            const knex = require("knex")({
                client: "pg",
            });
            mockDb.mock(knex);
            return knex;
        },
    }),
    { virtual: true }
);

jest.mock(
    "/opt/nodejs/errors.js",
    () => require("../../__mocks__/errosMock.js"),
    {
        virtual: true,
    }
);
jest.mock(
    "/opt/nodejs/apiResponseUtil.js",
    () => require("../../__mocks__/apiResponseUtilMock.js"),
    { virtual: true }
);
jest.mock(
    "/opt/nodejs/backendUtil.js",
    () => require("../../__mocks__/backendUtilMock.js"),
    { virtual: true }
);

describe("getAllUsers", () => {
    let getAllUsers;
    beforeEach(() => {
        jest.clearAllMocks();

        getAllUsers = require("./getAllUsers.js").default;

        const tracker = mockDb.getTracker();
        tracker.install();
        tracker.on("query", (query) => {
            query.response({
                data: [
                    {
                        user_id: "cd66a3c9-92a8-40f8-8f00-f8fc355bba3b",
                        is_active: true,
                        first_name: "Muhammad ",
                        last_name: "Navaid R",
                        phone_number: "+11111111111",
                        created_at: "2023-05-20T04:46:25.398Z",
                        last_updated_at: "2023-11-23T12:42:06.015Z",
                        ocr_tool_id: "random_test_id",
                        user_email: "navaid@cloudfruit.com",
                        user_role: "admin",
                        cognito_sub: "e3c95d3a-01af-44b9-b55a-33cc17da990a",
                        created_by: "4566a3j7-92a8-40f8-8f00-f8fc355bbk7g",
                        last_updated_by: "cd66a3c9-92a8-40f8-8f00-f8fc355bba3b",
                        createdby: "Shakir Ullah",
                        updatedby: "Muhammad  Navaid R",
                    },
                ],
                totalCount: 1,
            });
        });
    });

    afterEach(() => {
        mockDb.getTracker().uninstall();
    });

    it("should return a list of all users", async () => {
        const result = await getAllUsers();

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);
        const response = body.data;
        expect(response).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(Number),
        });
    });

    it("should ensure the Json body has the correct column types", async () => {
        const result = await getAllUsers();

        expect(result.statusCode).toBe(200);

        const users = JSON.parse(result.body);
        const response = users.data;
        expect(response).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(Number),
        });
        expect(response.data).toHaveLength(1);

        const credirCard = response.data[0];
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
