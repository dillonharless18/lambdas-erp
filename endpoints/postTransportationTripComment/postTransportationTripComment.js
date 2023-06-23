import TransportationTripComment from './DTO/TransportationTripComment.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const postTransportationTripComment = async (comment, transportationTripId) => {
  await initializeDb();

  if (
    !comment ||
    typeof comment !== 'object' ||
    Object.keys(comment).length === 0 ||
    !comment.comment_text ||
    comment.comment_text.trim() === ''
  ) {
    throw new Error(
      'The comment and comment_text parameters must not be empty and should be an object with some keys'
    );
  }

  const transportationTripComment = new TransportationTripComment(comment);

  const dataToInsert = {
    transportation_trip_comment_id: uuidv4(),
    transportation_trip_id: transportationTripId,
    comment_text: transportationTripComment.comment_text,
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('transportation_trip_comment').insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transportation Trip Comment added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in posTransportationTripComment', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postTransportationTripComment;
