import getAllVendors from "./getAllVendors.js";

const handler = async () => {
  try {
    return await getAllVendors();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler }