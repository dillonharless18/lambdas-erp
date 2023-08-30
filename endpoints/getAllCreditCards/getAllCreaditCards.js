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

const getAllCreditCards = async () => {
  await initializeDb();
  try {
    // const creditCards = await knexInstance.select('*').from('credit_card');
    const creditCards = await knexInstance
      .select(
        'cc.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('credit_card as cc')
      .join('user as createdBy', 'createdBy.user_id', '=', 'cc.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'cc.last_updated_by')
      .where('cc.is_active', true);

    return {
      statusCode: 200,
      body: JSON.stringify(creditCards),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getAllCreditCards;
