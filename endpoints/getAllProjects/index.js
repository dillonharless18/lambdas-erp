const serverless = require('serverless-http');
const express = require('express');
const app = express();

const initializeKnex = require('./db');

let knexInstance;

const initializeDb = async () => {
  if (!knexInstance) {
    knexInstance = await initializeKnex();
  }
};

app.get('/project', async (req, res) => {
  try {
    await initializeDb();
    const projects = await knexInstance('onexerp').select('*').from('project');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports.handler = serverless(app);
