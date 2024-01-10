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

describe("getAllProjects", () => {
    let getAllProjects;

    beforeEach(() => {
        jest.clearAllMocks();

        getAllProjects = require("./getAllProjects").default;

        const tracker = mockDb.getTracker();
        tracker.install();
        tracker.on("query", (query) => {
            query.response([
                {
                    project_id: 1,
                    project_name: "Job 1",
                    is_active: true,
                    created_by: "1b3ef41c-23af-4eee-bbd7-5610b38e37f2",
                    last_updated_by: "4566a3j7-92a8-40f8-8f00-f8fc355bbk7g",
                    created_at: "2023-05-17T03:27:13.141Z",
                    last_updated_at: "2023-08-16T17:56:42.522Z",
                    project_code: "P1",
                    material_budget: "24.00",
                    labor_budget: "12.00",
                    createdby: "Default Default",
                    updatedby: "Shakir Ullah",
                },
            ]);
        });
    });

    afterEach(() => {
        mockDb.getTracker().uninstall();
    });

    it("should return a list of projects", async () => {
        const {
            queryStringParameters: {
                isAll,
                searchText,
                pageNumber,
                pageSize,
                status,
            },
        } = {
            queryStringParameters: {
                isAll: "true",
                searchText: "",
                pageNumber: 1,
                pageSize: 10,
                status: "true",
            },
        };

        const result = await getAllProjects(
            isAll,
            searchText,
            pageNumber,
            pageSize,
            status
        );

        expect(result.statusCode).toBe(200);
        expect(result.headers).toEqual({
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        });

        const body = JSON.parse(result.body);
        expect(body).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(String),
        });
    });

    it("should return a list of projects with expected properties", async () => {
        const {
            queryStringParameters: {
                isAll,
                searchText,
                pageNumber,
                pageSize,
                status,
            },
        } = {
            queryStringParameters: {
                isAll: "true",
                searchText: "",
                pageNumber: 1,
                pageSize: 10,
                status: "true",
            },
        };

        const result = await getAllProjects(
            isAll,
            searchText,
            pageNumber,
            pageSize,
            status
        );

        expect(result.statusCode).toBe(200);

        expect(result.headers).toEqual({
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        });

        const projects = JSON.parse(result.body);
        expect(projects).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(String),
        });
        const project = projects.data[0];

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
