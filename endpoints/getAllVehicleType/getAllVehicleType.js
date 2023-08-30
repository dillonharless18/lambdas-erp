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

const getAllVehicleType = async () => {
  await initializeDb();
  try {
    // const vehicleType = await knexInstance.select('*').from('vehicle_type');
    const vehicleType = await knexInstance
      .select(
        'vt.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('vehicle_type as vt')
      .join('user as createdBy', 'createdBy.user_id', '=', 'vt.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'vt.last_updated_by')
      .where('vt.is_active', true);

    return {
      statusCode: 200,
      body: JSON.stringify(vehicleType),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching vehicle type:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getAllVehicleType;
