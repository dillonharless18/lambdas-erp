const serverless = require('serverless-http');
const express = require('express');
const app = express();

const db = require('./db');

app.get('/projects', async (req, res) => {
  try {
    const projects = await db('onexerp').select('*').from('project');
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports.handler = serverless(app);
