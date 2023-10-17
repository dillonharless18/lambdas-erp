import postTransportationTripComment from './postTransportationTripComment.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    const userSub = event.requestContext.authorizer.sub;
    if (!transportationTripId) {
      throw new BadRequestError(
        'Missing transportation_trip_id path parameter'
      );
    }

    return await postTransportationTripComment(
      comment,
      transportationTripId,
      userSub
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
