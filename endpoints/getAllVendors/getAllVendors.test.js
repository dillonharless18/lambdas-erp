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

describe("getAllVendors", () => {
    let getAllVendors;

    beforeEach(() => {
        jest.clearAllMocks();

        getAllVendors = require("./getAllVendors.js").default;

        const tracker = mockDb.getTracker();
        tracker.install();
        tracker.on("query", (query) => {
            query.response({
                data: [
                    {
                        vendor_id: 1,
                        vendor_name: "Default",
                        is_active: true,
                        created_by: "1b3ef41c-23af-4eee-bbd7-5610b38e37f2",
                        last_updated_by: "cd66a3c9-92a8-40f8-8f00-f8fc355bba3b",
                        created_at: "2023-05-17T03:33:02.602Z",
                        last_updated_at: "2023-12-06T16:58:32.263Z",
                        is_net_vendor: true,
                        billing_contact: "tet",
                        billing_contact_number: "979879789",
                        account_payable_contact: "test",
                        account_payable_contact_number: "343453453",
                        tax_ID: "desired_value_for_tax_ID",
                        billed_from_address1: "address 1",
                        billed_from_address2: "address 2",
                        payment_terms: "Net 30",
                        email: "default@cloudfruit.com",
                        phone_number: "11111111111",
                        billed_from_city: "Test",
                        billed_from_state: "Test",
                        billed_from_postal_code: 7667,
                        billed_from_country: "land Islands",
                        shipped_from_address1: "address 1",
                        shipped_from_address2: "address 2",
                        shipped_from_city: "Test",
                        shipped_from_state: "Test",
                        shipped_from_postal_code: 7667,
                        shipped_from_country: "land Islands",
                        createdby: "Default Default",
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

    it("should retirn a list of all users", async () => {
        const result = await getAllVendors(false, "", 1, 10);

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);
        const response = body.data;
        expect(response).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(Number),
        });
    });

    it("shoudl ensure the Json body has the correct column types", async () => {
        const result = await getAllVendors(false, "", 1, 10);

        expect(result.statusCode).toBe(200);
        const vendors = JSON.parse(result.body);
        const response = vendors.data;
        expect(response).toMatchObject({
            data: expect.any(Array),
            totalCount: expect.any(Number),
        });
        expect(response.data).toHaveLength(1);

        const vendor = response.data[0];
        expect(vendor).toMatchObject({
            vendor_id: expect.any(Number),
            vendor_name: expect.any(String),
            is_active: expect.any(Boolean),
            created_by: expect.any(String),
            last_updated_by: expect.any(String),
            created_at: expect.any(String),
            last_updated_at: expect.any(String),
            is_net_vendor: expect.any(Boolean),
            billing_contact: expect.any(String),
            billing_contact_number: expect.any(String),
            account_payable_contact: expect.any(String),
            account_payable_contact_number: expect.any(String),
            tax_ID: expect.any(String),
            billed_from_address1: expect.any(String),
            billed_from_address2: expect.any(String),
            payment_terms: expect.any(String),
            email: expect.any(String),
            phone_number: expect.any(String),
            billed_from_city: expect.any(String),
            billed_from_state: expect.any(String),
            billed_from_postal_code: expect.any(Number),
            billed_from_country: expect.any(String),
            shipped_from_address1: expect.any(String),
            shipped_from_address2: expect.any(String),
            shipped_from_city: expect.any(String),
            shipped_from_state: expect.any(String),
            shipped_from_postal_code: expect.any(Number),
            shipped_from_country: expect.any(String),
            createdby: expect.any(String),
            updatedby: expect.any(String),
        });
    });
});
