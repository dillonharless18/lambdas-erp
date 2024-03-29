import TransportationTripComment from './DTO/TransportationTripComment.js';
import {
  InternalServerError,
  DatabaseError,
  BadRequestError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error.stack);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const postTransportationTripComment = async (
  comment,
  transportationTripId,
  userSub
) => {
  await initializeDb();

  if (
    !comment ||
    typeof comment !== 'object' ||
    Object.keys(comment).length === 0 ||
    !comment.comment_text ||
    comment.comment_text.trim() === ''
  ) {
    throw new BadRequestError(
      'The comment and comment_text parameters must not be empty and should be an object with some keys'
    );
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const transportationTripComment = new TransportationTripComment(comment);

  const dataToInsert = {
    transportation_trip_comment_id: uuidv4(),
    transportation_trip_id: transportationTripId,
    comment_text: transportationTripComment.comment_text,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('transportation_trip_comment').insert(dataToInsert);

    return createSuccessResponse({
      message: 'Transportation Trip Comment added successfully!',
    });
  } catch (error) {
    console.error('Error in posTransportationTripComment', error);
    throw new InternalServerError();
  }
};

export default postTransportationTripComment;
