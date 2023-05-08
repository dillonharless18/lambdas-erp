const { getUrgentOrderStatus } = require("./getUrgentOrderStatus");

exports.handler = async () => {
  try {
    return await getUrgentOrderStatus();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};
