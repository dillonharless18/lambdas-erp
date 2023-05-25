import initializeKnex from '/opt/nodejs/db/index.js';

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

const getUrgentOrderStatus = async () => {
  await initializeDb();
  try {
    const urgentOrderStatus = await knexInstance
      .select('*')
      .from('urgent_order_status');
    return {
      statusCode: 200,
      body: JSON.stringify(urgentOrderStatus),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching urgentOrderStatus:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getUrgentOrderStatus;
