import initializeKnex from "/opt/nodejs/db/index.js";
import { InternalServerError, DatabaseError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";

let knexInstance;

const initializeDb = async () => {
    try {
        if (!knexInstance) {
            knexInstance = await initializeKnex();
        }
    } catch (error) {
        console.error("Error initializing database:", error.stack);
        throw new DatabaseError("Failed to initialize the database.");
    }
};

const getTransportationTrips = async (
    transportationTripStatus,
    isAll,
    searchText,
    pageNumber,
    pageSize
) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        let query = knexInstance("transportation_trip")
            .select([
                "transportation_trip.*",
                knexInstance.raw(
                    "(driver.first_name || ' ' || driver.last_name) as driverName"
                ),
                knexInstance.raw(
                    "(requester.first_name || ' ' || requester.last_name) as requester"
                ),
                "transportation_trip_status.transportation_trip_status_name",
                "vehicle_type.vehicle_type_name",
                knexInstance.raw(
                    "(SELECT count(*) FROM public.transportation_trip_comment WHERE transportation_trip_id = transportation_trip.transportation_trip_id) as comment_count"
                ),
                knexInstance.raw(`
                  json_agg(
                    json_build_object(
                      'purchase_order_transportation_request_id',request.purchase_order_transportation_request_id,
                      'purchase_order_id',request.purchase_order_id,
                      'item_name',request.item_name,
                      'purchase_order_number', po.purchase_order_number,
                      'from_location',request.from_location,
                      'to_location',request.to_location,
                      'additional_details',request.additional_details,
                      'created_at',request.created_at,
                      'last_updated_at',request.last_updated_at,
                      'future_transportation_date', request.future_transportation_date,
                      'transportation_time', request.transportation_time,
                      'contact_name', request.contact_name,
                      'contact_number', request.contact_number,
                      'recipients', request.recipients,
                      's3_uri', request.s3_uri,
                      'urgent_order_status_id', urgent_order_request.urgent_order_status_id,
                      'urgent_order_status_name', urgent_order_request.urgent_order_status_name,
                      'created_by', user_created_request.user_id,
                      'requester', user_created_request.first_name || ' ' || user_created_request.last_name
                    )
                  ) as purchase_order_transportation_requests
                `),
            ])
            .join(
                "transportation_trip_by_purchase_order_transportation_request as po_request",
                "transportation_trip.transportation_trip_id",
                "=",
                "po_request.transportation_trip_id"
            )
            .join(
                "purchase_order_transportation_request as request",
                "request.purchase_order_transportation_request_id",
                "=",
                "po_request.purchase_order_transportation_request_id"
            )
            .leftJoin(
                "user as driver",
                "transportation_trip.driver_id",
                "driver.user_id"
            )
            .leftJoin(
                "user as requester",
                "transportation_trip.created_by",
                "requester.user_id"
            )
            .leftJoin(
                "transportation_trip_status",
                "transportation_trip.transportation_trip_status_id",
                "transportation_trip_status.transportation_trip_status_id"
            )
            .leftJoin(
                "vehicle_type",
                "transportation_trip.vehicle_type_id",
                "vehicle_type.vehicle_type_id"
            )
            .leftJoin(
                "user as user_created_request",
                "request.created_by",
                "user_created_request.user_id"
            )
            .leftJoin(
                "urgent_order_status as urgent_order_request",
                "request.urgent_order_status_id",
                "urgent_order_request.urgent_order_status_id"
            )
            .leftJoin(
                "purchase_order as po",
                "po.purchase_order_id",
                "request.purchase_order_id"
            )
            .where("request.is_active", true)
            .groupBy(
                "transportation_trip.transportation_trip_id",
                "driver.user_id",
                "vehicle_type.vehicle_type_id",
                "transportation_trip_status.transportation_trip_status_id",
                "requester.user_id"
            )
            .orderBy("transportation_trip.created_at", "asc");

        if (!isAll) {
            query = query.where("transportation_trip.is_active", true);
        }

        if (transportationTripStatus) {
            let transportaionTripStatusID = await knexInstance(
                "transportation_trip_status"
            )
                .select("transportation_trip_status_id")
                .where(
                    "transportation_trip_status_name",
                    transportationTripStatus
                )
                .first();

            query = query.andWhere(
                "transportation_trip.transportation_trip_status_id",
                transportaionTripStatusID.transportation_trip_status_id
            );
        }
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(transportation_trip.trip_name, ' ', transportation_trip_status.transportation_trip_status_name, ' ', requester.first_name, ' ', requester.last_name, ' ', driver.first_name, ' ', driver.last_name, ' ', vehicle_type.vehicle_type_name)`
                ),
                `%${searchText}%`
            );
        }

        const countQuery = query
            .clone()
            .select(knexInstance.raw("COUNT(*) OVER() as count"))
            .limit(1)
            .first();

        const totalCount = (await countQuery).count;

        const transportationTrips = await query
            .clone()
            .offset(offset)
            .limit(pageSize);

        return createSuccessResponse({ data: transportationTrips, totalCount });
    } catch (error) {
        console.error("Error fetching Transportation Trips", error);
        throw new InternalServerError();
    }
};
export default getTransportationTrips;
