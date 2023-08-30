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

const getAllVendors = async () => {
  await initializeDb();
  try {
    // const AllVendors = await knexInstance.select('*').from('vendor');
    const allVendors = await knexInstance
      .select(
        'v.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('vendor as v')
      .join('user as createdBy', 'createdBy.created_by', '=', 'v.created_by')
      .join(
        'user as updatedBy',
        'updatedBy.last_updated_by',
        '=',
        'v.last_updated_by'
      )
      .where('v.is_active', true);
    return {
      statusCode: 200,
      body: JSON.stringify(allVendors),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getAllVendors;
