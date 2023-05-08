// const { getAllProjects } = require("./getAllProjects");

exports.handler = async () => {
  try {
    return "working fine"
    // return await getAllProjects();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};
