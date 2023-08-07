import getAllProjects from './getAllProjects.js';

const handler = async (event, context) => {
  try {
    return await getAllProjects();
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
      headers: error.headers,
    };
  }
};

export { handler };
