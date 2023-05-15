import getAllProjects from "./getAllProjects.js";

const handler = async () => {
  try {
    return await getAllProjects();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
