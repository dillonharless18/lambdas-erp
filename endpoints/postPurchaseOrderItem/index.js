const { postPurchaseOrderItems } = require("./postPurchaseOrderItems");

exports.handler = async (event) => {
  try {
    return await postPurchaseOrderItems(event);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};
